<template>
  <q-dialog v-model="show">
    <q-card id="popup-card-users">
      <div class="row flex flex-center">
        <div class="col-12 text-center">
          <div class="q-pb-md flex">
            <p id="popup-title">
              {{ isNew ? "Cadastrar novo usuário" : "Vincular usuário" }}
            </p>
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
          <div v-if="isNew">
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
              :rules="[(val) => !!val || 'Campo obrigatório']"
              lazy-rules
              hide-bottom-space
              unmasked-value
              v-if="role == 'EMPLOYEE'"
              color="primary"
              v-model="signUp.paymentMethod"
              label="PIX"
            />

            <q-input
              dense
              outlined
              :rules="[(val) => !!val || 'Campo obrigatório']"
              lazy-rules
              v-if="role == 'EMPLOYEE'"
              hide-bottom-space
              unmasked-value
              color="primary"
              v-model="signUp.document"
              label="CPF"
            />

            <q-input
              dense
              outlined
              lazy-rules
              v-if="isAdmin"
              hide-bottom-space
              unmasked-value
              color="primary"
              v-model="signUp.password"
              label="Senha (opcional)"
            />

            <q-select
              dense
              outlined
              color="primary"
              v-if="role == 'EMPLOYEE'"
              behavior="menu"
              :rules="[(val) => !!val || 'Campo obrigatório']"
              lazy-rules
              hide-bottom-space
              v-model="signUp.area"
              :options="['Designer', 'Assistente virtual']"
              label="Setor"
            />

            <q-select
              dense
              outlined
              color="primary"
              v-if="role == 'EMPLOYEE'"
              behavior="menu"
              :rules="[(val) => !!val || 'Campo obrigatório']"
              lazy-rules
              hide-bottom-space
              @update:model-value="searchCities"
              fill-input
              use-input
              hide-selected
              input-debounce="0"
              @filter="filterStates"
              v-model="signUp.state"
              map-options
              emit-value
              :options="stateOptions"
              label="Estado"
            />

            <q-select
              dense
              v-if="signUp.state && role == 'EMPLOYEE'"
              outlined
              :options="cityOptions"
              :loading="citiesLoading"
              :rules="[(val) => !!val || 'Campo obrigatório']"
              lazy-rules
              hide-bottom-space
              color="primary"
              fill-input
              use-input
              hide-selected
              input-debounce="0"
              @filter="filterCities"
              v-model="signUp.city"
              label="Cidade"
            />

            <q-select
              dense
              outlined
              color="primary"
              behavior="menu"
              :rules="[(val) => !!val || 'Campo obrigatório']"
              lazy-rules
              hide-bottom-space
              v-if="role != 'EMPLOYEE'"
              v-model="signUp.userEstablishment"
              :options="establishmentOptions"
              fill-input
              use-input
              hide-selected
              input-debounce="0"
              @filter="filterEstablishments"
              label="Empresa"
            />

            <q-select
              v-if="signUp.userEstablishment.value"
              dense
              outlined
              color="primary"
              behavior="menu"
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

          <div v-else>
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
              behavior="menu"
              :rules="[(val) => !!val || 'Campo obrigatório']"
              lazy-rules
              hide-bottom-space
              v-if="role != 'EMPLOYEE'"
              v-model="userUpdate.establishments"
              :options="establishmentOptions"
              fill-input
              hide-selected
              input-debounce="0"
              use-input
              @filter="filterEstablishments"
              label="Empresa"
            />
          </div>

          <p class="text-warning" v-if="error">
            {{ error }}
          </p>

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
    role: {
      type: String,
      default: null,
    },
    isNew: {
      type: String,
      default: false,
    },
    edit: {
      type: Boolean,
      default: false,
    },
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
        message: "Usuário cadastrado com sucesso",
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
      cityOptions: [],
    };
  },

  async created() {
    if (this.isAdmin && this.role != "EMPLOYEE") {
      const { data } = await miscService.getEstablishments();
      this.establishments = data.map((e) => {
        return {
          label: e.name,
          value: e.establishmentId,
        };
      });
    } else {
      this.establishments = this.$store.state.session.user.establishments;
      this.establishmentOptions = this.establishments;
    }
  },

  methods: {
    async searchCities(uf) {
      this.citiesLoading = true;
      this.signUp.city = "";
      const { data } = await this.$axios.get(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
      );
      if (data && data.length > 0) {
        this.citiesOptions = data.map((d) => {
          return d.nome;
        });
        this.cityOptions = data.map((d) => {
          return d.nome;
        });
        this.citiesLoading = false;
      }
    },

    async handleSubmit() {
      this.loading = true;
      if (this.isNew == true) {
        const form = this.signUp;
        let userEstablishment = null;
        if (this.role == "USER") {
          userEstablishment = {
            establishmentId: form.userEstablishment.value,
            name: form.userEstablishment.label,
            role: form.role,
          };
        }

        const payload = {
          name: form.name,
          email: form.email,
          password: "",
          phone: form.phone,
          type: this.role,
          paymentMethod: form.paymentMethod,
          document: form.document,
          area: form.area,
          password: form.password,
          address: {
            city: form.city,
            state: form.state,
            country: "Brasil",
          },
          userEstablishment,
        };

        const response = await UserService.newUser(payload);
        if (!response) {
          this.$q.notify(this.negativeProps);
        } else {
          this.$q.notify(this.positiveProps);
        }
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
        if (!this.isNew) {
          this.positiveProps.message =
            "Usuário vinculado à empresa com sucesso.";
        } else {
          this.positiveProps.message = "Usuário cadastrado com sucesso";
        }
        if (!response) {
          this.$q.notify(this.negativeProps);
        } else {
          this.$q.notify(this.positiveProps);
        }
        this.loading = false;
      }

      this.$emit("close");
    },

    filterEstablishments(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        this.establishmentOptions = this.establishments.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },

    filterCities(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        this.cityOptions = this.citiesOptions.filter(
          (v) => v.toLowerCase().indexOf(needle) > -1
        );
      });
    },

    filterStates(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        this.stateOptions = states.filter(
          (v) => v.toLowerCase().indexOf(needle) > -1
        );
      });
    },
  },

  computed: {
    ...mapGetters("session", ["username", "isEmployee", "isAdmin"]),

    roleOptions() {
      if (this.isAdmin) {
        return [
          {
            label: "Usuário",
            value: "USER",
          },
          {
            label: "Proprietário",
            value: "OWNER",
          },
        ];
      }
      const establishmentId = this.signUp.userEstablishment.value;
      const userEstablishments =
        this.$store.state.session.user.establishments ?? [];
      if (establishmentId) {
        const establishment = userEstablishments.find(
          (e) => e.value == establishmentId
        );
        const role = establishment ? establishment.role : "USER";
        let options = [];
        switch (role) {
          case "OWNER":
            options = [
              {
                label: "Usuário",
                value: "USER",
              },
              {
                label: "Proprietário",
                value: "OWNER",
              },
            ];
            break;
          // case "ADMIN":
          //   options = [
          //     {
          //       label: "Usuário",
          //       value: "USER",
          //     },
          //     {
          //       label: "Proprietário",
          //       value: "OWNER",
          //     },
          //     {
          //       label: "Administrador",
          //       value: "ADMIN",
          //     },
          //   ];
          //   break;
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

    invalidFields() {
      if (this.isNew) {
        const signUp = this.signUp;

        if (!this.isValidEmail(signUp.email)) return true;
        if (!this.isValidPhone(signUp.phone)) return true;

        if (!signUp.name || !signUp.email || !signUp.phone) {
          if (this.role != "EMPLOYEE") {
            return true;
          }
        }

        if (
          this.role == "EMPLOYEE" &&
          (!signUp.paymentMethod ||
            !signUp.document ||
            !signUp.area ||
            !signUp.city ||
            !signUp.state)
        ) {
          return true;
        }

        return false;
      } else {
        if (!this.userUpdate.establishments.value || !this.userUpdate.id)
          return true;
        return false;
      }
    },

    sessionSelectedEstablishment() {
      return this.$store.state.session.user.selectedEstablishment ?? "";
    },
  },
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
