<template>
  <q-card v-if="actionMode">
    <q-card-section v-if="!!title">
      <p id="title">{{ title }}</p>
      <p class="no-bottom text-left" v-if="type == 'forgotPassword'">
        Basta nos informar seu endereço de e-mail e nós enviaremos um link de
        redefinição de senha que permitirá que você escolha uma nova.
      </p>
    </q-card-section>

    <q-card-section id="input-section">
      <!-- Start Login/Forgot password fields -->
      <q-input
        v-if="type == 'login' || type == 'forgotPassword'"
        dense
        outlined
        ref="username"
        :rules="[(val) => !!val || 'Campo obrigatório', isValidEmail]"
        lazy-rules
        hide-bottom-space
        color="primary"
        v-model="username"
        label="E-mail"
      />
      <q-input
        v-if="type == 'login'"
        dense
        outlined
        color="primary"
        @keydown.enter="handleSubmit(type)"
        :rules="[(val) => !!val || 'Campo obrigatório']"
        lazy-rules
        hide-bottom-space
        v-model="password"
        label="Senha"
        type="password"
      />

      <q-input
        v-if="type == 'newPassword'"
        dense
        outlined
        color="primary"
        @keydown.enter="handleSubmit(type)"
        :rules="[(val) => !!val || 'Campo obrigatório', isValidPassword]"
        lazy-rules
        hide-bottom-space
        v-model="passwordRequest.password"
        label="Senha"
        type="password"
      />

      <!-- End Login/Forgot password fields -->
      <!-- Start SignUp password fields -->
      <div v-if="type == 'signUp'">
        <q-input
          dense
          ref="username"
          outlined
          :rules="[(val) => !!val || 'Campo obrigatório', isValidName]"
          lazy-rules
          hide-bottom-space
          maxlength="10"
          color="primary"
          v-model="signUp.name"
          label="Nome"
        />
        <q-input
          dense
          outlined
          :rules="[(val) => !!val || 'Campo obrigatório', isValidEmail]"
          lazy-rules
          hide-bottom-space
          color="primary"
          v-model="signUp.email"
          label="E-mail"
        />
        <q-input
          dense
          outlined
          mask="(##) #####-####"
          unmasked-value
          :rules="[(val) => !!val || 'Campo obrigatório', isValidPhone]"
          lazy-rules
          hide-bottom-space
          color="primary"
          v-model="signUp.phone"
          label="Celular (WhatsApp)"
        />
        <q-input
          dense
          outlined
          color="primary"
          @keydown.enter="handleSubmit(type)"
          :rules="[(val) => !!val || 'Campo obrigatório', isValidPassword]"
          lazy-rules
          hide-bottom-space
          v-model="signUp.password"
          label="Senha"
          type="password"
        />
      </div>
      <!-- End SignUp password fields -->
      <p class="text-warning" v-if="error">
        {{ error }}
      </p>
      <div class="row">
        <q-btn
          :disable="loading || invalidFields"
          :loading="loading"
          flat
          :label="buttonLabel"
          class="theme-button col-xs-12 col-sm-12 auto-margin"
          @click="handleSubmit(type)"
        />
      </div>
      <p
        class="button-like text-center q-mt-sm"
        style="font-size: 13px"
        v-if="type == 'login'"
        @click="type = 'forgotPassword'"
      >
        Esqueceu a senha?
      </p>
      <p
        class="button-like text-center q-mt-sm"
        style="font-size: 13px"
        v-if="type == 'forgotPassword'"
        @click="type = 'login'"
      >
        Lembrei minha senha
      </p>
      <p
        class="button-like text-center q-mt-sm"
        style="font-size: 13px"
        v-if="type == 'signUp'"
        @click="type = 'login'"
      >
        Tem uma conta? Conecte-se
      </p>
      <q-separator v-if="type == 'login'" />
      <p v-if="type == 'login'" class="register text-center">
        <q-btn
          flat
          label="Criar nova conta"
          class="signup-button col-xs-12 col-sm-6 auto-margin"
          @click="type = 'signUp'"
        />
      </p>
    </q-card-section>
  </q-card>
  <q-card v-else>
    <q-card-section>
      <p id="title" style="text-align: center !important">E-mail enviado!</p>
      <p>
        Enviamos um e-mail com um link para você poder entrar novamente na sua
        conta.
      </p>
      <q-btn
        flat
        label="OK"
        class="theme-button col-xs-12 col-sm-6 auto-margin"
        @click="actionMode = true"
      />
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ISignUp, IPasswordRequest } from "components/models";
import authService from "src/services/AuthService";
import userService from "src/services/UserService";
import { mapActions } from "vuex";
import helpers from "src/utils/helpers";

