<template>
  <q-dialog v-model="show">
    <q-card id="popup-card-users">
      <div class="row flex flex-center">
        <div class="col-12 text-center">
          <div class="q-pb-md flex">
            <p id="popup-title">{{ edit ? 'Editar' : 'Cadastrar' }} empresa</p>
            <q-btn
              class="absolute"
              style="top: 10px; right: 15px"
              flat
              round
              icon="close"
              @click="$emit('close')"
            />
          </div>
          <q-separator class="col-12"/>
        </div>

        <div class="col-xs-12 text-left" style="padding: 25px">
          <div class="row">
            <div
              class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12"
              id="input-section"
            >
              <p id="title">Cadastrar empresa</p>
              <!--<q-input
                dense
                outlined
                :rules="[
                  (val) => !!val || 'Campo obrigatório',
                  isValidEstablishmentDocument,
                ]"
                lazy-rules
                hide-bottom-space
                color="primary"
                v-model="workplace.document"
                label="CNPJ/CPF da empresa"
              />-->
              <q-input
                dense
                outlined
                :rules="[(val) => !!val || 'Campo obrigatório', isValidName]"
                maxlength="15"
                lazy-rules
                hide-bottom-space
                color="primary"
                v-model="workplace.name"
                label="Nome da empresa"
              />
              <q-input
                dense
                outlined
                :rules="[(val) => !!val || 'Campo obrigatório', isValidEmail]"
                lazy-rules
                hide-bottom-space
                color="primary"
                v-model="workplace.email"
                label="E-mail da empresa"
              />
              <q-input
                dense
                outlined
                :rules="[(val) => !!val || 'Campo obrigatório', isValidPhone]"
                lazy-rules
                hide-bottom-space
                color="primary"
                mask="(##) #####-####"
                unmasked-value
                v-model="workplace.phone"
                label="Telefone da empresa"
              />
              <q-select
                dense
                outlined
                behavior="menu"
                color="primary"
                v-model="workplace.department"
                map-options
                emit-value
                :options="departmentOptions"
                label="Nicho"
              />
              <q-input
                dense
                outlined
                :rules="[(val) => !!val || 'Campo obrigatório']"
                lazy-rules
                hide-bottom-space
                color="primary"
                v-model="workplace.website"
                label="Website"
              />
              <q-select
                dense
                outlined
                behavior="menu"
                color="primary"
                v-model="workplace.address.country"
                :rules="[(val) => !!val || 'Campo obrigatório']"
                lazy-rules
                hide-bottom-space
                map-options
                emit-value
                :options="countryOptions"
                label="País"
              />
              <q-select
                dense
                outlined
                color="primary"
                behavior="menu"
                :rules="[(val) => !!val || 'Campo obrigatório']"
                lazy-rules
                hide-bottom-space
                @update:model-value="searchCities"
                v-model="workplace.address.state"
                map-options
                emit-value
                :options="stateOptions"
                label="Estado"
              />
              <q-input
                dense
                v-if="
            workplace.address.country != 'Brasil' && workplace.address.country
          "
                outlined
                :rules="[(val) => !!val || 'Campo obrigatório']"
                lazy-rules
                hide-bottom-space
                color="primary"
                v-model="workplace.address.city"
                label="Cidade"
              />
              <q-select
                dense
                v-if="
            workplace.address.country == 'Brasil' && workplace.address.state
          "
                outlined
                :options="citiesOptions"
                :loading="citiesLoading"
                :rules="[(val) => !!val || 'Campo obrigatório']"
                lazy-rules
                hide-bottom-space
                color="primary"
                v-model="workplace.address.city"
                label="Cidade"
              />
            </div>
          </div>
          <div class="row">
            <div
              class="col-xl-12 col-lg-12 col-md-12  col-sm-12 col-xs-12 text-center"
            >
              <q-btn
                :disable="loading || invalidFields"
                :loading="loading"
                flat
                :label=" edit ? 'Editar' : 'Cadastrar'"
                class="theme-button"
                @click="handleSubmit()"
              />
            </div>
          </div>

        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
import {defineComponent} from "vue";
import {mapActions, mapGetters} from "vuex";
import helpers from "src/utils/helpers";
import CreditPopup from "src/components/CreditPopup.vue";
import countries from "../statics/utils/countries.json";
import states from "../statics/utils/states.json";
import establishmentService from "src/services/EstablishmentService";

