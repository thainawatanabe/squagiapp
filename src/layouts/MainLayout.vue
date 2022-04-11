<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Squagi
        </q-toolbar-title>

        <div>
          <q-btn round flat icon="help_circle" @click="supportRedirect()"/>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          MENU
        </q-item-label>

        <Menu
          v-for="tab in menuList"
          :key="tab.title"
          v-bind="tab"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import Menu from 'src/components/Menu.vue'

const menuList = [
  {
    title: 'Dashboard',
    caption: '',
    icon: 'school',
    show: true,
    link: 'https://quasar.dev'
  },
  {
    title: 'Serviços',
    caption: '',
    icon: 'code',
    show: true,
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Planos/serviços',
    caption: '',
    icon: 'chat',
    show: true,
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Usuários',
    caption: '',
    icon: 'record_voice_over',
    show: true,
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Sair',
    caption: '',
    icon: 'logout',
    show: true,
    link: '/login'
  }
];

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
    Menu
  },

  data() {
    return {
      leftDrawerOpen: false,
      menuList: menuList
    }
  },

  methods: {
    toggleLeftDrawer () {
      this.leftDrawerOpen = !this.leftDrawerOpen
    },

    supportRedirect() {
      window.open(`https://api.whatsapp.com/send?phone=553196671332`, '_blank');
    }
  }
  })
</script>
