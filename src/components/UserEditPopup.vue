<template>
  <q-dialog v-model="show">
    <q-card id="popup-card-users">
      <div class="row flex flex-center">
        <div class="col-12 text-center">
          <div class="q-pb-md flex">
            <p id="popup-title">Editar usuário</p>
            <q-btn
              class="absolute"
              style="top: 10px; right: 15px"
              flat
              round
              icon="close"
              @click="$emit('close')"
            />
          </div>
          <q-separator class="col-12" />
        </div>

        <div class="col-xs-12 text-left" style="padding: 25px">
          <div>
            <q-input
              dense
              outlined
              maxlength="20"
              :rules="[(val) => !!val || 'Campo obrigatório', isValidName]"
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
              :rules="[(val) => !!val || 'Campo obrigatório', isValidPhone]"
              lazy-rules
              hide-bottom-space
              mask="(##) #####-####"
              unmasked-value
              color="primary"
              v-model="signUp.phone"
              label="Celular (WhatsApp)"
            />

            <q-input
              dense
              outlined
              lazy-rules
              hide-bottom-space
              unmasked-value
              color="primary"
              v-model="signUp.password"
              label="Senha (opcional)"
            />
          </div>

          <div class="col-12">
            <q-btn
              :disable="loading || invalidFields"
              :loading="loading"
              flat
              style="width: 100%"
              label="Cadastrar"
              class="col-12 theme-button"
              @click="handleSubmit()"
            />
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
import helpers from "src/utils/helpers";
import { mapGetters } from "vuex";
import UserService from "src/services/UserService";
import miscService from "src/services/MiscService";
import states from "../statics/utils/states.json";
export default {
  mixins: [helpers],
  props: {
    identifier: {
      type: String,
      default: null,
    },
    user: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      show: true,
      userUpdate: {
        id: "",
        establishments: [],
      },
      establishments: this.$store.state.session.user.establishments ?? [],
      establishmentOptions: this.$store.state.session.user.establishments ?? [],
      selectedEstablishment: "",
      disable: false,
      identifier: new Date().getTime().toString(),
      task: {
        identifier: this.identifier,
        type: "",
        title: "",
        description: "",
        additionalDescription: "",
        audioDescription: "",
        reference: [],
      },
      signUp: {
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "",
        paymentMethod: "",
        document: "",
        area: "",
        city: "",
        state: "",
        password: "",
        userEstablishment: {
          value: "",
          label: "",
        },
      },
      typeOptions: [
        {
          label: "FEED",
          value: "feed",
        },
        {
          label: "STORY",
          value: "story",
        },
        {
          label: "FEED/STORY",
          value: "feed_story",
        },
      ],
      history: [],
      update: true,
      loading: false,
      positiveProps: {
        type: "positive",
        caption: "Sucesso",
        message: "Usuário atualizado com sucesso",
        color: "positive",
      },
      negativeProps: {
        type: "negative",
        caption: "Erro",
        message: "Erro inesperado. Verifique os campos e tente novamente",
        color: "negative",
      },
      citiesLoading: false,
      stateOptions: states,
      citiesOptions: [],
    };
  },

  methods: {
    async handleSubmit() {
      this.loading = true;
      const form = this.signUp;

      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
      };

      const response = await UserService.edit(payload, this.identifier);
      if (!response) {
        this.$q.notify(this.negativeProps);
      } else {
        this.$q.notify(this.positiveProps);
      }
      this.loading = false;

      this.$emit("close");
    },
  },

  computed: {
    ...mapGetters("session", ["username", "isEmployee", "isAdmin"]),

    invalidFields() {
      const signUp = this.signUp;

      if (!this.isValidEmail(signUp.email)) return true;
      if (!this.isValidPhone(signUp.phone)) return true;

      if (!signUp.name || !signUp.email || !signUp.phone) {
        return true;
      }
      return false;
    },
  },

  created() {

    this.signUp = {
      name: this.user.name,
      phone: this.user.phone,
      email: this.user.email,
      password: ''
    }
  }
};
</script>

<style lang="scss">
#popup-title {
  margin: auto auto;
  text-align: center;
}
#popup-card-users {
  .q-input {
    margin-bottom: 10px;
  }

  .q-select {
    margin-bottom: 10px;
  }

  .q-carousel-slide {
    padding: 0;
  }

  p {
    margin-bottom: 0;
  }

  @media (max-width: $breakpoint-xs-max) {
    min-width: 100%;
    min-height: 0;
  }
}
</style>
