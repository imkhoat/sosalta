<template>
  <div
    v-if="keys?.length > 0"
    class="column items-stretch justify-start key-manager-page full-height no-wrap"
  >
    <q-page-header
      :title="$t(`pages.keyManager.Keys manger`)"
      :subtitle="$t(`pages.keyManager.Manager keys use for encryption process`)"
    >
      <template v-slot:action>
        <q-btn
          outline
          push
          color="primary"
          @click="requestChangeMasterPassword"
        >
          <q-icon
            size="xs"
            name="sym_o_key"
            class="q-mr-xs"
          ></q-icon>
          {{ $t(`pages.keyManager.Change master password`) }}
        </q-btn>
        <q-btn
          unelevated
          push
          color="primary"
          @click="requestCreateNewKey"
        >
          <q-icon
            size="xs"
            name="r_add"
            class="q-mr-xs"
          ></q-icon>
          {{ $t(`pages.keyManager.Add new key`) }}
        </q-btn>
      </template>
    </q-page-header>
    <key-manager-list
      :items="keys"
      class="col-grow"
    ></key-manager-list>
  </div>
  <q-dialog
    v-model="modal.open"
    persistent
  >
    <key-manager-create-password
      v-if="modal.type === 'NEW_PASSWORD_MODAL'"
      @close="onExitPage"
      @success="onRefreshPage"
    ></key-manager-create-password>
    <key-manager-change-password
      v-if="modal.type === 'CHANGE_PASSWORD_MODAL'"
      @close="onCloseModal"
    ></key-manager-change-password>
    <key-manager-create-key
      v-if="modal.type === 'CREATE_KEY_MODAL'"
      @close="onCloseModal"
      @success="onGetKeyList"
    ></key-manager-create-key>
    <key-manager-verify-password
      v-if="modal.type === 'VERIFY_PASSWORD_MODAL'"
      @close="onExitPage"
      @verified="onGetKeyList"
    ></key-manager-verify-password>
  </q-dialog>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  FILE_SYSTEM_ROUTE_NAMES,
  KEY_MANAGER_ROUTE_NAMES,
} from 'src/core/router/routes'
import { useKeyManager } from 'src/pages/key-manager/hooks/use-key-manager'
import KeyManagerList from 'src/pages/key-manager/components/key-manager-list.vue'
import KeyManagerCreateKey from 'src/pages/key-manager/components/key-manager-create-key.vue'
import KeyManagerCreatePassword from 'src/pages/key-manager/components/key-manager-create-password.vue'
import KeyManagerChangePassword from 'src/pages/key-manager/components/key-manager-change-password.vue'
import KeyManagerVerifyPassword from 'src/pages/key-manager/components/key-manager-verify-password.vue'

// composables
const {
  modal,
  handleGetUserSymmetricKeyList,
  closeModal,
  requestVerifyMasterPassword,
  requestChangeMasterPassword,
  requestCreateNewKey,
} = useKeyManager()
const router = useRouter()

// data
const keys = ref()
// methods
function onExitPage() {
  router.push({ name: FILE_SYSTEM_ROUTE_NAMES.ENTRIES })
}

function onCloseModal() {
  closeModal()
}

function onRefreshPage() {
  router.push({ name: KEY_MANAGER_ROUTE_NAMES.ENTRIES })
  requestVerifyMasterPassword()
}

async function onGetKeyList() {
  const result = await handleGetUserSymmetricKeyList()
  keys.value = result
  closeModal()
}
</script>
