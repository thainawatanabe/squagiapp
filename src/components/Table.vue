<template>
  <div>
    <q-table
      flat
      :rows="data"
      :columns="columns"
      :propName="pagination"
      class="stock-table"
      :loading="loading"
      binary-state-sort
      row-key="identifier"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <template v-for="col in props.cols">
            <template v-if="col.name === 'createdAt'">
              <q-td :key="col.name" :props="props">
                <div class="relative-position">
                  {{ col.value }}
                  <q-btn
                    class="q-ml-xl q-mr-md theme-button"
                    color="primary"
                    flat
                    label="Detalhes"
                    no-caps
                    @click="props.expand = !props.expand"
                  />

                  <q-btn
                    v-if="checkActiveStatus(props.row)"
                    no-caps
                    flat
                    rounded
                    class="theme-button"
                    :label="
                      props.row.status == 'PENDING' ? 'Iniciar' : 'Corrigir'
                    "
                    @click="startTask(props.row)"
                  />
                  <q-btn
                    v-if="checkWaitingApproval(props.row)"
                    no-caps
                    flat
                    rounded
                    class="theme-button"
                    label="Analisar"
                    @click="props.expand = !props.expand"
                  />
                  <q-btn
                    v-if="checkPendingStatus(props.row)"
                    no-caps
                    flat
                    rounded
                    class="theme-button"
                    :label="'Finalizar'"
                    @click="props.expand = !props.expand"
                  />
                </div>
              </q-td>
            </template>
            <template v-else>
              <q-td :key="col.name" :props="props">{{ col.value }}</q-td>
            </template>
          </template>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left column-expanded">
              <div class="row" v-if="checkPendingStatus(props.row)">
                <q-file
                  dense
                  outlined
                  style="width: 285px"
                  class="q-mr-md col-sm-6"
                  accept=".jpg, .png"
                  max-file-size="167108864"
                  v-model="finalArt"
                  :disable="disable"
                  label="Arte final"
                >
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>
                <q-btn
                  no-caps
                  flat
                  rounded
                  :disable="!finalArt"
                  style="width: 285px"
                  class="theme-button col-sm-6"
                  :label="'Finalizar'"
                  @click="finishTask(props.row)"
                />
              </div>

              <p>Descrição: <span v-html="props.row.description"></span></p>
              <p v-if="props.row.additionalDescription">
                Descrição feed:
                <span v-html="props.row.additionalDescription"></span>
              </p>
              <p v-if="props.row.status == 'WAITING_APPROVAL' || props.row.status == 'APPROVED' || props.row.status == 'REJECTED'">Referência:</p>
              <q-img
                v-if="props.row.status == 'WAITING_APPROVAL' || props.row.status == 'APPROVED' || props.row.status == 'REJECTED'"
                :src="`https://s3.sa-east-1.amazonaws.com/reference.squagi.com.br/${props.row.finalArt}`"
                class="cursor-pointer"
                @click="openUrl(props.row.reference)"
              />
              <p v-if="props.row.status != 'WAITING_APPROVAL' && props.row.status != 'APPROVED' && props.row.status != 'REJECTED'">Arte final:</p>
              <q-img
                v-if="props.row.status != 'WAITING_APPROVAL' && props.row.status != 'APPROVED' && props.row.status != 'REJECTED'"
                :src="`https://s3.sa-east-1.amazonaws.com/reference.squagi.com.br/${props.row.reference}`"
                class="cursor-pointer"
                @click="openUrl(props.row.reference)"
              />

              <div class="row" v-if="checkWaitingApproval(props.row)">
                <q-btn
                  no-caps
                  flat
                  rounded
                  style="width: 285px"
                  class="theme-button col-sm-6 q-mr-md"
                  :label="'Rejeitar'"
                  @click="rejectTask(props.row)"
                />
                <q-btn
                  no-caps
                  flat
                  rounded
                  style="width: 285px"
                  class="theme-button col-sm-6"
                  :label="'Aprovar'"
                  @click="approveTask(props.row)"
                />
              </div>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import taskService from "src/services/TaskService";
