<template>
  <div id="main">
    <div class="row justify-between" v-if="!token">
      <p id="title">Solicitações</p>

      <div>
        <q-btn
          class="theme-button"
          flat
          label="Solicitar"
          @click="requestPopup = true"
          v-if="(type && !isEmployee) || isAdmin"
        />
      </div>
    </div>
    <q-card id="task-card" :style="{ display: token ? 'none' : '' }">
      <div class="buttons row justify-between q-mb-md">
        <q-select
          dense
          class="col-sm-6 col-xs-3"
          outlined
          color="primary"
          @update:model-value="getTasks()"
          behavior="menu"
          v-model="pageSize"
          :options="[25, 50, 100]"
        />
        <div class="col-sm-6 col-xs-9">
          <div :class="`row justify-end`">
            <q-select
              dense
              class="col-sm-6 col-xs-12"
              outlined
              style="max-width: 180px"
              color="primary"
              behavior="menu"
              label="Status"
              v-model="taskStatus"
              :options="statusOptions"
              emit-value
              map-options
              @update:model-value="getTasks()"
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
                  if (!val) getTasks();
                }
              "
              color="primary"
              @keydown.enter="getTasks()"
            >
              <template v-slot:append>
                <q-btn round flat @click="getTasks()" icon="search" dense />
              </template>
            </q-input>
          </div>
        </div>
      </div>

      <div v-if="tasks[0]" id="table-div">
        <Table
          :data="tasks"
          :columns="columns"
          :showMenu="true"
          :pagination="pagination"
          :key="randomKey"
          @update="getTasks()"
          @reload="getTasks()"
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
            @click="getTasks()"
          />
        </div>
      </div>
      <p v-else-if="!loading">Nenhuma solicitação encontrada</p>
      <q-inner-loading :showing="loading">
        <q-spinner-oval size="50px" color="primary" />
      </q-inner-loading>
    </q-card>
    <RequestPopup
      persistent
      v-if="requestPopup"
      @close="
        requestPopup = false;
        getTasks();
      "
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Todo, Meta } from "./models";
import taskService from "src/services/TaskService";
import { mapGetters, mapActions } from "vuex";
import Table from "src/components/Table.vue";
import helpers from "src/utils/helpers";
import RequestPopup from "src/components/RequestPopup.vue";

export default defineComponent({
  name: "TaskTable",
  props: {
    title: {
      type: String,
      required: true,
    },
    todos: {
      type: Array as PropType<Todo[]>,
      default: () => [] as Todo[],
    },
    meta: {
      type: Object as PropType<Meta>,
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
  },
  components: { Table, RequestPopup },
  data(): {
    clickCount: number;
    tasks: Array<Record<string, string | number | null>>;
    pagination: any;
    loading: boolean;
    randomKey: boolean;
    searchParam: string;
    current: number;
    pages: number;
    pageSize: number;
    taskStatus: string;
    statusOptions: Array<Record<string, string>>;
    requestPopup: boolean;
    pollingInterval: any;
  } {
    return {
      requestPopup: false,
      loading: false,
      randomKey: false,
      clickCount: 0,
      tasks: [],
      pagination: {
        page: 1,
        rowsPerPage: 0,
      },
      searchParam: "",
      current: 1,
      pages: 1,
      pageSize: 25,
      taskStatus: "",
      statusOptions: [
        {
          label: "Todos",
          value: "",
        },
        {
          label: "Aguardando",
          value: "PENDING",
        },
        {
          label: "Em andamento",
          value: "ACCEPTED",
        },
        {
          label: "Aguardando aprovação",
          value: "WAITING_APPROVAL",
        },
        {
          label: "Reprovado",
          value: "REJECTED",
        },
        {
          label: "Concluído",
          value: "APPROVED",
        },
      ],
      pollingInterval: null,
    };
  },
  mixins: [helpers],
  methods: {
    ...mapActions("session", ["saveSessionInfo"]),
    increment(): void {
      this.clickCount += 1;
    },
    async getTasks() {
      this.randomKey = !this.randomKey;
      this.tasks = [];
      this.loading = true;

      const { data, status } = await taskService.getTasks(
        this.searchParam,
        this.selectedEstablishment,
        this.pageSize,
        this.current,
        this.taskStatus,
        this.type
      );
      if (status == 200) {
        this.tasks = data.tasks;
        this.loading = false;
        this.pages = Math.ceil(data.total / this.pageSize);
      }
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
          name: "identifier",
          required: true,
          label: "ID",
          align: "left",
          field: "identifier",
        },
        {
          name: "title",
          required: true,
          label: "Título",
          align: "left",
          field: "title",
          format: (val: any, row: any) =>
            val ? val : row.description.substring(0, 15),
        },
        {
          name: "type",
          required: true,
          label: "Tipo",
          align: "left",
          field: "type",
          format: (val: any) => this.$t(`MAIN_TABLE.${val}`),
        },
        {
          name: "status",
          required: true,
          label: "Status",
          align: "center",
          field: "status",
          format: (val: any) => this.$t(`MAIN_TABLE.${val}`),
        },
        {
          name: "priority",
          required: true,
          label: "Prioridade",
          align: "left",
          field: "priority",
          format: (val: any) => this.$t(`MAIN_TABLE.${val}`),
        },
        {
          name: "establishment",
          required: true,
          label: "Empresa",
          align: "left",
          field: "establishment",
        },
        {
          name: "createdAt",
          required: true,
          label: "Criado em",
          align: "left",
          field: "createdAt",
          format: (val: any) => this.formatDate(val - 3 * 60 * 1000),
        },
        {
          name: "finishedAt",
          required: true,
          label: "Concluído",
          align: "left",
          field: "finishedAt",
          format: (val: any) => this.formatDate(val - 3 * 60 * 1000),
        },
      ];

      if (this.isAdmin || this.isEmployee) return allColumns;

      return allColumns.filter(
        (c) => c.name != "priority" && c.name != "establishment"
      );
    },
  },
  async created() {
    this.loading = true;
    if (this.token) {
      const { data } = await taskService.getTaskByToken(this.token);
      const task = data.task;
      task.expand = true;
      this.tasks.push(task);

      this.loading = false;
      return;
    } else {
      this.pollingInterval = setInterval(() => {
        this.getTasks();
      }, 15000 * 60);
      this.getTasks();
    }
  },

  beforeDestroy() {
    clearInterval(this.pollingInterval);
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
