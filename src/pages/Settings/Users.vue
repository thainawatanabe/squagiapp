<template>
  <q-page class="row items-center justify-evenly">
    <div id="main">
      <div class="row justify-between">
        <p id="title" class="q-my-md q-mx-md">Usuários</p>

        <div>
          <q-btn
            v-if="role != 'EMPLOYEE'"
            class="theme-button q-my-md q-mx-sm"
            flat
            label="Desvincular"
            @click="unattachUser = true"
          />
          <q-btn
            v-if="role != 'EMPLOYEE'"
            class="theme-button q-my-md q-mx-sm"
            flat
            label="Vincular"
            @click="attachUser = true"
          />
          <q-btn
            class="theme-button q-my-md q-mx-sm"
            flat
            label="Novo"
            @click="registerUser = true"
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
              if (!val) getUsers();
            }
          "
            color="primary"
            @keydown.enter="getUsers()"
          >
            <template v-slot:append>
              <q-btn round flat @click="getUsers()" icon="search" dense/>
            </template>
          </q-input>
        </div>

        <div v-if="users[0]" id="table-div">
          <Table
            :data="users"
            :columns="columns"
            :pagination="pagination"
            :key="randomKey"
            @onSelectedRow="onSelectedRow"
            @changeStatus="changeStatus"
            @update="getUsers()"
            @reload="getUsers()"
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
              @click="getUsers()"
            />
          </div>
        </div>
        <p v-else-if="!loading">Nenhum usuário encontrado</p>
        <q-inner-loading :showing="loading">
          <q-spinner-oval size="50px" color="primary"/>
        </q-inner-loading>
      </q-card>
      <UserRegisterPopup
        persistent
        v-if="registerUser"
        @close="
        registerUser = false;
        (selectedUser = null), getUsers();
      "
        :role="role"
        :isNew="true"
        :edit="edit"
      />
      <UserUnRegisterPopup
        persistent
        v-if="unattachUser"
        @close="
        unattachUser = false;
        getUsers();
      "
        :role="role"
        :isNew="false"
      />
      <UserRegisterPopup
        persistent
        v-if="attachUser"
        @close="
        attachUser = false;
        getUsers();
      "
        :role="role"
        :isNew="false"
      />
      <DesactivePopup
        persistent
        v-if="editStatus"
        :item="selectedUser"
        @close="
        editStatus = false;
        getUsers();
      "
        :role="role"
        @agree="activeDesactiveUser"

      />
      <UserEditPopup
        persistent
        v-if="editUser"
        :user="selectedUser"
        :identifier="selectedUser.identifier"
        @close="
        editUser = false;
        (selectedUser = null), getUsers();
      "
      />
    </div>
  </q-page>
</template>

<script>
import {defineComponent} from "vue";
import {mapActions, mapGetters} from "vuex";
import Table from "src/components/Table.vue";
import helpers from "src/utils/helpers";
import UserRegisterPopup from "src/components/UserRegisterPopup.vue";
import UserEditPopup from "src/components/UserEditPopup.vue";
import UserUnRegisterPopup from "src/components/UserUnRegisterPopup.vue";
import UserService from "src/services/UserService";
import DesactivePopup from "components/DesactivePopup.vue";

export default defineComponent({
  name: "Users",
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
  components: {DesactivePopup, Table, UserRegisterPopup, UserEditPopup, UserUnRegisterPopup},
  data() {

    return {
      selectedUser: null,
      edit: false,
      editStatus: false,
      attachUser: false,
      unattachUser: false,
      registerUser: false,
      loading: false,
      randomKey: false,
      clickCount: 0,
      users: [],
      pagination: {
        page: 1,
        rowsPerPage: 0,
      },
      searchParam: "",
      current: 1,
      pages: 1,
      pageSize: 25,
      editUser: false,
      taskStatus: "",
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
    };
  },
  mixins: [helpers],
  methods: {
    ...mapActions("session", ["saveSessionInfo"]),
    getEstablishments(establishments) {
      if (establishments && establishments[0]) {
        return establishments[0].name;
      }
      return "";
    },
    onSelectedRow(user) {
      if (this.isAdmin) {
        this.selectedUser = user;
        this.editUser = true;
      }
    },
    changeStatus(user) {
      if (this.isAdmin) {
        this.selectedUser = user;
        this.editStatus = true;
      }
    },
    increment() {
      this.clickCount += 1;
    },
    async activeDesactiveUser(item) {
      item.status = item.status === 'ACTIVE' ? 'DESACTIVE' : 'ACTIVE'
      const response = await UserService.edit(item, item.identifier)
      if (!response) {
        this.$q.notify(this.negativeProps);
      } else {
        this.$q.notify(this.positiveProps);
      }
      await this.getUsers();
      this.editStatus = false;
    },
    async getUsers() {
      this.randomKey = !this.randomKey;
      this.users = [];
      this.loading = true;

      const {data, status} = await UserService.getUsers(
        this.searchParam,
        this.pageSize,
        this.current,
        this.role,
        this.selectedEstablishment
      );
      if (status == 200) {
        this.users = data.users;
        this.loading = false;
        this.pages = Math.ceil(data.total / this.pageSize);
      }
    },
  },

  created() {
    this.getUsers();
  },

  watch: {
    role() {
      this.getUsers();
    },
  },

  computed: {
    ...mapGetters("session", [
      "isEmployee",
      "selectedEstablishment",
      "isAdmin",
    ]),

    columns() {
      const allColumns = [
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
          name: "establishments",
          required: true,
          label: "Estabelecimentos",
          align: "left",
          field: "establishments",
          format: (val) => this.getEstablishments(val),
        },

      ];
      if (this.role !== "EMPLOYEE"){
        allColumns.push({
          required: false,
          label: "Ativar/Destivar",
          name: "active",
          align: "left",
          field: "active",
          type: "switch",
        });
      }
      if (this.role != "EMPLOYEE") return allColumns;

      const payment = {
        name: "paymentMethod",
        required: true,
        label: "PIX",
        align: "left",
        field: "paymentMethod",
      };
      const area = {
        name: "area",
        required: true,
        label: "Setor",
        align: "left",
        field: "area",
      };

      const filteredColumns = allColumns.filter(
        (c) => c.name != "establishments"
      );
      filteredColumns.push(payment);
      filteredColumns.push(area);
      filteredColumns.push({
        required: false,
        label: "Ativar/Destivar",
        name: "active",
        align: "left",
        field: "active",
        type: "switch",
      });
      return filteredColumns;
    },
  },
});
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
