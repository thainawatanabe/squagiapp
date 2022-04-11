<template>
  <q-page class="row items-center justify-evenly">
    <q-card>
      <q-btn icon="arrow_back" round flat style="z-index: 9999;position:absolute;left:20px;top:20px" class="text-left" @click="$router.push('/login')"/>
      <q-card-section>
        <q-img src="../statics/images/squagi.png" />
      </q-card-section>
      <q-card-section id="input-section">
        <q-input dense outlined color="primary" v-model="signUp.name" label="Usuário" />
        <q-input dense outlined color="primary" v-model="signUp.email" label="E-mail" />
        <q-input dense outlined color="primary" v-model="signUp.phone" label="Celular (WhatsApp)" />
        <q-input dense outlined color="primary" v-model="signUp.password" label="Senha" />

        <q-btn rounded flat label="Cadastrar" class="theme-button" @click="onSubmit()" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { ISignUp } from "components/models";
import { defineComponent } from "vue";
import userService from "src/services/UserService"

export default defineComponent({
  name: "SignUp",
  data() {

    const signUp: ISignUp = {
      name: '',
      email: '',
      password: '',
      phone: ''
    }
    return { signUp };
  },

  methods: {

    async onSubmit() {
      const response = await userService.create(this.signUp);
      if (!response) return;
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
