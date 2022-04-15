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

        <q-toolbar-title> SQUAGI </q-toolbar-title>

        <q-btn
          round
          flat
          icon="help_circle"
          @click="supportRedirect()"
          color="white"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <!-- <div class="flex">
          <q-select
            style="margin: auto auto"
            rounded
            dense
            map-options
            emit-value
            outlined
            bg-color="white"
            v-model="language"
            :options="options"
          >
            <template v-slot:prepend>
              <q-avatar>
                <img :src="languageFlag" />
              </q-avatar>
            </template>
          </q-select>
        </div> -->

        <div class="select-div">
          <q-select
            dense
            class="q-mt-md"
            outlined
            color="primary"
            map-options
            emit-value
            v-model="selectedEstablishment"
            label="Estabelecimentos"
            :options="establishments"
          />
        </div>

        <q-item-label header class="label">
          {{ "Olá, " + user.name }}
        </q-item-label>
        <q-item-label header class="label bottom">
          {{ "ID:" + user.id }}
        </q-item-label>

        <q-separator style="background-color: #fff" />

        <Menu v-for="tab in menuList" :key="tab.title" v-bind="tab" />
      </q-list>

      <p style="position: fixed; bottom: 0; right: 10px">
        {{ "Versão: " + version }}
      </p>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import Menu from "src/components/Menu.vue";

import { defineComponent } from "vue";
// import brazilFlag from "../statics/i18n/img/brazil.png";
// import usaFlag from "../statics/i18n/img/united-states.png";

export default defineComponent({
  name: "MainLayout",

  components: {
    Menu,
  },

  data() {
    return {
      leftDrawerOpen: false,
      roles: this.$store.state.session.user.roles ?? ["USER"],
      language: "",
      languageFlag: "",
      options: [
        {
          value: "en_us",
          label: "English",
        },
        {
          value: "pt_br",
          label: "Português BR",
        },
      ],
      selectedEstablishment: "",
      establishments: this.$store.state.session.user.establishments ?? [],
    };
  },

  created() {
    this.language = this.lang.value;
    if (this.establishments.length == 1) {
      this.selectedEstablishment = this.establishments[0].value;
    }
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
    establishments() {
      return this.$store.state.session.user.establishments ?? [];
    },

    menuList(): Array<
      Record<string, string | boolean | Array<Record<string, string | boolean>>>
    > {
      return [
        {
          title: "Estabelecimentos",
          caption: "",
          icon: "add",
          show: true,
          link: "/estabelecimentos",
        },
        {
          title: "Usuários",
          caption: "",
          icon: "person",
          show: true,
          link: "/usuarios",
        },
        {
          title: "Dashboard",
          caption: "",
          icon: "school",
          show: true,
          link: "/home",
        },
        {
          title: "Criação FEED/STORY",
          caption: "",
          icon: "code",
          show: true,
          link: "/home",
          subMenu: [
            {
              title: "Solicitar",
              caption: "",
              icon: "",
              show: true,
              link: "/home",
            },
            {
              title: "Solicitações",
              caption: "",
              icon: "",
              show: true,
              link: "/home",
            },
            {
              title: "Termos",
              caption: "",
              icon: "",
              show: true,
              link: "/home",
            },
          ],
        },
        {
          title: "Planos/serviços",
          caption: "",
          icon: "chat",
          show: true,
          link: "/home",
        },
        {
          title: "Cartão de visita",
          caption: "",
          icon: "record_voice_over",
          show: true,
          link: "https://mycard.tec.br",
        },
        {
          title: "Logo",
          caption: "",
          icon: "record_voice_over",
          show: true,
          link: "/home",
        },
        {
          title: "Site",
          caption: "",
          icon: "record_voice_over",
          show: true,
          link: "/home",
        },
        {
          title: "Editor vídeo/Motion",
          caption: "",
          icon: "camera",
          show: true,
          link: "/home",
        },
        {
          title: "Gestão de rede social",
          caption: "",
          icon: "record_voice_over",
          show: true,
          link: "/home",
          subMenu: [
            {
              title: "Solicitar",
              caption: "",
              icon: "",
              show: true,
              link: "/home",
            },
            {
              title: "Solicitações",
              caption: "",
              icon: "",
              show: true,
              link: "/home",
            },
            {
              title: "Programação",
              caption: "",
              icon: "",
              show: true,
              link: "/home",
            },
            {
              title: "Relatorio",
              caption: "",
              icon: "",
              show: true,
              link: "/home",
            },
          ],
        },
        {
          title: "Gestão Tráfego pago",
          caption: "",
          icon: "record_voice_over",
          show: true,
          link: "/home",
          subMenu: [
            {
              title: "Solicitar",
              caption: "",
              icon: "",
              show: true,
              link: "/home",
            },
            {
              title: "Solicitações",
              caption: "",
              icon: "",
              show: true,
              link: "/home",
            },
            {
              title: "ADS",
              caption: "",
              icon: "",
              show: true,
              link: "/home",
            },
          ],
        },
        {
          title: "Parceiros",
          caption: "",
          icon: "person",
          show: true,
          link: "/home",
          subMenu: [
            {
              title: "Digital influencer",
              caption: "",
              icon: "",
              show: true,
              link: "/home",
            },
            {
              title: "Fotógrafo",
              caption: "",
              icon: "",
              show: true,
              link: "/home",
            },
            {
              title: "Quero ser um parceiro",
              caption: "",
              icon: "",
              show: true,
              link: "/home",
            },
          ],
        },
        {
          title: "Financeiro",
          caption: "",
          icon: "money",
          show: true,
          link: "/home",
          subMenu: [
            {
              title: "Planos/Serviços",
              caption: "",
              icon: "",
              show: true,
              link: "/home",
            },
            {
              title: "Faturas",
              caption: "",
              icon: "",
              show: true,
              link: "/home",
            },
          ],
        },
        {
          title: "Configuração",
          caption: "",
          icon: "settings",
          show: true,
          link: "/home",
          subMenu: [
            {
              title: "Meu usuário",
              caption: "",
              icon: "",
              show: true,
              link: "/home",
            },
            {
              title: "Empresa",
              caption: "",
              icon: "",
              show: true,
              link: "/home",
            },
            {
              title: "Equipe",
              caption: "",
              icon: "",
              show: true,
              link: "/home",
            },
          ],
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

    lang(): Record<string, string> {
      switch (this.$i18n.locale) {
        case "en":
          return { value: "en_us", label: "English" };
        default:
          return { value: "pt_br", label: "Português BR" };
      }
    },

    user() {
      return this.$store.state.session.user;
    },

    version() {
      return process.env.APP_VERSION;
    },
  },

  watch: {
    // language() {
    //   switch (this.language) {
    //     case "en_us":
    //       this.languageFlag = usaFlag;
    //       this.$i18n.locale = "en";
    //       break;
    //     case "pt_br":
    //       this.languageFlag = brazilFlag;
    //       this.$i18n.locale = "pt";
    //       break;
    //   }
    // }
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
  margin-left: 15px;
  padding: 0 0 15px 0;
}
.select-div {
  max-width: 80%;
  margin: auto auto;
}
</style>
