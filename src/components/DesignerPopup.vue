<template>
  <q-dialog v-model="show">
    <q-card id="popup-card-designer">
      <div class="row flex flex-center">
        <div
          id="title"
          class="col-12 text-center q-mb-sm"
          style="text-align: center !important"
        >
          Atribuir designer
          <q-btn
            class="absolute"
            style="top: 10px; right: 15px"
            flat
            icon="close"
            round
            @click="$emit('close')"
          />
        </div>
        <q-separator />
        <div class="col-12 text-center q-mb-lg">
          <div class="row">
            <p class="q-mb-md" v-if="currentTask.designerName">{{ 'Designer atual: ' + currentTask.designerName }}</p>
            <q-select
              dense
              class="col-12 q-mt-md"
              outlined
              color="primary"
              behavior="menu"
              label="Colaborador"
              v-model="employee"
              :options="employees"
              emit-value
              map-options
            />
          </div>
        </div>
        <q-btn
          flat
          :disable="!employee"
          label="Sim"
          class="col-5 theme-button"
          @click="$emit('save', currentTask, employee)"
        />
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
import { mapGetters } from "vuex";
import taskService from "src/services/TaskService";
export default {
  data() {
    return {
      show: true,
      employee: "",
      employees: [],
    };
  },

  props: {
    currentTask: {
      type: Object,
      default: null,
    },
  },

  async created() {
    const { data } = await taskService.getEmployees();
    this.employees = data.map((e) => {
      return { label: e.name, value: e.identifier };
    });
  },

  computed: {
    ...mapGetters("session", ["username", "isEmployee", "isAdmin"]),
  },
};
</script>

<style lang="scss">
#popup-title {
  margin: auto auto;
  text-align: center;
}
#popup-card-designer {
  max-width: 430px;
  padding: 20px 25px 25px 25px;
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
