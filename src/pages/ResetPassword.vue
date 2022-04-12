<template>
  <q-page class="row items-center justify-evenly">
    <q-card>
      <q-btn icon="arrow_back" round flat style="z-index: 9999;position:absolute;left:20px;top:20px" class="text-left" @click="$router.push('/login')"/>
      <q-card-section>
        <q-img src="../statics/images/squagi.png" />
      </q-card-section>
      <q-card-section id="input-section" v-if="!passwordRequest.token">
        <p>Esqueceu a senha? Insira seu e-mail e enviaremos<br /> um e-mail para redefinição.</p>
        <q-input dense outlined color="primary" v-model="username" label="Usuário" />
        <p class="text-warning" v-if="error">Verifique os campos e tente novamente</p>
        <q-btn :loading="loading" :disable="loading" rounded flat label="Enviar" placeholder="Digite seu e-mail" class="theme-button" @click="onSubmit()" />
      </q-card-section>
      <q-card-section id="input-section" v-else>
        <q-input dense outlined color="primary" v-model="passwordRequest.password" label="Nova senha" type="password" />
        <p class="text-warning" v-if="error">Verifique os campos e tente novamente</p>
        <q-btn :loading="loading" :disable="loading" rounded flat label="Redefinir" class="theme-button" @click="onSubmit()" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { IPasswordRequest } from "src/components/models";
import { defineComponent } from "vue";
import userService from "src/services/UserService"

export default defineComponent({
  name: "Password",
  data() {

    const username: string = '';
    const passwordRequest: IPasswordRequest = {
      token: null,
      password: ''
    };
    const error: boolean = false;
    const loading: boolean = false;
    return { username, passwordRequest, error, loading };
  },

  created() {
    this.passwordRequest.token = this.$route.query.token?.toString() ?? '';
  },

  methods: {

    async onSubmit() {
      this.loading = true;
      this.error = false;
      if (!!this.passwordRequest.token) {
        const response = await userService.resetPassword(this.passwordRequest);
        if (!response) {
          this.error = true;
          this.loading = true;
          return;
        };
        this.$router.push('/login');

        return;
      }
      const response = await userService.requestNewPassword(this.username);
      if (!response) {
        this.error = true;
        this.loading = true;
        return;
      };
      this.$router.push('/login');
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