export default defineComponent({
  name: "SignUpComponent",
  mixins: [helpers],
  data() {
    const type: string = "login";
    const username: string = "";
    const password: string = "";
    const loading: boolean = false;
    const error: string = "";
    const actionMode: boolean = true;
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
      actionMode,
    };
  },

  created() {
    this.passwordRequest.token = this.$route.query.token?.toString() ?? "";
    if (this.passwordRequest.token) {
      this.type = "newPassword";
    };
    if (this.type == 'login') {

      this.clearSession();
    }
  },

  async mounted() {
    await this.$nextTick();
    (this.$refs["username"] as any).$el.focus();
  },

  methods: {
    ...mapActions("session", ["saveSessionInfo", "clearSession"]),

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
      this.actionMode = false;
    },

    async handleNewPassword() {
      const response = await userService.resetPassword(this.passwordRequest);
      if (!response) {
        this.error =
          "Verifique o e-mail enviado à sua caixa de entrada e tente novamente";
        this.loading = false;
        return;
      }
      this.loading = false;
      this.type = "login";

      return;
    },

    async handleLogin() {
      this.loading = true;
      const response = await authService.auth({
        username: this.username,
        password: this.password,
      });
      if (!response) {
        this.error = "E-mail ou senha está incorreta. Tente novamente";
        this.loading = false;
        return;
      }
      this.saveSessionInfo(response);
      this.$router.push("/home");
    },
  },

  computed: {
    title(): string {
      const type = this.type;
      const title: Record<string, string> = {
        login: "",
        signUp: "Cadastro",
        newPassword: "Nova senha",
        forgotPassword: "Esqueceu sua senha?",
      };
      return title[type as keyof typeof String] ?? "Enviar";
    },

    buttonLabel(): string {
      const type = this.type;
      const title: Record<string, string> = {
        login: "Entrar",
        signUp: "Cadastre-se",
        forgotPassword: "Redefinir",
      };
      return title[type as keyof typeof String] ?? "Enviar";
    },

    invalidFields(): boolean | undefined {
      const type = this.type;
      switch (type) {
        case "login":
          if (
            !this.username ||
            !this.password ||
            this.isValidEmail(this.username) !== true
          )
            return true;
          return false;
        case "signUp":
          if (
            !this.signUp.name ||
            !this.signUp.email ||
            !this.signUp.password ||
            !this.signUp.phone ||
            this.isValidEmail(this.signUp.email) !== true ||
            this.isValidPassword(this.signUp.password) !== true ||
            this.isValidName(this.signUp.name) !== true ||
            this.isValidPhone(this.signUp.phone) !== true
          )
            return true;
          return false;
        case "forgotPassword":
          if (!this.username || this.isValidEmail(this.username) !== true)
            return true;
          return false;

        case "newPassword":
          if (this.isValidPassword(this.passwordRequest.password) !== true)
            return true;
          return false;
      }
    },
  },
});
</script>

<style lang="scss">
.button-like {
  cursor: pointer;
  color: $accent;
  font-weight: bold;
}
.register {
  margin-top: 15px;
  font-size: 13px;
}
.back-button {
  z-index: 9999;
  position: absolute;
  left: 2px;
  top: 2px;
}
</style>
