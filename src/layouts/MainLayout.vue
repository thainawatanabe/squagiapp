<template>
  <q-layout view="hHh lpR fFf">
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

        <q-toolbar-title> <q-img class="toolbar-logo" src="../statics/images/squagi.png" /> </q-toolbar-title>

        <q-btn
          round
          flat
          icon="notifications"
        />
      </q-toolbar>
    </q-header>

    <q-drawer id="drawer" v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <!-- <div class="flex">
          <q-select
            style="margin: auto auto"
            rounded
            dense
            map-options
            emit-value
            outlined
            behavior="menu"
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

        <q-item-label header class="label bottom q-mt-md">
          <p class="no-bottom">{{ "Olá, " + user.name }}</p>
          <span>{{ "ID:" + user.id }} <q-btn round flat icon="content_copy" class="copy-btn" @click="copy(user.id)" /></span>
        </q-item-label>

        <div class="select-div">
          <q-select
            dense
            class="q-mb-md"
            outlined
            map-options
            behavior="menu"
            emit-value
            v-model="selectedEstablishment"
            label="Estabelecimentos"
            :options="establishments"
          >
          <template #before-options v-if="roles.includes('MANAGER') || this.roles.includes('ADMIN')">
            <q-item clickable to="/estabelecimentos">
              <span id="add-establishment">Adicionar estabelecimento</span>
            </q-item>
            <q-separator />
          </template>
          </q-select>
        </div>

        <q-separator />

        <Menu v-for="tab in menuList" :key="tab.title" v-bind="tab" />
      </q-list>

      <!--<p style="bottom: 0" class="text-right q-mr-md">
        {{ "Versão: " + version }}
      </p>-->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import Menu from "src/components/Menu.vue";
import helpers from "src/utils/helpers";
import { defineComponent } from "vue";
// import brazilFlag from "../statics/i18n/img/brazil.png";
// import usaFlag from "../statics/i18n/img/united-states.png";

export default defineComponent({
  name: "MainLayout",
  mixins: [helpers],
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
    // this.language = this.lang.value;
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
    establishments(): Array<Record<string, string>> {
      return this.$store.state.session.user.establishments ?? [];
    },

    menuList(): Array<
      Record<string, string | boolean | Array<Record<string, string | boolean>>>
    > {
      return [
        {
          title: "Dashboard",
          caption: "",
          icon: "",
          show: true,
          link: "/home",
        },
        {
          title: "Usuários",
          caption: "",
          icon: "",
          show: this.roles.includes('MANAGER') || this.roles.includes('ADMIN'),
          link: "/usuarios",
        },
        {
          title: "Criação FEED/STORY",
          caption: "",
          icon: "",
          show: true,
          link: "/feed",
          subMenu: [
            {
              title: "Solicitar",
              caption: "",
              icon: "",
              show: true,
              link: "",
            },
            {
              title: "Solicitações",
              caption: "",
              icon: "",
              show: true,
              link: "/a",
            },
            {
              title: "Termos",
              caption: "",
              icon: "",
              show: true,
              link: "/termos",
            }
          ],
        },
        {
          title: "Cartão de visita",
          caption: "",
          icon: "",
          show: true,
          link: "/nothing",
          url: "https://mycard.tec.br",
        },
        {
          title: "Logo",
          caption: "",
          icon: "",
          show: true,
          link: "/logo",
        },
        {
          title: "Site",
          caption: "",
          icon: "",
          show: true,
          link: "/site",
        },
        {
          title: "Editor vídeo/Motion",
          caption: "",
          icon: "",
          show: true,
          link: "/editor",
        },
        {
          title: "Gestão de rede social",
          caption: "",
          icon: "",
          show: true,
          link: "/gestao-rede",
          subMenu: [
            {
              title: "Solicitar",
              caption: "",
              icon: "",
              show: true,
              link: "",
            },
            {
              title: "Solicitações",
              caption: "",
              icon: "",
              show: true,
              link: "/solicitar",
            },
            {
              title: "Programação",
              caption: "",
              icon: "",
              show: true,
              link: "/programacao",
            },
            {
              title: "Relatorio",
              caption: "",
              icon: "",
              show: true,
              link: "/relatorio",
            },
          ],
        },
        {
          title: "Gestão Tráfego pago",
          caption: "",
          icon: "",
          show: true,
          link: "/gestao-trafego",
          subMenu: [
            {
              title: "Solicitar",
              caption: "",
              icon: "",
              show: true,
              link: "",
            },
            {
              title: "Solicitações",
              caption: "",
              icon: "",
              show: true,
              link: "/solicitacoes",
            },
            {
              title: "ADS",
              caption: "",
              icon: "",
              show: true,
              link: "/ads",
            },
          ],
        },
        {
          title: "Parceiros",
          caption: "",
          icon: "",
          show: true,
          link: "/parceiros",
          subMenu: [
            {
              title: "Digital influencer",
              caption: "",
              icon: "",
              show: true,
              link: "",
            },
            {
              title: "Fotógrafo",
              caption: "",
              icon: "",
              show: true,
              link: "/fotografo",
            },
            {
              title: "Quero ser um parceiro",
              caption: "",
              icon: "",
              show: true,
              link: "/contrato",
            },
          ],
        },
        {
          title: "Financeiro",
          caption: "",
          icon: "",
          show: true,
          link: "/financeiro",
          subMenu: [
            {
              title: "Planos/Serviços",
              caption: "",
              icon: "",
              show: true,
              link: "",
            },
            {
              title: "Faturas",
              caption: "",
              icon: "",
              show: true,
              link: "/faturas",
            },
          ],
        },
        {
          title: "Configuração",
          caption: "",
          icon: "",
          show: true,
          link: "/configuracao",
          subMenu: [
            {
              title: "Meu usuário",
              caption: "",
              icon: "",
              show: true,
              link: "",
            },
            {
              title: "Empresa",
              caption: "",
              icon: "",
              show: true,
              link: "/empresa",
            },
            {
              title: "Equipe",
              caption: "",
              icon: "",
              show: true,
              link: "/equipe",
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
}
.bottom {
  margin-left: 15px;
  padding: 0;
}
.select-div {
  max-width: 80%;
  margin: auto auto;
}
.toolbar-logo {
  max-width: 120px;
}
.copy-btn {
  i {
    font-size: 17px !important;
  }
}
#add-establishment {
  font-family: 'Montserrat-SemiBold';
  margin-top: 5px;
}
</style>
