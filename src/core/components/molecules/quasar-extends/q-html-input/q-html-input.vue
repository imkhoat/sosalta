<template>
  <div class="q-html-input">
    <q-html-menu
      :editor="editor"
      :menus="menus"
    ></q-html-menu>
    <editor-content
      class="q-html-input__content"
      :editor="editor"
    ></editor-content>
    <div class="q-html-input__actions">
      <q-btn
        flat
        size="sm"
        rounded
        :icon="isSaved ? 'done' : 'data_saver_off'"
        class="q-px-md"
        @click.stop="onSave"
      >
        <strong class="text-weight-bold q-ml-xs">{{
          isSaved ? 'Saved' : 'Save'
        }}</strong>
      </q-btn>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import TurndownService from 'turndown'
import StarterKit from '@tiptap/starter-kit'
import { useEditor, EditorContent, Content } from '@tiptap/vue-3'
import QHtmlMenu, {
  Menus,
} from 'src/core/components/molecules/quasar-extends/q-html-input/q-html-menus.vue'

// props
const props = withDefaults(
  defineProps<{
    modelValue: Content | string
    markdown?: boolean
    docx?: boolean
  }>(),
  {
    markdown: false,
    modelValue: '',
  }
)
const emits = defineEmits(['update:modelValue'])

// data
const isSaved = ref(false)

const editor = useEditor({
  content: '<p>Welcome editor 🎉</p>',

  extensions: [StarterKit],

  onCreate({ editor }) {
    const value = props.markdown
      ? handleConvertToHtml(props.modelValue)
      : props.modelValue
    editor.commands.setContent(value)
  },

  onUpdate() {
    isSaved.value = false
  },
})

// computeds
const menus = computed((): Menus[] => {
  return [
    [
      {
        icon: 'format_bold',
        name: 'Bold',
        action: onBold,
        isActive: editor.value?.isActive('bold'),
      },
      {
        icon: 'format_italic',
        name: 'Italic',
        action: onItalic,
        isActive: editor.value?.isActive('italic'),
      },
      {
        icon: 'format_strikethrough',
        name: 'Strike',
        action: onStrike,
        isActive: editor.value?.isActive('strike'),
      },
      {
        icon: 'code',
        name: 'Code',
        action: onCode,
        isActive: editor.value?.isActive('code'),
      },
    ],
    [
      {
        name: 'H1',
        action: onH1,
        isActive: editor.value?.isActive('heading', { level: 1 }),
      },
      {
        name: 'H2',
        action: onH2,
        isActive: editor.value?.isActive('heading', { level: 2 }),
      },
      {
        name: 'H3',
        action: onH3,
        isActive: editor.value?.isActive('heading', { level: 3 }),
      },
      {
        name: 'H4',
        action: onH4,
        isActive: editor.value?.isActive('heading', { level: 4 }),
      },
      {
        name: 'H5',
        action: onH5,
        isActive: editor.value?.isActive('heading', { level: 5 }),
      },
      {
        name: 'H6',
        action: onH6,
        isActive: editor.value?.isActive('heading', { level: 6 }),
      },
      {
        icon: 'local_parking',
        name: 'Paragraph',
        action: onParagraph,
        isActive: editor.value?.isActive('paragraph'),
      },
      {
        icon: 'format_list_bulleted',
        name: 'Bullet List',
        action: onBulletList,
        isActive: editor.value?.isActive('bulletList'),
      },
      {
        icon: 'format_list_numbered',
        name: 'Ordered List',
        action: onOrderedList,
        isActive: editor.value?.isActive('orderedList'),
      },
      {
        icon: 'data_object',
        name: 'Code Block',
        action: onCodeBlock,
        isActive: editor.value?.isActive('codeBlock'),
      },
    ],
    /**==========================
     * Not implement yet
     ==========================*/
    [
      {
        icon: 'image',
        name: 'Image',
        action: onImage,
        isActive: editor.value?.isActive('undo'),
      },
      {
        icon: 'videocam',
        name: 'Video',
        action: onVideo,
        isActive: editor.value?.isActive('redo'),
      },
      {
        icon: 'link',
        name: 'Link',
        action: onLink,
        isActive: editor.value?.isActive('redo'),
      },
    ],
    /**==========================
     ***************
     ==========================*/
    [
      {
        icon: 'undo',
        name: 'Undo',
        action: onUndo,
        isActive: editor.value?.isActive('undo'),
      },
      {
        icon: 'redo',
        name: 'Redo',
        action: onRedo,
        isActive: editor.value?.isActive('redo'),
      },
    ],
  ]
})

