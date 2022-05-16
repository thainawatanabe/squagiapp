<template>
  <div id="main">
    <Table
      v-if="tasks[0]"
      :data="tasks"
      :columns="columns"
      :pagination="pagination"
      :key="randomKey"
      @update="getTasks()"
      :loading="loading"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Todo, Meta } from "./models";
import taskService from "src/services/TaskService";
import { mapGetters } from "vuex";
import Table from "src/components/Table.vue";
import helpers from "src/utils/helpers";

export default defineComponent({
  name: "ExampleDashboard",
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
  },
  components: { Table },
  data(): {
    clickCount: number;
    tasks: Array<Record<string, string | number | null>>;
    columns: any;
    pagination: any;
    loading: boolean;
    randomKey: boolean;
  } {
    return {
      loading: false,
      randomKey: false,
      clickCount: 0,
      tasks: [],
      columns: [
        {
          name: "identifier",
          required: true,
          label: "ID",
          align: "left",
          field: "identifier",
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
          name: "title",
          required: true,
          label: "Título",
          align: "left",
          field: "title",
        },
        {
          name: "status",
          required: true,
          label: "Status",
          align: "left",
          field: "status",
          format: (val: any) => this.$t(`MAIN_TABLE.${val}`),
        },
        {
          name: "createdAt",
          required: true,
          label: "Criado em",
          align: "left",
          field: "createdAt",
          format: (val: any) => this.formatDateHour(val - 3 * 60 * 1000),
        },
      ],
      pagination: {
        rowsPerPage: 0,
      },
    };
  },
  mixins: [helpers],
  methods: {
    increment(): void {
      this.clickCount += 1;
    },
    async getTasks() {
      this.randomKey = !this.randomKey;
      this.tasks = [];
      this.loading = true;
      if (this.isEmployee || this.isAdmin) {
        const { data } = await taskService.getTasks("");
        this.tasks = data;
      } else {
        const { data } = await taskService.getTasks(this.selectedEstablishment);
        this.tasks = data;
      }
      this.loading = false;
    },
  },
  computed: {
    ...mapGetters("session", [
      "isEmployee",
      "selectedEstablishment",
      "isAdmin",
    ]),
  },
  async created() {
    this.getTasks();
  },
});
</script>

<style lang="scss">
#main {
  margin: 0 auto;
  text-align: left;
  width: 100%;
  height: 100vh !important;
}
#banner {
  max-width: 450px;
  margin: 15px;
}
</style>
