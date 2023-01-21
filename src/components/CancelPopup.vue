<template>
  <q-dialog v-model="show">
    <q-card id="popup-card-confirmation">
      <div class="row flex flex-center">
        <div id="title" class="col-12 text-center q-mb-sm" style="text-align: center !important">
          Atenção
        </div>
        <q-separator />
        <div class="col-12 text-center q-mb-lg">
          Realmente deseja confirmar essa ação?
        </div>
        <q-btn
          flat
          label="Sim"
          class="col-5 theme-button"
          @click="$emit('agree')"
        />

        <q-btn
          flat
          label="Não"
          class="col-5 q-ml-sm negative-button"
          @click="$emit('close')"
        />
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
          type: "EMPLOYEE",
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
  },

  computed: {
    ...mapGetters("session", ["username", "isEmployee", "isAdmin"]),

    invalidFields() {
      if (this.isNew) {
        const signUp = this.signUp;

        if (!this.isValidEmail(signUp.email)) return true;
        if (!this.isValidPhone(signUp.phone)) return true;
        if (
          !signUp.name ||
          !signUp.email ||
          !signUp.phone ||
          !signUp.paymentMethod ||
          !signUp.document ||
          !signUp.area ||
          !signUp.city ||
          !signUp.state
        )
          return true;
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
#popup-card-confirmation {
  padding: 20px 0 25px 0;
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
