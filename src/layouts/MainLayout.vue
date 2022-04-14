<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated id="header">
      <q-toolbar id="header">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Squagi </q-toolbar-title>

        <q-btn round flat icon="help_circle" @click="supportRedirect()" color="white" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header class="label"> {{ 'Olá, ' + user.name }} </q-item-label>
        <q-item-label header class="label bottom"> {{ 'ID:' + user.id }} </q-item-label>

        <q-separator style="background-color: #fff" />

        <Menu v-for="tab in menuList" :key="tab.title" v-bind="tab" />
      </q-list>

      <p style="position:fixed;bottom:0;right:10px">{{ 'Versão: ' + version }}</p>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import Menu from "src/components/Menu.vue";

import { defineComponent } from "vue";

export default defineComponent({
  name: "MainLayout",

  components: {
    Menu,
  },

  data() {
    return {
      leftDrawerOpen: false,
      roles: this.$store.state.session.user.roles ?? ["USER"],
    };
  },

  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },

    supportRedirect() {
      window.open(`https://api.whatsapp.com/send?phone=553196671332`, "_blank");
    },
  },

  computed: {
    menuList(): Array<Record<string, string | boolean>> {
      return [
        {
          title: "Dashboard",
          caption: "",
          icon: "school",
          show: this.roles.includes("ADMIN"),
          link: "/home",
        },
        {
          title: "Serviços",
          caption: "",
          icon: "code",
          show: true,
          link: "/home",
        },
        {
          title: "Planos/serviços",
          caption: "",
          icon: "chat",
          show: true,
          link: "/home",
        },
        {
          title: "Usuários",
          caption: "",
          icon: "record_voice_over",
          show: this.roles.includes("ADMIN") || this.roles.includes("MANAGER"),
          link: "/usuarios",
        },
        {
          title: "Sair",
          caption: "",
          icon: "logout",
          show: true,
          link: "/",
        },
      ];
    },

    user() {

      return this.$store.state.session.user;
    },

    version() {

      return process.env.APP_VERSION;
    }
  },
});
</script>
<style lang="scss">
#header {
  height: 80px;
  color: #fff;
}
.q-toolbar__title {
  color: #fff;
}
.label {
  color: #fff;
}
.bottom {
  margin-left:15px;
  padding: 0 0 15px 0;
}
</style>
