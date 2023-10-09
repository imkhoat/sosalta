<template>
  <q-scroll-area class="full-height q-pa-md bg-white">
    <q-list class="bg-white">
      <template
        v-for="i in 50"
        :key="i"
      >
        <q-item
          ripple
          clickable
          class="rounded-borders"
        >
          <q-item-section
            top
            avatar
          >
            <q-avatar
              color="grey-1"
              text-color="primary-5"
              size="xl"
              class="q-mr-sm"
            >
              <q-avatar
                color="grey-2"
                text-color="primary-5"
                size="lg"
              >
                <q-avatar
                  color="grey-3"
                  text-color="primary-5"
                  size="md"
                >
                  <q-icon
                    size="sm"
                    name="sym_o_person"
                  ></q-icon>
                </q-avatar>
              </q-avatar>
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-weight-bold"
              >miguelbui_inapps</q-item-label
            >
            <q-item-label
              caption
              lines="2"
              >😍</q-item-label
            >
          </q-item-section>

          <q-item-section
            side
            top
          >
            <q-item-label caption>5 min ago</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator spaced />
      </template>
    </q-list>
  </q-scroll-area>
</template>
