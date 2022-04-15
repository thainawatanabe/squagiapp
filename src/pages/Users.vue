<template>
  <q-page class="items-left">
    <div class="row justify-content">
      <div class="col-md-5 col-xs-12" id="input-section">
        <p id="title">Vincular estabelecimento</p>
        <q-input
          dense
          outlined
          :rules="[(val) => !!val || 'Campo obrigatório']"
          lazy-rules
          hide-bottom-space
          color="primary"
          v-model="userUpdate.id"
          label="ID do usuário"
        />
        <q-select
          dense
          outlined
          color="primary"
          :rules="[(val) => !!val || 'Campo obrigatório']"
          lazy-rules
          hide-bottom-space
          v-model="userUpdate.establishments"
          :options="establishments"
          label="Estabelecimento"
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
      <div class="col-xs-1"></div>
      <div class="col-md-5 col-xs-12" id="input-section">
        <p id="title">Cadastro</p>
        <div>
          <q-input
            dense
            outlined
            :rules="[(val) => !!val || 'Campo obrigatório']"
            lazy-rules
            hide-bottom-space
            color="primary"
            v-model="signUp.name"
            label="Usuário"
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
            :rules="[(val) => !!val || 'Campo obrigatório']"
            lazy-rules
            hide-bottom-space
            mask="(##) #####-####"
            color="primary"
            v-model="signUp.phone"
            label="Celular (WhatsApp)"
          />

          <q-select
            dense
            outlined
            color="primary"
            v-model="signUp.roles"
            :rules="[(val) => !!val || 'Campo obrigatório']"
            lazy-rules
            hide-bottom-space
            :options="roleOptions"
            label="Nível de acesso"
          />

          <q-select
            dense
            outlined
            color="primary"
            :rules="[(val) => !!val || 'Campo obrigatório']"
            lazy-rules
            hide-bottom-space
            v-model="signUp.establishments"
            :options="establishments"
            label="Estabelecimentos"
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
    <GenericPopup
      v-if="showPopup"
      @close="handlePopupClose()"
      :properties="popupProps"
    />
  </q-page>
</template>

<script lang="ts">
import { IUserSignUp } from "components/models";
import ExampleComponent from "components/OptionsComponent.vue";
import UserService from "src/services/UserService";
import { defineComponent } from "vue";
import GenericPopup from "../components/GenericPopup.vue";

export default defineComponent({
  name: "PageIndex",
  components: { ExampleComponent, GenericPopup },
  data() {
    const establishments = this.$store.state.session.user.establishments ?? [];
    const signUp: IUserSignUp = {
      name: "",
      email: "",
      password: "",
      phone: "",
      roles: [],
      establishments: [],
    };
    const loading: boolean = false;
    const showPopup: boolean = false;
    const roleOptions: Array<Record<string, string>> = [
      {
        label: "Usuário",
        value: "USER",
      },
      {
        label: "Gerente",
        value: "MANAGER",
      },
      {
        label: "Colaborador",
        value: "EMPLOYEE",
      },
      // {
      //   label: "Administrador",
      //   value: "ADMIN",
      // },
    ];
    const userUpdate: any = {};
    const popupProps: Record<string, string | boolean> = {
      title: "Sucesso",
      titleStyle: "display: block; background-color: #ffffff",
      text: "Usuário cadastrado com sucesso",
      sectionStyling: "padding-top: 20px;padding-bottom:15px",
      cardStyle: "max-width: 300px",
      titleSpanStyle: "color: #363636",
      separator: true,
    };

    return {
      signUp,
      roleOptions,
      userUpdate,
      showPopup,
      popupProps,
      establishments,
      loading
    };
  },

  computed: {
    invalidFields() {
      const signUp = this.signUp;
      console.log('signUp.name :>> ', signUp.name);
      console.log('signUp.name :>> ', signUp.email);
      console.log('signUp.name :>> ', signUp.phone);
      console.log('signUp.name :>> ', signUp.roles[0]);
      console.log('signUp.name :>> ',signUp.establishments[0]);
      if (
        !signUp.name ||
        !signUp.email ||
        !signUp.phone ||
        !signUp.roles[0] ||
        !signUp.establishments[0]
      )
        return true;
      return false;
    },
  },

  methods: {
    isValidEmail(val: string) {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || "E-mail inválido";
    },

    async handleSubmit(type: string) {
      this.loading = true;
      if (type == "newUser") {
        const establishment = this.signUp.establishments.map((e) => {
          return {
            establishmentId: e.value,
            name: e.label,
            role: "USER",
          };
        });
        this.signUp.establishments = establishment;
        const response = await UserService.newUser(this.signUp);
        this.showPopup = true;
        this.loading = false;
      } else {
        const payload = {
          id: this.userUpdate.id,
          establishmentId: this.userUpdate.establishments.value,
          name: this.userUpdate.establishments.label,
          role: "USER",
        };
        await UserService.newEstablishment(payload);
        this.showPopup = true;
        this.loading = false;
      }
    },

    handlePopupClose() {
      location.reload();
    },
  },
});
</script>
