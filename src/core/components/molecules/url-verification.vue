<template>
  <q-card
    flat
    class="-verification rounded-borders q-border"
  >
    <q-card-section
      class="q-pa-none q-pa-sm row justify-between items-center no-wrap"
    >
      <div class="row justify-start item-baseline">
        <span class="text-disable">
          {{ $t('pages.auth.urlChange.URL verification') }}
        </span>
        <span class="text-green-13">
          {{ getBaseURL }}
        </span>
      </div>
      <q-btn
        v-if="allowEditUrl"
        size="xs"
        text
        flat
        rounded
        round
        icon="sym_o_edit"
        @click="onToogleEdit"
      >
      </q-btn>
    </q-card-section>
    <div>
      <q-menu
        v-model="editModal"
        :offset="[0, 0]"
        fit
      >
        <q-card
          flat
          outline
        >
          <q-card-section class="column justify-start items-end q-pb-none">
            <q-input
              :label="$t('pages.auth.urlChange.Endpoint')"
              outlined
              stack-label
              dense
              v-model="form.url"
              autofocus
              :hint="
                $t('pages.auth.urlChange.Please include in the end of url')
              "
              hide-bottom-space
              class="q-mb-sm full-width"
            />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              v-if="!isDefaultURL"
              unelevated
              flat
              color="primary"
              size="md"
              class="bg-grey-1"
              @click="onResetDefault"
              >{{ $t('textActions.Reset') }}</q-btn
            >
            <q-btn
              unelevated
              color="primary"
              size="md"
              @click="onChangeBaseURL"
              >{{ $t('textActions.Change') }}</q-btn
            >
          </q-card-actions>
        </q-card>
      </q-menu>
    </div>
  </q-card>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import https from 'src/core/services'
import { computed, reactive, ref } from 'vue'
import { useApplicationStore } from 'src/core/stores/application'

// props
defineProps<{
  allowEditUrl?: boolean
}>()
//composable
const { getBaseURL } = storeToRefs(useApplicationStore())
const { changeBaseURL } = useApplicationStore()

// data
const form = reactive({
  url: '',
})
const editModal = ref(false)

//computed
const isDefaultURL = computed(() => {
  return getBaseURL.value === process.env.BASE_API_URL
})

// methods
function onToogleEdit() {
  editModal.value = !editModal.value
}

function onChangeBaseURL() {
  changeBaseURL(form.url)
  https.defaults.baseURL = form.url
  editModal.value = false
}

function onResetDefault() {
  const defaultURL = process.env.BASE_API_URL
  console.log(defaultURL)
  changeBaseURL(defaultURL ?? '')
  https.defaults.baseURL = defaultURL ?? ''
  editModal.value = false
}
</script>
<style lang="scss">
.url-verification {
  &.q-chip--outline {
    border-color: rgba(0, 0, 0, 0.24);
  }
}
</style>
