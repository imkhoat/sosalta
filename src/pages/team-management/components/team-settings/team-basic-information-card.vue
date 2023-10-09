<template>
  <q-card
    flat
    class="team-basic-information-card"
  >
    <q-card-section class="row justify-start items-start q-gutter-x-md">
      <div class="team-basic-information-card__avatar-wrapper">
        <q-avatar
          size="120px"
          color="grey-1"
          text-color="grey-3"
          class="team-basic-information-card__avatar"
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
              <q-icon name="sym_o_groups_3"></q-icon>
            </q-avatar>
          </q-avatar>
        </q-avatar>
      </div>
      <q-section-header
        :title="team?.groupName"
        :sub-title="`Create by: ${team?.createrName}`"
        class="col-grow"
      ></q-section-header>
      <div class="row q-gutter-x-xs">
        <q-btn
          v-if="hasEditTeamNameAuthorization"
          size="sm"
          outline
          unelevated
          round
          color="primary"
          @click="onRenameNewTeam(team)"
        >
          <q-icon
            size="xs"
            name="sym_o_edit"
          ></q-icon>
        </q-btn>
        <q-btn
          v-if="hasDeleteTeamAuthorization"
          size="sm"
          outline
          unelevated
          round
          color="negative"
          @click="onDeleteTeam(team)"
        >
          <q-icon
            size="xs"
            name="sym_o_delete"
          ></q-icon>
        </q-btn>
      </div>
    </q-card-section>
    <q-card-section>
      <strong>{{
        $t('pages.teamManagement.teamSettings.Team history')
      }}</strong>
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
                <q-item-label>{{
                  $t('pages.teamManagement.teamSettings.Create date')
                }}</q-item-label>
                <q-item-label caption>{{
                  team?.gmtCreateAtString
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
                <q-item-label>{{
                  $t('pages.teamManagement.teamSettings.Last update date')
                }}</q-item-label>
                <q-item-label caption>{{
                  team?.gmtUpdateAtString
                }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="sym_o_attribution"></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{
                  $t('pages.teamManagement.teamSettings.Create by')
                }}</q-item-label>
                <q-item-label caption>{{ team?.createrName }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="sym_o_copyright"></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{
                  $t('pages.teamManagement.teamSettings.Owner by')
                }}</q-item-label>
                <q-item-label caption>{{ team?.owner }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="sym_o_groups"></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{
                  $t('pages.teamManagement.teamSettings.Members')
                }}</q-item-label>
                <q-item-label caption>{{ team?.userCount }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { Team } from 'src/core/types/team-types'
import { useTeams } from 'src/pages/team-management/hooks/use-teams'
import { useActiveTeamActionsVisible } from 'src/pages/team-management/hooks/authorization/use-team-actions-visible'

// composables
const { onDeleteTeam, onRenameNewTeam } = useTeams()
const { hasDeleteTeamAuthorization, hasEditTeamNameAuthorization } =
  useActiveTeamActionsVisible()
// props & emits
const props = defineProps<{
  team: Team | null
}>()
</script>
<style lang="scss">
.team-basic-information-card {
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