export default defineComponent({
  name: "PageIndex",
  mixins: [helpers],
  components: {
    CreditPopup
  },
  props: {
    edit: {
      item: Boolean,
      default: false
    },
    item: {
      item: Object,
      default: null
    }
  },
  data() {
    return {
      show: true,
      establishment: {
        document: "",
        name: "",
        email: "",
        phone: "",
        department: "",
        website: "",
        address: {
          country: "",
          state: "",
          city: "",
        },
        createdAt: 0,
        establishmentId: "",
      },
      citiesLoading: false,
      showCredits: false,
      citiesOptions: [],
      stateOptions: states,
      countryOptions: countries,
      loading: false,
      departmentOptions: [
        "Alimentos",
        "Bebidas",
        "Automotiva",
        "Casas / Decoração / Móveis",
        "Celebridades/Figura Publica",
        "Comunicação",
        "Comunidade",
        "Educação",
        "Eletrônicos",
        "Entretenimento",
        "Esporte",
        "Finanças",
        "Industria/Empresa",
        "Lugares e Locais",
        "Midia/Comunicação",
        "Moda/Luxo/Beleza",
        "Participação Social",
        "Pet",
        "Saúde/Higiene",
        "Serviços Gerais",
        "Tecnologia",
        "Viagens/Hotelaria",
        "Outros",
      ],
    };
  },

  computed: {
    ...mapGetters("session", ["isAdmin"]),
    workplace: {
      get() {
        if (this.item) {
          return this.item
        } else {
          return this.establishment
        }
      },
      set(value) {
        this.establishment = value;
        this.$emit('imput', value)
      }
    },
    invalidFields() {
      const w = this.workplace;
      const address = w.address;
      if (!w.name || !w.email || !w.phone || !w.department || !w.website)
        return true;
      if (!address.country || !address.state || !address.city) return true;
      if (!this.isValidEmail(w.email)) return true;
      if (this.isValidPhone(w.phone) !== true) return true;
      if (this.isValidName(w.name) !== true) return true;
      return false;
    },
  },

  methods: {
    ...mapActions("session", ["updateWorkplaces"]),

    async searchCities(uf) {
      this.citiesLoading = true;
      this.workplace.address.city = "";
      const {data} = await this.$axios.get(
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
      let response;
      if (this.edit) {
        response = await establishmentService.edit(this.workplace, this.workplace.establishmentId);
      } else {
        response = await establishmentService.save(this.workplace);
      }
      if (!response) {
        this.loading = false;
        return;
      }
      this.updateWorkplaces({
        value: response.establishmentId,
        label: response.name,
        role: response.role,
      });
      this.loading = false;
      this.$q.notify({
        type: "positive",
        caption: "Sucesso",
        message: `Estabelecimento ${this.edit ? 'editado' : 'Cadastrado'} com sucesso`,
        color: "positive",
      });
      this.$emit("close");
    },

    isValidEstablishmentDocument(val) {
      return this.validateDocument(val) || "CPF ou CNPJ inválido";
    },

    validateDocument(document) {
      if (document.length > 11) return this.validateCnpj(document);
      return this.validateCpf(document);
    },

    validateCnpj(cnpj) {
      cnpj = cnpj.replace(/[^\d]+/g, "");
      if (cnpj == "") return false;
      if (cnpj.length != 14) return false;
      // Elimina CNPJs invalidos conhecidos
      if (
        cnpj == "00000000000000" ||
        cnpj == "11111111111111" ||
        cnpj == "22222222222222" ||
        cnpj == "33333333333333" ||
        cnpj == "44444444444444" ||
        cnpj == "55555555555555" ||
        cnpj == "66666666666666" ||
        cnpj == "77777777777777" ||
        cnpj == "88888888888888" ||
        cnpj == "99999999999999"
      )
        return false;
      // Valida DVs
      let tamanho = cnpj.length - 2;
      let numeros = cnpj.substring(0, tamanho);
      let digitos = cnpj.substring(tamanho);
      let soma = 0;
      let pos = tamanho - 7;
      for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
      }
      let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
      if (resultado != digitos.charAt(0)) return false;
      tamanho = tamanho + 1;
      numeros = cnpj.substring(0, tamanho);
      soma = 0;
      pos = tamanho - 7;
      for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
      }
      resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
      if (resultado != digitos.charAt(1)) return false;
      return true;
    },

    validateCpf(doc) {
      let numeros, digitos, soma, i, resultado, digitos_iguais;
      digitos_iguais = 1;
      if (doc.length < 11) {
        return false;
      }
      for (i = 0; i < doc.length - 1; i++) {
        if (doc.charAt(i) != doc.charAt(i + 1)) {
          digitos_iguais = 0;
          break;
        }
      }
      if (!digitos_iguais) {
        numeros = doc.substring(0, 9);
        digitos = doc.substring(9);
        soma = 0;
        for (i = 10; i > 1; i--) {
          soma += numeros.charAt(10 - i) * i;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        if (resultado != digitos.charAt(0)) {
          return false;
        }
        numeros = doc.substring(0, 10);
        soma = 0;
        for (i = 11; i > 1; i--) {
          soma += numeros.charAt(11 - i) * i;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        if (resultado != digitos.charAt(1)) {
          return false;
        }
        return true;
      } else {
        return false;
      }
    },
  },
});
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
