<template>
  <q-card
    flat
    class="member-users-information-card"
  >
    <q-card-section class="row justify-start items-start q-gutter-x-md">
      <div class="member-users-information-card__avatar-wrapper">
        <q-avatar
          size="120px"
          color="grey-1"
          text-color="grey-3"
          class="member-users-information-card__avatar"
        >
          <q-avatar
            size="100px"
            color="grey-3"
            text-color="grey-4"
          >
            <q-avatar
              size="60px"
              color="grey-4"
              text-color="primary"
            >
              <q-icon name="sym_o_person"></q-icon>
            </q-avatar>
          </q-avatar>
        </q-avatar>
      </div>
      <q-section-header
        :title="user?.userName"
        :sub-title="`Email__****** | Phone__******`"
        class="col-grow"
      ></q-section-header>
      <div class="row q-gutter-x-xs">
        <q-btn
          size="sm"
          outline
          unelevated
          round
          color="primary"
          @click="onDeleteMember(user)"
        >
          <q-icon
            size="xs"
            name="sym_o_delete"
          ></q-icon>
        </q-btn>
      </div>
    </q-card-section>
    <q-card-section class="column justify-start items-stretch q-gutter-y-sm">
      <strong>About</strong>
      <div class="row justify-start items-center q-gutter-x-sm">
        <q-chip
          :color="user?.managerUser ? 'positive' : 'primary'"
          outline
        >
          <q-icon
            v-if="user?.managerUser"
            size="xs"
            name="sym_o_workspace_premium"
            class="q-mr-xs"
          ></q-icon>
          {{ user?.managerString }}
        </q-chip>
      </div>
    </q-card-section>
    <q-card-section>
      <strong>Account history</strong>
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
                <q-item-label caption>{{ user?.gmtCreateString }}</q-item-label>
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
                <q-item-label caption>{{ user?.gmtUpdateString }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { ProjectMember } from 'src/core/types/project-member-types'
import { useProjectMembers } from 'src/pages/project-management/hooks/use-members'

// composables
const { onDeleteMember } = useProjectMembers()

// props
const props = defineProps<{
  user: ProjectMember | null | undefined
}>()
</script>
<style lang="scss">
.member-users-information-card {
  margin-top: 60px;
  position: relative;

  &__avatar-wrapper {
    width: 120px;
    height: 80px;
  }

  &__avatar {
    top: -40px;
    position: absolute;
    border: 3px solid $white;
    box-sizing: content-box;
  }
}
</style>
