<template>
  <q-field
    class="project-note-draw"
    id="project-note-draw"
    stack-label
    outlined
    dense
    v-bind="$attrs"
    use-input
    use-chips
    multiple
    hide-dropdown-icon
    hide-bottom-space
    input-debounce="0"
  >
    <div class="project-note-draw__content column justify-start items-stretch">
      <div class="project-note-draw__actions row justify-end items-center">
        <q-btn
          flat
          rounded
          size="sm"
          :icon="item.icon"
          class="q-pa-sm"
          :class="{ 'bg-grey-3': item.mode == mode }"
          :style="{ color: item.mode === 'COLOR' ? color.color : '' }"
          v-for="(item, index) in actions"
          :key="index"
          @click="item.action"
        >
          <q-tooltip>{{ item.name }}</q-tooltip>
        </q-btn>
        <q-dialog
          v-if="mode === 'COLOR'"
          v-model="color.modal"
        >
          <q-card flat>
            <q-card-section>
              <q-color
                v-model="color.color"
                no-header
                no-footer
                default-view="palette"
                class="my-picker"
              />
            </q-card-section>
            <q-card-actions class="row justify-end">
              <q-chip
                size="sm"
                :style="{ backgroundColor: color.color }"
                >{{ color.color }}</q-chip
              >
              <q-btn
                class="q-ml-sm"
                flat
                size="md"
                @click="color.modal = !color.modal"
                >Close</q-btn
              >
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
      <div
        class="project-note-draw__body"
        :class="{
          'cursor-pointer': mode === 'PEN',
          'cursor-grab': draggable.active,
        }"
      >
        <v-stage
          class="project-note-draw__stage"
          ref="stage"
          :config="configKonva"
          @mousedown="handleMouseDown"
          @mousemove="handleMouseMove"
          @mouseup="handleMouseUp"
        >
          <v-layer
            class="project-note-draw__layer"
            ref="layer"
          >
            <v-line
              @dragstart="handleDragStart"
              @dragend="handleDragEnd"
              v-for="(line, indexLine) in object.lines"
              :key="indexLine + '__project-note-draw--line'"
              :config="{
                ...line,
              }"
            />
            <v-line
              v-for="(line, indexLine) in object.erasers"
              :key="indexLine + '__project-note-draw--erasers'"
              :config="{
                ...line,
              }"
            />
            <v-rect
              @dragstart="handleDragStart"
              @dragend="handleDragEnd"
              v-for="(rect, indexRect) in object.rects"
              :key="indexRect + '__project-note-draw--rect'"
              :config="rect"
            />
            <v-circle
              @dragstart="handleDragStart"
              @dragend="handleDragEnd"
              v-for="(circle, indexCircle) in object.circles"
              :key="indexCircle + '__project-note-draw--circle'"
              :config="circle"
            />
            <v-path
              @dragstart="handleDragStart"
              @dragend="handleDragEnd"
              v-for="(path, indexPath) in object.paths"
              :key="indexPath + '__project-note-draw--path'"
              :config="path"
            />
          </v-layer>
        </v-stage>
      </div>
    </div>
  </q-field>
</template>
<script lang="ts" setup>
import { useRefHistory } from '@vueuse/core'
import { onMounted, reactive, ref } from 'vue'

type Mode =
  | 'UNDO'
  | 'REDO'
  | 'COLOR'
  | 'PEN'
  | 'LINE'
  | 'ERASE'
  | 'CIRCLE'
  | 'RECT'
  | 'DRAG'

// props & emits
const props = defineProps<{
  modelValue: {
    value: string
  }[]
}>()
const emits = defineEmits(['update:modelValue'])
// data
const draggable = reactive({
  active: false,
  isDragging: false,
})

const configKonva = ref({
  width: 300,
  height: 300,
})
const stage = ref(null)
const color = reactive({
  color: '#000000',
  modal: false,
})