export default {
  props: ["pagination", "columns", "data", "type", "loading"],
  name: "DefaultTable",
  data() {
    return {
      finalArt: "",
    };
  },
  methods: {
    openUrl(url) {
      window.open(
        `https://s3.sa-east-1.amazonaws.com/reference.squagi.com.br/${url}`,
        "_blank"
      );
    },

    checkActiveStatus(row) {
      if (!this.isEmployee) return false;
      return row.status == "PENDING" || row.status == "REJECTED";
    },

    checkPendingStatus(row) {
      if (!this.isEmployee) return false;
      return (
        (row.status == "ACCEPTED" || row.status == "REACCEPTED") &&
        row.responsible == this.username
      );
    },

    checkWaitingApproval(row) {
      return !this.isEmployee && !this.isAdmin && row.status == 'WAITING_APPROVAL';
    },

    async startTask(row) {
      const { data, status } = await taskService.startTask(
        row.identifier,
        this.username
      );
      if (status && status == 200) {
        this.$emit("update");
      }
    },

    async finishTask(row) {
      const formData = new FormData();
      formData.append("finalArt", this.finalArt);
      formData.append("identifier", row.identifier);
      const { data, status } = await taskService.finishTask(formData);
      if (status && status == 200) {
        this.$emit("update");
      }
    },

    async approveTask(row) {
      const { data, status } = await taskService.approveTask(row.identifier);
      if (status && status == 200) {
        this.$emit("update");
      }
    },

    async rejectTask(row) {
      const { data, status } = await taskService.rejectTask(row.identifier);
      if (status && status == 200) {
        this.$emit("update");
      }
    },
  },
  computed: {
    ...mapGetters("session", ["username", "isEmployee", "isAdmin"]),
  },
};
</script>

<style lang="scss">
.q-table thead,
.q-table tr,
.q-table th,
.q-table td {
  border: none;
}
.q-table th.sortable .q-table__sort-icon {
  opacity: 0.64;
}
.q-table__bottom {
  display: none;
}
.stock-table {
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    background-color: $primary;
  }
  thead tr:first-child th {
    font-weight: bold;
    font-size: 16px;
    color: #ffffff;
  }
  font-size: 16px;
  letter-spacing: 0px;
  .q-table__bottom .q-table__control {
    color: #ffffff;
    font-size: 14px;
  }
  .q-table tbody td {
    font-size: 16px;
    color: #363636;
  }
  .q-table tr {
    border: none;
  }
  tr:nth-child(odd) {
    td:not(.invisible) {
      background: #f1f1f1;
    }
  }
  tr:nth-child(even) {
    td:not(.invisible) {
      background: #f5f5f554;
    }
  }
}
.orders-table {
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    background-color: #929292 !important;
  }
  thead tr:first-child th {
    font-weight: bold;
    font-size: 16px;
    color: #ffffff;
  }
  font-size: 16px;
  letter-spacing: 0px;
  .q-table__bottom .q-table__control {
    color: #ffffff;
    font-size: 14px;
  }
  .q-table tbody td {
    font-size: 16px;
    color: #363636;
  }
  .q-table__bottom {
    display: none;
  }
  .q-table tr {
    border: none;
  }
  tr:nth-child(odd) {
    td:not(.invisible) {
      background: #f5f5f554;
    }
  }
  tr:nth-child(even) {
    td:not(.invisible) {
      background: #f1f1f1;
    }
  }
}
.q-table__grid-item-title {
  font-size: 14px;
  font-family: "Muli-Bold";
}
.q-table__grid-item-value {
  font-size: 14px;
}
.column-expanded {
  p {
    font-family: "Montserrat-SemiBold";
  }
  .q-img {
    max-width: 400px;
  }
}
</style>
