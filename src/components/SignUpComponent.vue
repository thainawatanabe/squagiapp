<template>
  <q-card>
    <q-btn
      v-if="type != 'login'"
      icon="arrow_back"
      round
      flat
      class="text-left back-button"
      @click="type = 'login'"
    />

    <q-card-section>
      <p id="title">{{ title }}</p>
    </q-card-section>

    <q-card-section id="input-section">
      <!-- Start Login/Forgot password fields -->
      <q-input
        v-if="type == 'login' || type == 'forgotPassword'"
        dense
        outlined
        color="primary"
        v-model="username"
        label="Usuário"
      />
      <q-input
        v-if="type == 'login'"
        dense
        outlined
        color="primary"
        v-model="password"
        label="Senha"
        type="password"
      />

      <q-input
        v-if="type == 'newPassword'"
        dense
        outlined
        color="primary"
        v-model="passwordRequest.password"
        label="Senha"
        type="password"
      />

      <!-- End Login/Forgot password fields -->
      <!-- Start SignUp password fields -->
      <div v-if="type == 'signUp'">
        <q-input
          dense
          outlined
          color="primary"
          v-model="signUp.name"
          label="Usuário"
        />
        <q-input
          dense
          outlined
          color="primary"
          v-model="signUp.email"
          label="E-mail"
        />
        <q-input
          dense
          outlined
          color="primary"
          v-model="signUp.phone"
          label="Celular (WhatsApp)"
        />
        <q-input
          dense
          outlined
          color="primary"
          v-model="signUp.password"
          label="Senha"
          type="password"
        />
      </div>
      <!-- End SignUp password fields -->
      <p
        class="button-like text-left"
        style="font-size: 13px"
        v-if="type == 'login'"
        @click="type = 'forgotPassword'"
      >
        Esqueceu a senha?
      </p>
      <p class="text-warning" v-if="error">
        {{ error }}
      </p>
      <q-btn
        :disable="loading || invalidFields"
        :loading="loading"
        rounded
        flat
        :label="buttonLabel"
        class="theme-button"
        @click="handleSubmit(type)"
      />
      <p v-if="type == 'login'" class="register text-left">
        Não possui uma conta?
        <span class="button-like" @click="type = 'signUp'">Cadastre-se</span>
      </p>
    </q-card-section>
  </q-card>

  <div></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ISignUp, IPasswordRequest } from "components/models";
import authService from "src/services/AuthService";
import userService from "src/services/UserService";
import { mapActions } from "vuex";

export default defineComponent({
  name: "SignUpComponent",
  data() {
    const type: String = "login";
    const username: String = "";
    const password: String = "";
    const loading: boolean = false;
    const error: String = "";
    const passwordRequest: IPasswordRequest = {
      token: null,
      password: "",
    };
    const signUp: ISignUp = {
      name: "",
      email: "",
      password: "",
      phone: "",
    };
    return {
      type,
      username,
      password,
      loading,
      error,
      signUp,
      passwordRequest,
    };
  },

  created() {
    this.passwordRequest.token = this.$route.query.token?.toString() ?? "";
    if (this.passwordRequest.token) {
      this.type = "newPassword";
    }
  },

  methods: {
    ...mapActions("session", ["saveSessionInfo"]),

    handleSubmit(type: string) {
      this.error = "";
      this.loading = true;
      switch (type) {
        case "signUp":
          this.handleSignUp();
          break;
        case "forgotPassword":
          this.handlePasswordRequest();
          break;
        case "newPassword":
          this.handleNewPassword();
          break;
        default:
          this.handleLogin();
      }
    },

    async handleSignUp() {
      const response = await userService.create(this.signUp);
      if (!response) {
        this.error = "Usuário já existente";
        this.loading = false;
        return;
      }
      this.saveSessionInfo(response);
      this.$router.push("/home");
    },

    async handlePasswordRequest() {
      const response = await userService.requestNewPassword(this.username);
      if (!response) {
        this.error = "Usuário não encontrado";
        this.loading = false;
        return;
      }
      this.loading = false;
      this.username = "";
      this.type = "login";
    },

    async handleNewPassword() {
      const response = await userService.resetPassword(this.passwordRequest);
      if (!response) {
        this.error = 'Verifique o e-mail enviado à sua caixa de entrada e tente novamente';
        this.loading = false;
        return;
      }
      this.loading = false;
      this.type = 'login';

      return;
    },

    async handleLogin() {
      this.loading = true;
      const response = await authService.auth({
        username: this.username,
        password: this.password,
      });
      if (!response) {
        this.error = "Verifique os campos e tente novamente";
        this.loading = false;
        return;
      }
      this.$store.dispatch("saveSessionInfo", response);
      this.$router.push("/home");
    },
  },

  computed: {
    title(): string {
      const type = this.type;
      const title: Record<string, string> = {
        login: "Login",
        signUp: "Cadastro",
        forgotPassword: "Esqueceu sua senha?",
      };
      return title[type as keyof typeof String] ?? "Enviar";
    },

    buttonLabel(): string {
      const type = this.type;
      const title: Record<string, string> = {
        login: "Entrar",
        signUp: "Enviar",
        forgotPassword: "Redefinir"
      };
      return title[type as keyof typeof String] ?? "Enviar";
    },

    invalidFields(): boolean | undefined {
      const type = this.type;
      switch (type) {
        case "login":
          if (!this.username || !this.password) return true;
          return false;
        case "signUp":
          if (
            !this.signUp.name ||
            !this.signUp.email ||
            !this.signUp.password ||
            !this.signUp.phone
          )
            return true;
          return false;
        case "forgotPassword":
          if (!this.username) return true;
          return false;
      }
    },
  },
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
#title {
  font-size: 26px;
  text-align: left;
  font-family: "Montserrat-Bold";
  margin-bottom: 0;
}
.back-button {
  z-index: 9999;
  position: absolute;
  left: 2px;
  top: 2px;
}
</style>