// methods

//#region menus action
function onBold() {
  return editor.value?.chain().focus().toggleBold()
}

function onItalic() {
  return editor.value?.chain().focus().toggleItalic()
}

function onStrike() {
  return editor.value?.chain().focus().toggleStrike()
}

function onCode() {
  return editor.value?.chain().focus().toggleCode()
}

function onH1() {
  return editor.value?.chain().focus().toggleHeading({ level: 1 })
}

function onH2() {
  return editor.value?.chain().focus().toggleHeading({ level: 2 })
}

function onH3() {
  return editor.value?.chain().focus().toggleHeading({ level: 3 })
}

function onH4() {
  return editor.value?.chain().focus().toggleHeading({ level: 4 })
}

function onH5() {
  return editor.value?.chain().focus().toggleHeading({ level: 5 })
}

function onH6() {
  return editor.value?.chain().focus().toggleHeading({ level: 6 })
}

function onParagraph() {
  return editor.value?.chain().focus().setParagraph()
}

function onBulletList() {
  return editor.value?.chain().focus().toggleBulletList()
}

function onOrderedList() {
  return editor.value?.chain().focus().toggleOrderedList()
}

function onCodeBlock() {
  return editor.value?.chain().focus().toggleCodeBlock()
}

function onImage() {
  return editor.value?.chain().focus().toggleCodeBlock()
}

function onVideo() {
  return editor.value?.chain().focus().toggleCodeBlock()
}

function onLink() {
  return editor.value?.chain().focus().toggleCodeBlock()
}

function onUndo() {
  return editor.value?.chain().focus().undo()
}

function onRedo() {
  return editor.value?.chain().focus().redo()
}

//#endregion

function handleConvertToHtml(markdown: string | Content) {
  return markdown
}

function handleConvertToMarkdown(html: string | undefined) {
  const turndownService = new TurndownService()

  const markdownString = turndownService.turndown(html || '')
  return markdownString
}

function handleConvertToDocx(html: string | undefined) {
  return html
}

function onSave() {
  const updateValue = props.markdown
    ? handleConvertToMarkdown(editor.value?.getHTML())
    : props.docx
    ? handleConvertToDocx(editor.value?.getHTML())
    : editor.value?.getHTML()

  emits('update:modelValue', updateValue)
  isSaved.value = true
}
</script>
<style lang="scss" scope>
.q-html-input {
  border: 1px solid $grey-5;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: auto;
  scroll-behavior: smooth;
  align-items: stretch;
  height: 250px;
  position: relative;

  &:focus,
  &:hover {
    border-color: $primary;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  &__actions {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    position: sticky;
    bottom: 0;
    padding: 4px;
  }

  &__content {
    border: none;
    outline: none;
    flex-grow: 1;
  }

  &__content .ProseMirror {
    border: none;
    outline: none;
    padding: 12px;
    border-radius: 4px;
    border-bottom-right-radius: 12px;
    border-bottom-left-radius: 12px;

    > * + * {
      margin-top: 0.75em;
    }

    ul,
    ol {
      padding: 0 1rem;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      line-height: 1.1;
      margin: 16px 0;
    }

    code {
      background-color: rgba(#616161, 0.1);
      color: #616161;
      padding: 2px;
      border-radius: 4px;
    }

    pre {
      background: #0d0d0d;
      color: #fff;
      font-family: 'JetBrainsMono', monospace;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;

      code {
        color: inherit;
        padding: 0;
        background: none;
        font-size: 0.8rem;
      }
    }

    img {
      max-width: 100%;
      height: auto;
    }

    blockquote {
      padding-left: 1rem;
      border-left: 2px solid rgba(#0d0d0d, 0.1);
    }

    hr {
      border: none;
      border-top: 2px solid rgba(#0d0d0d, 0.1);
      margin: 2rem 0;
    }

    p {
      margin-bottom: 8px;
    }
  }
}
</style>
