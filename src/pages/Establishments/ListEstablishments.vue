<template>
  <q-page class="row items-center justify-evenly">
    <div id="main">
      <div class="row justify-between">
        <p id="title" class="q-my-md q-mx-md">Empresas</p>

        <div>
          <q-btn
            class="theme-button q-my-md q-mx-sm"
            flat
            label="Novo"
            @click="newEstablishments"
          />
        </div>
      </div>
      <q-card id="task-card">
        <div class="buttons row justify-between q-mb-md">
          <q-select
            dense
            class="col-sm-6 col-xs-3"
            outlined
            color="primary"
            @update:model-value="getUsers()"
            behavior="menu"
            v-model="pageSize"
            :options="[25, 50, 100]"
          />
          <q-input
            type="search"
            outlined
            class="col-sm-6 col-xs-12"
            :class="`${$q.screen.xs ? 'q-mt-sm' : 'q-ml-sm'}`"
            dense
            placeholder="Pesquisa"
            aria-label="Search"
            v-model="searchParam"
            @input="
                    (val) => {
                      if (!val) getEstablishments();
                    }
                  "
            color="primary"
            @keydown.enter="getEstablishments()"
          >
            <template v-slot:append>
              <q-btn round flat @click="getEstablishments()" icon="search" dense/>
            </template>
          </q-input>
        </div>
        <div v-if="establishments.length > 0" id="table-div">
          <Table
            :data="establishments"
            :columns="columns"
            :pagination="pagination"
            :key="randomKey"
            @onSelectedRow="onSelectedRow"
            @update="getEstablishments()"
            @changeStatus="changeStatus"
            @reload="getEstablishments()"
            :loading="loading"
            :token="token"
          />
          <div class="q-pa-lg flex flex-center">
            <q-pagination
              v-model="current"
              color="primary"
              :max="pages"
              :max-pages="6"
              :boundary-numbers="true"
              size="md"
              @click="getEstablishments()"
            />
          </div>
        </div>
        <p v-else-if="!loading">Nenhum usuário encontrado</p>
        <q-inner-loading :showing="loading">
          <q-spinner-oval size="50px" color="primary"/>
        </q-inner-loading>
      </q-card>
    </div>
    <DesactivePopup
      persistent
      v-if="activeEstablishments"
      :item="selectedEstablishments"
      @close="
        activeEstablishments = false;
        getEstablishments();
      "
      :role="role"
      @agree="activeDesactiveEstablishments"

    />
    <EstablishmentEditPopup
      persistent
      v-if="editEstablishments"
      :item="selectedEstablishments"
      :edit="!!selectedEstablishments"
      @close="
        editEstablishments = false;
        getEstablishments();
      "
      :role="role"

    />
  </q-page>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import establishmentService from "../../services/EstablishmentService";
import Table from "src/components/Table.vue";
import DesactivePopup from "../../components/DesactivePopup";
import EstablishmentEditPopup from "../../components/EstablishmentEditPopup";

export default {
  name: "ListEstablishments",
  props: {
    title: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
    },
    type: {
      type: String,
      default: null,
    },
    token: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      default: "USER",
    },
  },
  components: {Table, DesactivePopup, EstablishmentEditPopup},
  data() {
    return {
      selectedEstablishments: null,
      registerEstablishments: false,
      activeEstablishments: false,
      editEstablishments: false,
      establishments: false,
      randomKey: false,
      pagination: {
        page: 1,
        rowsPerPage: 0,
      },
      loading: false,
      searchParam: "",
      current: 1,
      pages: 1,
      pageSize: 25,
      positiveProps: {
        type: "positive",
        caption: "Sucesso",
        message: "Status alterado com sucesso",
        color: "positive",
      },
      negativeProps: {
        type: "negative",
        caption: "Erro",
        message: "Erro inesperado. Verifique e novamente",
        color: "negative",
      },
    }
  },
  methods: {
    ...mapActions("session", ["saveSessionInfo"]),
    changeStatus(item) {
      if (this.isAdmin) {
        this.selectedEstablishments = item;
        this.activeEstablishments = true;
      }
    },
    async activeDesactiveEstablishments(item) {
      item.status = item.status === 'ACTIVE' ? 'DESACTIVE' : 'ACTIVE'
      const response = await establishmentService.edit(item, item.establishmentId)
      if (!response) {
        this.$q.notify(this.negativeProps);
      } else {
        this.$q.notify(this.positiveProps);
      }
      await this.getEstablishments();
      this.activeEstablishments = false;
    },
    async newEstablishments() {
      this.selectedEstablishments = null;
      this.editEstablishments = true;
    },
    async getEstablishments() {
      this.randomKey = !this.randomKey;
      this.establishments = [];
      this.loading = true;

      const {data, status} = await establishmentService.getEstablishments(
        this.searchParam,
        this.pageSize,
        this.current,
      );
      if (status == 200) {
        this.establishments = data.establishments;
        this.loading = false;
        this.pages = Math.ceil(data.total / this.pageSize);
      }
    },
    onSelectedRow(item) {
      this.selectedEstablishments = item;
      this.editEstablishments = true;
    }
  },
  computed: {
    ...mapGetters("session", [
      "isEmployee",
      "selectedEstablishment",
      "isAdmin",
    ]),
    columns() {
      return [
        {
          name: "createdAt",
          required: true,
          label: "ID",
          hascopy: true,
          align: "left",
          field: "createdAt",
        },
        {
          name: "name",
          required: true,
          label: "Nome",
          align: "left",
          field: "name",
        },
        {
          name: "email",
          required: true,
          label: "E-mail",
          align: "left",
          field: "email",
        },
        {
          required: false,
          label: "Ativar/Destivar",
          name: "active",
          align: "left",
          field: "active",
          type: "switch",
        }

      ];
    },
  },
  created() {
    this.getEstablishments();
  },
}
</script>

<style lang="scss">
#main {
  margin: 0 auto;
  text-align: left;
  width: 100%;
  height: 100vh !important;

  .activated * {
    color: $secondary !important;
  }
}

#banner {
  max-width: 450px;
  margin: 15px;
}

#task-card {
  max-width: 100%;
  border-radius: 4px;
  margin: auto auto;

  .buttons {
  }

  .q-input {
    max-width: 285px;

    span {
      color: #363636;
    }
  }

  .q-select {
    max-width: 80px;
  }
}

#table-div {
  text-align: center;
  margin: auto auto;
}
</style>
