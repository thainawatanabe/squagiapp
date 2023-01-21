<template>
  <q-page class="row">
    <div class="row full-width">
      <div class="col-12">
        <q-card id="terms-card" class="term-card">
          <div class="text-right" v-if="isAdmin">
            <q-btn
              :disable="loading"
              :loading="loading"
              flat
              rounded
              :label="edit ? 'Voltar' : 'Editar'"
              class="theme-button"
              @click="handleEdit()"
            />
          </div>
          <q-card-section v-if="!edit">
            <p id="title" class="text-center">TERMOS</p>
            <div v-html="`${terms}`" />
          </q-card-section>
          <q-card-section v-else>
            <p id="title" class="text-center">TERMOS</p>
            <q-editor v-model="newTerms" min-height="5rem" />
            <q-btn
              :disable="loading"
              :loading="loading"
              v-if="edit && isAdmin"
              flat
              rounded
              label="Salvar"
              class="positive-button q-mt-md"
              @click="save()"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import termService from "src/services/TermService";

export default defineComponent({
  name: "PageIndex",
  data() {
    return {
      terms: "",
      edit: false,
      newTerms: "",
      loading: false,
    };
  },

  async created() {
    this.fetch();
  },

  methods: {
    async fetch() {
      const { data } = await termService.fetch(this.type);
      this.terms = data.terms;
    },

    handleEdit() {
      this.edit = !this.edit;
      if (this.edit) {
        this.newTerms = this.terms;
      }
    },

    async save() {
      this.loading = true;
      const payload = {
        type: this.type,
        terms: this.newTerms,
      };
      await termService.save(payload);
      await this.fetch();
      this.edit = false;
      this.loading = false;
    },
  },

  computed: {
    ...mapGetters("session", [
      "isOwner",
      "isEmployee",
      "isAdmin",
      "selectedEstablishment",
    ]),

    type() {
      const location = this.$router.currentRoute
        ? this.$router.currentRoute.value.fullPath
        : "";
      if (!location) return;
      if (location.includes("feed")) return "feed_story";
    },
  },
});
</script>

<style lang="scss">
.term-card {
  max-width: 100%;
  text-align: left;
}
.area-text {
  width: 480px;
  @media (max-width: $breakpoint-xs-max) {
    width: 100%;
  }
}
.actual-text {
  height: 180px;
}
#terms-card {
  div {
    font-family: 'Muli';
    font-size: 15px;
  }

  b {
    font-family: 'Muli-Bold' !important;
  }
}
</style>