const object = ref<{
  erasers: {
    points: number[]
    stroke: string
    draggable?: boolean
    fill?: string
    globalCompositeOperation?: string
    strokeWidth?: number
    tension?: number
    lineCap?: string
  }[]
  lines: {
    points: number[]
    stroke: string
    draggable?: boolean
    fill?: string
    globalCompositeOperation?: string
  }[]
  rects: {
    x: number
    y: number
    width?: number
    height?: number
    fill?: string
    shadowBlur?: number
    draggable: boolean
  }[]
  circles: {
    x: number
    y: number
    radius: number
    fill: string
    draggable: boolean
  }[]
  paths: {
    x: number
    y: number
    fill: string
    draggable: boolean
  }[]
}>({
  erasers: [],
  lines: [],
  rects: [],
  circles: [],
  paths: [],
})
const mode = ref<Mode>('PEN')
const actions = ref<
  {
    name: string
    icon: string
    mode: Mode
    separator?: boolean
    action?: any
  }[]
>([
  {
    name: 'Drag/Drop',
    icon: 'drag_indicator',
    mode: 'DRAG',
    action: onDrag,
  },
  {
    name: 'Undo',
    icon: 'sym_o_undo',
    mode: 'UNDO',
    action: () => {
      onUndo()
      draggable.active = false
    },
  },
  {
    name: 'Redo',
    icon: 'sym_o_redo',
    mode: 'REDO',
    action: () => {
      onRedo()
      draggable.active = false
    },
  },
  {
    name: 'Color',
    icon: 'sym_o_palette',
    mode: 'COLOR',
    action: () => {
      onSelectMode('COLOR')
      color.modal = true
    },
  },
  {
    name: 'Pencil',
    icon: 'sym_o_brush',
    mode: 'PEN',
    action: () => {
      onSelectMode('PEN')
      draggable.active = false
    },
  },
  {
    name: 'Erase',
    icon: 'sym_o_auto_fix',
    mode: 'ERASE',
    action: () => {
      onSelectMode('ERASE')
      draggable.active = false
    },
  },
  {
    name: 'Line',
    icon: 'sym_o_line_start',
    mode: 'LINE',
    action: () => {
      onSelectMode('LINE')
      draggable.active = false
    },
  },
  {
    name: 'Shape',
    icon: 'sym_o_check_box_outline_blank',
    mode: 'RECT',
    action: () => {
      onSelectMode('RECT')
      draggable.active = false
    },
  },
  {
    name: 'Circle',
    icon: 'sym_o_radio_button_unchecked',
    mode: 'CIRCLE',
    action: () => {
      onSelectMode('CIRCLE')
      draggable.active = false
    },
  },
])

const working = ref(false)
const { history, undo, redo } = useRefHistory(object, {
  deep: true,
})

// methods
function onDrag() {
  draggable.active = true
}
function onUndo() {
  undo()
}
function onRedo() {
  redo()
}
function onSelectMode(selectMode: Mode) {
  mode.value = selectMode
}

function handleMouseDown(e: any) {
  working.value = true
  if (mode.value === 'PEN') {
    onDrawingDown(e)
  } else if (mode.value === 'RECT') {
    onRectangeDown(e)
  } else if (mode.value === 'CIRCLE') {
    onCircleDown(e)
  } else if (mode.value === 'LINE') {
    onDrawingPathDown(e)
  } else if (mode.value === 'ERASE') {
    onEraserDown(e)
  }
}

function handleMouseMove(e: any) {
  if (!working.value) {
    return
  }
  if (mode.value === 'PEN') {
    onDrawingMove(e)
  } else if (mode.value === 'RECT') {
    onRectangeMove(e)
  } else if (mode.value === 'CIRCLE') {
    onCircleMove(e)
  } else if (mode.value === 'LINE') {
    onDrawingPathMove(e)
  } else if (mode.value === 'ERASE') {
    onEraserMove(e)
  }
}

function handleMouseUp() {
  working.value = false
  saveDrawData()
}

// dragable
function handleDragStart() {
  draggable.isDragging = true
}
function handleDragEnd() {
  draggable.isDragging = false
}

