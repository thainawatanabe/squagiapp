<template>
  <q-dialog v-model="show">
    <q-card id="popup-card-request">
      <div class="row flex flex-center">
        <div class="col-12 text-center q-pa-md">
          <div class="q-pb-md flex">
            <p id="popup-title">Nova solicitação</p>
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

        <div class="col-xs-12 q-pa-md description text-left">
          <q-select
            dense
            v-if="isAdmin"
            outlined
            color="primary"
            :rules="[(val) => !!val || 'Campo obrigatório']"
            lazy-rules
            behavior="menu"
            map-options
            emit-value
            hide-bottom-space
            @filter="filterEstablishments"
            hide-selected
            fill-input
            @update:model-value="getAmount()"
            use-input
            hide-dropdown-icon
            input-debounce="250"
            v-model="selectedEstablishment"
            :disable="disable"
            :options="establishmentOptions"
            label="Estabelecimento"
          />

          <q-select
            dense
            outlined
            color="primary"
            :rules="[(val) => !!val || 'Campo obrigatório']"
            lazy-rules
            behavior="menu"
            map-options
            emit-value
            hide-bottom-space
            @update:model-value="getAmount()"
            v-model="task.type"
            :disable="disable"
            :options="typeOptions"
            label="Tipo"
          />

          <p class="q-pb-sm">Créditos disponíveis: {{ currentAmount }}</p>

          <q-select
            dense
            outlined
            color="primary"
            lazy-rules
            behavior="menu"
            map-options
            emit-value
            hide-bottom-space
            v-model="task.priority"
            :disable="disable"
            :options="priorityOptions"
            label="Prioridade"
          />

          <q-input
            dense
            outlined
            maxlength="20"
            lazy-rules
            hide-bottom-space
            color="primary"
            v-model="task.title"
            :disable="disable"
            label="Título"
          />

          <div class="q-mb-sm">
            <textarea
              outlined
              maxlength="500"
              :rules="[(val) => !!val || 'Campo obrigatório']"
              lazy-rules
              hide-bottom-space
              color="primary"
              class="full-width"
              placeholder="Descrição"
              :disabled="disable"
              v-model="task.description"
            />
          </div>

          <div class="q-mb-sm">
            <textarea
              outlined
              maxlength="500"
              v-if="task.type == 'feed' || task.type == 'feed_story'"
              :rules="[(val) => !!val || 'Campo obrigatório']"
              lazy-rules
              hide-bottom-space
              color="primary"
              class="full-width"
              placeholder="Descrição da postagem"
              v-model="task.additionalDescription"
            />
          </div>

          <div class="q-mb-sm">
            <q-file
              multiple
              :max-files="3"
              dense
              outlined
              accept=".jpg, .png"
              max-file-size="67108864"
              v-model="task.reference"
              :disable="disable"
              label="Arquivo de referência"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </div>

          <q-btn
            :disable="loading || invalidFields || disable || currentAmount < 1"
            :loading="loading"
            flat
            style="width: 100%"
            label="Solicitar"
            class="theme-button"
            @click="handleSubmit('update')"
          />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
import helpers from "src/utils/helpers";
import { mapGetters } from "vuex";
import miscService from "src/services/MiscService";
import taskService from "src/services/TaskService";
import creditService from "src/services/CreditService";
export default {
  mixins: [helpers],
  data() {
    return {
      show: true,
      currentAmount: "",
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
        priority: 2
      },
      priorityOptions: [
        {
          label: "Baixa",
          value: 1
        },
        {
          label: "Normal",
          value: 2
        },
        {
          label: "Alta",
          value: 3
        },
        {
          label: "Urgente",
          value: 5
        }
      ],
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
        message: "Solicitação cadastrada com sucesso",
        color: "positive",
      },
      negativeProps: {
        type: "negative",
        caption: "Erro",
        message: "Erro inesperado. Verifique os campos e tente novamente",
        color: "negative",
      },
    };
  },

  async created() {
    if (this.isAdmin) {
      const { data } = await miscService.getEstablishments();
      this.establishments = data.map((e) => {
        return {
          label: e.name,
          value: e.establishmentId,
        };
      });
    } else {
      this.selectedEstablishment = this.sessionSelectedEstablishment;
    }
  },

  methods: {

    async getAmount() {
      this.currentAmount = 0;
      setTimeout(async () => {
        const { data } = await creditService.get(this.task.type, this.selectedEstablishment);
        this.currentAmount = data;
      }, 500)
    },

    async handleSubmit() {
      this.loading = true;

      const establishment = this.establishments.find(
        (e) => e.value == this.selectedEstablishment
      );

      const formData = new FormData();
      formData.append("identifier", this.identifier);
      formData.append("establishmentId", this.selectedEstablishment);
      formData.append("establishment", establishment.label);
      formData.append("priority", this.task.priority);
      formData.append("type", this.task.type);
      formData.append("title", this.task.title);
      formData.append("description", this.task.description);
      formData.append("additionalDescription", this.task.additionalDescription);

      const ref = this.task.reference;

      for (let i = 0; i < ref.length; i++) {
        formData.append("reference", ref[i]);
        formData.append("audioDescription", ref[i]);
      }

      const { status } = await taskService.save(formData);
      if (status && status == 200) {
        this.$q.notify(this.positiveProps);
      } else {
        this.$q.notify(this.negativeProps);
      }
      this.loading = false;
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
      if (
        !this.task.type ||
        !this.task.description ||
        !this.selectedEstablishment
      )
        return true;
      return false;
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
#popup-card-request {
  padding: 0;

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
