<template>
  <q-page class="items-left">
    <div class="row justify-content" :key="update">
      <div class="col-md-5 col-xs-12" id="input-section">
        <p id="title">Vincular usuário</p>
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
          label="Cadastrar"
          class="theme-button"
          @click="handleSubmit('update')"
        />
      </div>
      <div class="col-xs-1"></div>
      <div
        :class="`col-md-5 col-xs-12 ${$q.screen.xs ? 'q-mt-md' : ''}`"
        id="input-section"
      >
        <p id="title">Cadastrar novo usuário</p>
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
            :rules="[(val) => !!val || 'Campo obrigatório']"
            lazy-rules
            hide-bottom-space
            v-model="signUp.userEstablishment"
            :options="establishments"
            label="Estabelecimento"
          />

          <q-select
            v-if="signUp.userEstablishment.value"
            dense
            outlined
            color="primary"
            v-model="signUp.role"
            :rules="[(val) => !!val || 'Campo obrigatório']"
            lazy-rules
            map-options
            emit-value
            hide-bottom-space
            :options="roleOptions"
            label="Nível de acesso"
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
import { IUserCreation } from "components/models";
import ExampleComponent from "components/OptionsComponent.vue";
import UserService from "src/services/UserService";
import { defineComponent } from "vue";
import GenericPopup from "../components/GenericPopup.vue";

export default defineComponent({
  name: "PageIndex",
  components: { ExampleComponent, GenericPopup },
  data() {
    const establishments = this.$store.state.session.user.establishments ?? [];
    const signUp = {
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "",
      userEstablishment: {
        value: "",
        label: "",
      },
    };
    const update: boolean = true;
    const loading: boolean = false;
    const showPopup: boolean = false;
    const userUpdate: any = {};
    const popupProps: Record<string, string | boolean> = {};
    const positiveProps: Record<string, string | boolean> = {
      title: "Sucesso",
      titleStyle: "display: block; background-color: #ffffff",
      text: "Usuário cadastrado com sucesso",
      sectionStyling: "padding-top: 20px;padding-bottom:15px",
      cardStyle: "max-width: 300px",
      titleSpanStyle: "color: #363636",
      separator: true,
    };
    const negativeProps: Record<string, string | boolean> = {
      title: "Erro",
      titleStyle: "display: block; background-color: #ffffff",
      text: "Cadastro já realizado",
      sectionStyling: "padding-top: 20px;padding-bottom:15px",
      cardStyle: "max-width: 300px",
      titleSpanStyle: "color: #363636",
      separator: true,
    };
    return {
      signUp,
      userUpdate,
      showPopup,
      popupProps,
      establishments,
      loading,
      negativeProps,
      update,
      positiveProps,
    };
  },

  computed: {
    invalidFields() {
      const signUp = this.signUp;

      if (
        !signUp.name ||
        !signUp.email ||
        !signUp.phone ||
        !signUp.role ||
        !signUp.userEstablishment
      )
        return true;
      return false;
    },

    roleOptions() {
      const establishmentId = this.signUp.userEstablishment.value;
      const userEstablishments =
        this.$store.state.session.user.establishments ?? [];
      if (establishmentId) {
        const establishment = userEstablishments.find(
          (e: any) => e.value == establishmentId
          );
        const role = establishment ? establishment.role : "USER";
        let options = [];
        switch (role) {
          case "MANAGER":
            options = [
              {
                label: "Usuário",
                value: "USER",
              },
              {
                label: "Gerente",
                value: "MANAGER",
              },
            ];
            break;
          case "ADMIN":
            options = [
              {
                label: "Usuário",
                value: "USER",
              },
              {
                label: "Gerente",
                value: "MANAGER",
              },
              {
                label: "Administrador",
                value: "ADMIN",
              },
            ];
            break;
          default:
            return [
              {
                label: "Usuário",
                value: "USER",
              },
            ];
        }
        return options;
      }
      return [];
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
        const form = this.signUp;
        const userEstablishment = {
          establishmentId: form.userEstablishment.value,
          name: form.userEstablishment.label,
          role: form.role,
        };

        const payload: IUserCreation = {
          name: form.name,
          email: form.email,
          password: "",
          phone: form.phone,
          userEstablishment,
        };

        const response = await UserService.newUser(payload);
        if (!response) {
          this.popupProps = this.negativeProps;
        } else {
          this.popupProps = this.positiveProps;
        }
        this.showPopup = true;
        this.loading = false;
      } else {
        const payload = {
          id: this.userUpdate.id,
          userEstablishment: {
            establishmentId: this.userUpdate.establishments.value,
            name: this.userUpdate.establishments.label,
            role: "USER",
          },
        };
        const response = await UserService.sendInvitation(payload);
        if (!response) {
          this.popupProps = this.negativeProps;
        } else {
          this.popupProps = this.positiveProps;
        }
        this.showPopup = true;
        this.loading = false;
      }
    },

    handlePopupClose() {
      this.showPopup = false;
      this.$router.push("/home");
    },
  },
});
</script>
