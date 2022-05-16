<template>
  <q-layout view="hHh Lpr lff">
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

        <q-toolbar-title>
          <q-img class="toolbar-logo" src="../statics/images/squagi.png" />
        </q-toolbar-title>

        <q-btn round flat icon="notifications" />
      </q-toolbar>
      <q-separator />
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      class="no-scroll"
      bordered
    >
      <q-scroll-area class="scroll-area">
        <q-list padding>
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

          <Menu v-for="tab in menuList" :key="tab.title" v-bind="tab" />
        </q-list>
      </q-scroll-area>
      <div style="height: 130px" class="absolute-top">
        <q-item-label header class="label bottom q-mt-md">
          <p class="no-bottom">{{ "Olá, " + user.name }}</p>
          <span
            >{{ "ID:" + user.id }}
            <q-btn
              round
              flat
              icon="content_copy"
              class="copy-btn"
              @click="copy(user.id)"
          /></span>
        </q-item-label>

        <div class="select-div" v-if="!this.isEmployee">
          <q-select
            dense
            class="q-mb-md"
            outlined
            map-options
            behavior="menu"
            emit-value
            v-model="selectedEstablishment"
            @update:model-value="val => onSelectEstablishment(val)"
            label="Estabelecimentos"
            :options="establishments"
          >
            <template
              #after-options
              v-if="establishments[0]"
            >
              <q-separator />
              <q-item clickable to="/estabelecimentos">
                <span id="add-establishment">Criar estabelecimento </span>
              </q-item>
              <q-separator />
            </template>
            <template
              #no-option
            >
              <q-item clickable to="/estabelecimentos">
                <span id="add-establishment">Criar estabelecimento </span>
              </q-item>
              <q-separator />
            </template>
          </q-select>
        </div>
      </div>

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
import { mapActions, mapGetters } from "vuex";
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
    if (this.establishments.length > 0) {
      const establishmentId = this.establishments[0].value;
      this.selectedEstablishment = establishmentId;
      this.onSelectEstablishment(establishmentId);
    }

    if (this.sessionSelectedEstablishment) {
      this.selectedEstablishment = this.sessionSelectedEstablishment;
    }
  },

  methods: {
    ...mapActions("session", ["onSelectEstablishment"]),
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },

    supportRedirect() {
      window.open(`https://api.whatsapp.com/send?phone=553196671332`, "_blank");
    }
  },

  computed: {
    ...mapGetters('session', ['isManager', 'isEmployee']),

    sessionSelectedEstablishment(): string {
      return this.$store.state.session.user.selectedEstablishment ?? "";
    },

    menuList(): Array<
      Record<string, string | boolean | undefined | Array<Record<string, string | boolean>>>
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
          show: this.sessionSelectedEstablishment.length > 0,
          link: "/usuarios",
        },
        {
          title: "Criação FEED/STORY",
          caption: "",
          icon: "",
          show: this.isEmployee ? false : this.sessionSelectedEstablishment.length > 0,
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
            },
          ],
        },
        {
          title: "Cartão de visita",
          caption: "",
          icon: "",
          show: this.isEmployee ? false : this.sessionSelectedEstablishment.length > 0,
          link: "/nothing",
          url: "https://mycard.tec.br",
        },
        {
          title: "Logo",
          caption: "",
          icon: "",
          show: this.isEmployee ? false : this.sessionSelectedEstablishment.length > 0,
          link: "/logo",
        },
        {
          title: "Site",
          caption: "",
          icon: "",
          show: this.isEmployee ? false : this.sessionSelectedEstablishment.length > 0,
          link: "/site",
        },
        {
          title: "Editor vídeo/Motion",
          caption: "",
          icon: "",
          show: this.isEmployee ? false : this.sessionSelectedEstablishment.length > 0,
          link: "/editor",
        },
        {
          title: "Gestão de rede social",
          caption: "",
          icon: "",
          show: this.isEmployee ? false : this.sessionSelectedEstablishment.length > 0,
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
          show: this.isEmployee ? false : this.sessionSelectedEstablishment.length > 0,
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
          show: this.isEmployee ? false : this.sessionSelectedEstablishment.length > 0,
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
          show: this.isManager,
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
          show: this.isManager,
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
.q-header .q-layout__shadow::after {
  bottom: 0;
}
#header {
  height: 80px;
}
.bottom {
  margin-left: 15px;
  padding: 0;
}
.select-div {
  max-width: 90%;
  margin-left: 13px;
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
  font-family: "Montserrat-SemiBold";
  margin: auto auto;
  text-align: center;
}
.scroll-area {
  height: calc(100% - 130px);
  margin-top: 130px;
  border-right: 1px solid #ddd;
}
</style>
