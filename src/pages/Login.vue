<template>
  <q-page class="row items-center justify-evenly">
    <q-card>
      <q-card-section>
        <q-img src="../statics/images/squagi.png" />
      </q-card-section>
      <q-card-section id="input-section">
        <q-input dense outlined color="primary" v-model="username" label="Usuário" />
        <q-input dense outlined color="primary" v-model="password" label="Senha" />
        <p class="button-like text-left" style="font-size: 13px" @click="$router.push('/senha')">Esqueceu a senha?</p>
        <p class="text-warning" v-if="error">Verifique os campos e tente novamente</p>
        <q-btn :disable="loading" :loading="loading" rounded flat label="Entrar" class="theme-button" @click="onSubmit()" />
        <p class="register text-left">Não possui uma conta? <span class="button-like" @click="$router.push('/cadastrar')">Cadastre-se</span></p>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { Todo, Meta } from "components/models";
import ExampleComponent from "components/OptionsComponent.vue";
import { defineComponent } from "vue";
import authService from "src/services/AuthService";
import { mapActions } from "vuex";

export default defineComponent({
  name: "PageIndex",
  components: { ExampleComponent },
  data() {
    const todos: Todo[] = [
      {
        id: 1,
        content: "ct1",
      },
      {
        id: 2,
        content: "ct2",
      },
      {
        id: 3,
        content: "ct3",
      },
      {
        id: 4,
        content: "ct4",
      },
      {
        id: 5,
        content: "ct5",
      },
    ];
    const meta: Meta = {
      totalCount: 1200,
    };
    const username: String = '';
    const password: String = '';
    const loading: boolean = false;
    const error: boolean = false;
    return { todos, meta, username, password, loading, error };
  },

  methods: {
    ...mapActions(['saveSessionInfo']),
    async onSubmit() {
      this.loading = true;
      const response = await authService.auth({ username: this.username, password: this.password });
      if (!response) {
        this.error = true;
        this.loading = false;
        return;
      }
      this.$store.dispatch('saveSessionInfo', response);
      this.$router.push('/');
    }
  }
});
</script>
<style lang="scss">
#input-section {
  .q-input {
    max-width: 100%;
    margin: auto auto;
    padding-bottom: 10px;
  }
}
.button-like {
  cursor: pointer;
  color: $accent;
  font-weight: bold;
}
.register {
  margin-top: 15px;
  font-size: 13px;
}
</style>