// pen erase
function onEraserDown(e: any) {
  const pos = e.target.getStage().getPointerPosition()
  object.value.erasers = [
    ...object.value.erasers,
    {
      points: [pos.x, pos.y],
      strokeWidth: 5,
      stroke: '#FFFFFF',
      tension: 0.5,
      lineCap: 'round',
      fill: '#FFFFFF',
    },
  ]
}
function onEraserMove(e: any) {
  const stage = e.target.getStage()
  const point = stage.getPointerPosition()
  let lastLine = object.value.erasers[object.value.erasers.length - 1]
  lastLine.points = lastLine.points.concat([point.x, point.y])
  object.value.erasers.splice(object.value.erasers.length - 1, 1, lastLine)
}

// pen drawing
function onDrawingDown(e: any) {
  const pos = e.target.getStage().getPointerPosition()
  object.value.lines = [
    ...object.value.lines,
    {
      points: [pos.x, pos.y],
      fill: color.color,
      stroke: color.color,
      draggable: true,
    },
  ]
}
function onDrawingMove(e: any) {
  const stage = e.target.getStage()
  const point = stage.getPointerPosition()
  let lastLine = object.value.lines[object.value.lines.length - 1]
  lastLine.points = lastLine.points.concat([point.x, point.y])
  object.value.lines.splice(object.value.lines.length - 1, 1, lastLine)
}

// path drawing
function onDrawingPathDown(e: any) {
  const pos = e.target.getStage().getPointerPosition()
  object.value.paths = [
    ...object.value.paths,
    { x: pos.x, y: pos.y, fill: color.color, draggable: true },
  ]
}
function onDrawingPathMove(e: any) {
  const stage = e.target.getStage()
  const point = stage.getPointerPosition()
  let lastLine = object.value.paths[object.value.paths.length - 1]
}

// shape drawing
function onRectangeDown(e: any) {
  const pos = e.target.getStage().getPointerPosition()
  object.value.rects = [
    ...object.value.rects,
    {
      x: pos.x,
      y: pos.y,
      fill: color.color,
      height: 1,
      width: 1,
      shadowBlur: 1,
      draggable: true,
    },
  ]
}
function onRectangeMove(e: any) {
  const stage = e.target.getStage()
  const point = stage.getPointerPosition()
  let lastRect = object.value.rects[object.value.rects.length - 1]
  lastRect.width = point.x - lastRect.x
  lastRect.height = point.y - lastRect.y
  object.value.rects.splice(object.value.rects.length - 1, 1, lastRect)
}

// circle drawing
function onCircleDown(e: any) {
  const pos = e.target.getStage().getPointerPosition()
  object.value.circles = [
    ...object.value.circles,
    { x: pos.x, y: pos.y, fill: color.color, radius: 1, draggable: true },
  ]
}
function onCircleMove(e: any) {
  const stage = e.target.getStage()
  const point = stage.getPointerPosition()
  let lastCircle = object.value.circles[object.value.circles.length - 1]
  lastCircle.radius = Math.abs(point.x - lastCircle.x)
  object.value.circles.splice(object.value.circles.length - 1, 1, lastCircle)
}

function saveDrawData() {
  emits('update:modelValue', [{ value: getImageFromCanvas() }])
}

function getImageFromCanvas() {
  const canvas = document.querySelector(
    '.project-note-draw__body canvas'
  ) as HTMLCanvasElement
  return canvas.toDataURL()
}

onMounted(() => {
  const wrapper = document.querySelector(
    '.project-note-draw__body'
  ) as HTMLElement
  if (wrapper) {
    configKonva.value = {
      width: wrapper.offsetWidth,
      height: wrapper.offsetHeight,
    }
  }
})
</script>
<style lang="scss">
.project-note-draw {
  width: fit-content;
  height: fit-content;
  min-width: 100%;
  min-height: 240px;
  position: relative;

  &__content {
    width: 100%;
    height: 100%;
  }

  &__body {
    width: 100%;
  }

  &__actions {
    width: 100%;
  }
}
</style>
