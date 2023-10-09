<template>
  <q-card class="project-notepages-info-card">
    <q-card-section>
      <q-section-header
        :title="activeNotepage?.pageName"
        :sub-title="`NotepageId: ${activeNotepage?.notePageId}`"
        class="col-grow"
      ></q-section-header>
    </q-card-section>
    <q-card-section>
      <strong>Notepage history</strong>
      <div class="row no-wrap q-mt-sm">
        <div class="col-12 col-md-8 col-lg-6 col-xl-5">
          <q-list
            bordered
            separator
            class="rounded-borders"
          >
            <q-item
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="sym_o_calendar_month"></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label>Create date</q-item-label>
                <q-item-label caption>{{
                  activeNotepage?.gmtCreateAtString
                }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="sym_o_calendar_month"></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label>Last update date</q-item-label>
                <q-item-label caption>{{
                  activeNotepage?.gmtUpdateAtString
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <strong>Notepage owner</strong>
      <div class="row no-wrap q-mt-sm">
        <div class="col-12 col-md-8 col-lg-6 col-xl-5">
          <q-list
            bordered
            separator
            class="rounded-borders"
          >
            <q-item
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="sym_o_calendar_month"></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label>Create by</q-item-label>
                <q-item-label caption>{{
                  activeNotepage?.createdBy
                }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="sym_o_calendar_month"></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label>Owner</q-item-label>
                <q-item-label caption>{{ activeNotepage?.owner }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="sym_o_calendar_month"></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label>Notes</q-item-label>
                <q-item-label caption>{{ activeNotepage?.size }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-form-actions :actions="formActions"></q-form-actions>
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ActionProp } from 'src/core/types/action-prop-types'
import { useProjectNotepages } from '../../hooks/use-notepages'

// props & emits
const emits = defineEmits(['close', 'edit'])

// composables
const { t } = useI18n()
const { activeNotepage } = useProjectNotepages()

const formActions = computed((): ActionProp[] => {
  return [
    {
      type: 'primary',
      color: 'primary',
      flat: true,
      name: t('textActions.Close'),
      action: onClose,
    },
  ]
})
// methods
function onClose() {
  emits('close')
}
</script>
<style lang="scss">
.project-notepages-info-card {
  min-width: 300px;
  max-width: calc(100vw - 48px);

  &__image {
    position: relative;
  }

  &__size {
    position: absolute;
    bottom: map-get($map: $space-xs, $key: y);
    right: map-get($map: $space-xs, $key: y);
  }
  &__name {
    width: 100%;
    overflow: hidden;
  }
  &__name-title {
    width: 80%;
    max-width: 80%;
    overflow: hidden;
  }
}
</style>
