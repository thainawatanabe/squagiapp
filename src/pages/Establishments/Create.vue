<template>
  <q-page class="items-left">
    <div class="row">
      <div
        class="col-xl-4 col-lg-5 col-md-6 col-sm-8 col-xs-12"
        id="input-section"
      >
        <p id="title">Cadastro</p>
        <q-input
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
        />
        <q-input
          dense
          outlined
          :rules="[(val) => !!val || 'Campo obrigatório']"
          lazy-rules
          hide-bottom-space
          color="primary"
          v-model="workplace.name"
          label="Nome"
        />
        <q-input
          dense
          outlined
          :rules="[(val) => !!val || 'Campo obrigatório', isValidEmail]"
          lazy-rules
          hide-bottom-space
          color="primary"
          v-model="workplace.email"
          label="E-mail"
        />
        <q-input
          dense
          outlined
          :rules="[(val) => !!val || 'Campo obrigatório']"
          lazy-rules
          hide-bottom-space
          color="primary"
          mask="(##) #####-####"
          v-model="workplace.phone"
          label="Telefone (WhatsApp)"
        />
        <q-select
          dense
          outlined
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
          color="primary"
          v-model="workplace.address.country"
          map-options
          emit-value
          :options="countryOptions"
          label="País"
        />
        <q-select
          dense
          outlined
          color="primary"
          v-model="workplace.address.state"
          map-options
          emit-value
          :options="stateOptions"
          label="Estado"
        />
        <q-input
          dense
          outlined
          :rules="[(val) => !!val || 'Campo obrigatório']"
          lazy-rules
          hide-bottom-space
          color="primary"
          v-model="workplace.address.city"
          label="Cidade"
        />
      </div>
    </div>
    <div class="col-xs-12">
      <q-btn
        :disable="loading || invalidFields"
        :loading="loading"
        flat
        label="Enviar"
        class="theme-button"
        @click="handleSubmit()"
      />
    </div>
  </q-page>
  <GenericPopup
    v-if="showPopup"
    @close="handlePopupClose()"
    :properties="popupProps"
  />
</template>

<script lang="ts">
import { IWorkplace } from "components/models";
import ExampleComponent from "components/OptionsComponent.vue";
import { defineComponent } from "vue";
import countries from "../../statics/utils/countries.json";
import states from "../../statics/utils/states.json";
import establishmentService from "../../services/EstablishmentService.js";
import { mapActions } from "vuex";
import GenericPopup from "../../components/GenericPopup.vue";

export default defineComponent({
  name: "PageIndex",
  components: { ExampleComponent, GenericPopup },
  data() {
    const countryOptions = countries;
    const stateOptions = states;
    const loading = false;
    const showPopup = false;
    const popupProps = {
      title: "Sucesso",
      titleStyle: "display: block; background-color: #ffffff",
      text: "Estabelecimento cadastrado com sucesso",
      sectionStyling: "padding-top: 20px;padding-bottom:15px",
      cardStyle: "max-width: 300px",
      titleSpanStyle: "color: #363636",
      separator: true,
    };
    const workplace: IWorkplace = {
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
    };
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
    const departmentOptions = [
      "Alimentos",
      "Bebidas",
      "Automotiva",
      "Casas / Decoração / Móveis",
      "Celebridades/Figura Publica",
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
    ];
    return {
      workplace,
      departmentOptions,
      stateOptions,
      countryOptions,
      loading,
      showPopup,
      popupProps,
    };
  },

  computed: {
    invalidFields() {
      const w = this.workplace;
      const address = w.address;
      if (
        !w.name ||
        !w.document ||
        !w.email ||
        !w.phone ||
        !w.department ||
        !w.website
      )
        return true;
      if (!address.country || !address.state || !address.city) return true;
      if (!this.isValidEmail(w.email)) return true;
      if (!this.isValidEstablishmentDocument(w.document)) return true;
      return false;
    },
  },

  methods: {
    ...mapActions("session", ["updateWorkplaces"]),

    handlePopupClose() {
      location.reload();
      // this.workplace.document = "";
      // this.workplace.name = "";
      // this.workplace.email = "";
      // this.workplace.phone = "";
      // this.workplace.department = "";
      // this.workplace.website = "";
      // this.workplace.address = {
      //   country: "",
      //   state: "",
      //   city: "",
      // };
      // this.showPopup = false;
    },

    async handleSubmit() {
      this.loading = true;
      const response = await establishmentService.save(this.workplace);
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
      this.showPopup = true;
    },

    isValidEmail(val: string) {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || "E-mail inválido";
    },

    isValidEstablishmentDocument(val: string) {
      return this.validateDocument(val) || "CPF ou CNPJ inválido";
    },

    validateDocument(document: string) {
      if (document.length > 11) return this.validateCnpj(document);
      return this.validateCpf(document);
    },

    validateCnpj(cnpj: string) {
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
      let tamanho: any = cnpj.length - 2;
      let numeros: any = cnpj.substring(0, tamanho);
      let digitos = cnpj.substring(tamanho);
      let soma: any = 0;
      let pos = tamanho - 7;
      for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
      }
      let resultado: any = soma % 11 < 2 ? 0 : 11 - (soma % 11);
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

    validateCpf(doc: string) {
      let numeros: any, digitos, soma, i, resultado: any, digitos_iguais;
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
