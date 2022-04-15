<template>
  <q-card>
    <q-inner-loading :showing="loading">
      <q-spinner-oval size="50px" />
    </q-inner-loading>
    <q-card-section v-if="!loading">
      <strong><p>Sucesso!</p></strong>
      <p>A ação foi concluída com sucesso</p>
      <p class="register text-center">
        <q-btn
          flat
          label="Ir para o login"
          class="theme-button col-xs-12 col-sm-6 auto-margin"
          @click="$router.push('/')"
        />
      </p>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import userService from "../services/UserService.js";

export default defineComponent({
  name: "FeedbackComponent",
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  data(): { loading: boolean } {
    return {
      loading: true,
    };
  },

  methods: {
    async handleInvitation() {
      const token = this.$route.query.token?.toString() ?? "";
      await userService.newEstablishment(token);
      this.loading = false;
    }
  },

  created() {
    switch (this.type) {
      case "invitation":
        this.handleInvitation();
        break;
      default:
        return null;
    }
  },
});
</script>

<style lang="scss"></style>
