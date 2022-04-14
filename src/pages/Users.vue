<template>
  <q-page class="items-left">
    <div class="row">
      <div
        class="col-xl-4 col-lg-5 col-md-6 col-sm-8 col-xs-12"
        id="input-section"
      >
        <p id="title" class="color-white">Vincular estabelecimento</p>
        <q-input
          dense
          outlined
          color="primary"
          v-model="userUpdate.id"
          label="ID do usuário"
        />
        <q-select
          dense
          outlined
          color="primary"
          v-model="userUpdate.establishments"
          map-options
          emit-value
          use-chips
          label="Estabelecimentos"
        />

        <q-btn
          :disable="loading || !userUpdate.id || !userUpdate.establishments"
          :loading="loading"
          flat
          label="Enviar"
          class="theme-button"
          @click="handleSubmit('update')"
        />
      </div>
      <q-separator class="col-sm-12 q-mb-md q-mt-sm background-white" />
    </div>
    <div class="row">
      <div
        class="col-xl-4 col-lg-5 col-md-6 col-sm-8 col-xs-12"
        id="input-section"
      >
        <p id="title" class="color-white">Cadastro</p>
        <div>
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

          <q-select
            dense
            outlined
            color="primary"
            v-model="signUp.roles"
            map-options
            emit-value
            :options="roleOptions"
            multiple
            use-chips
            label="Níveis de acesso"
          />
        </div>

        <p class="text-warning" v-if="error">
          {{ error }}
        </p>
        <q-btn
          :disable="loading || invalidFields"
          :loading="loading"
          flat
          label="Cadastrar"
          class="theme-button"
          @click="handleSubmit('newUser')"
        />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { IUserSignUp } from "components/models";
import ExampleComponent from "components/OptionsComponent.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "PageIndex",
  components: { ExampleComponent },
  data() {
    const signUp: IUserSignUp = {
      name: "",
      email: "",
      password: "",
      phone: "",
      roles: ["USER"],
    };
    const roleOptions: Array<Record<string, string>> = [
      {
        label: "Básico",
        value: "USER",
      },
      {
        label: "Usuário",
        value: "MANAGER",
      },
      {
        label: "Funcionário",
        value: "EMPLOYEE",
      },
      {
        label: "Administrador",
        value: "ADMIN",
      },
    ];
    const userUpdate: any = {};
    return { signUp, roleOptions, userUpdate };
  },

  computed: {
    invalidFields() {

      if (!this.signUp.name || !this.signUp.email || !this.signUp.phone || !this.signUp.roles[0]) return true;
      return false;
    }
  }
});
</script>
