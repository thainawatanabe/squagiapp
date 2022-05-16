<template>
  <q-page class="items-left no-padding">
    <div class="row justify-content" :key="update">
      <div
        class="col-12 warning-div cursor-pointer"
        v-if="disable && isManager"
        @click="$router.push('financeiro')"
      >
        <p>Sem crédito. Adquira agora mesmo</p>
      </div>
      <div class="col-md-5 col-xs-12" style="padding: 20px" id="input-section">
        <p id="title">Nova solicitação</p>

        <q-card id="request-card">
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
            v-model="task.type"
            :disable="disable"
            :options="typeOptions"
            label="Tipo"
          />

          <q-input
            dense
            outlined
            maxlength="20"
            :rules="[(val) => !!val || 'Campo obrigatório']"
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
              v-if="
                task.type == 'feed' ||
                task.type == 'feed_story'
              "
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
              dense
              outlined
              accept=".jpg, .png"
              :name="identifier"
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
            :disable="loading || invalidFields || disable"
            :loading="loading"
            flat
            label="Solicitar"
            class="theme-button"
            @click="handleSubmit('update')"
          />
        </q-card>
        <!--<q-btn
          label="TESTE - Habilitar/desabilitar créditos"
          flat
          color="primary"
          outline
          @click="disable = !disable"
        />
        <q-btn
          label="TESTE - Preencher/deletar histórico"
          flat
          color="primary"
          outline
          @click="fillHistory()"
        />-->
      </div>
      <div class="col-xs-1" style="padding: 20px"></div>
      <div
        :class="`gt-sm col-md-5 col-xs-12 ${$q.screen.xs ? 'q-mt-md' : ''}`"
        id="input-section"
        style="padding: 20px"
      >
        <!--<p id="title">Histórico</p>
        <div v-if="!history[0]">
          <p>Nenhuma solicitação anterior</p>
        </div>

        <div v-else>
          <Table :data="history" :columns="columns" :pagination="pagination" />
        </div>-->
      </div>
    </div>
    <GenericPopup
      v-if="showPopup"
      @close="handlePopupClose()"
      :properties="popupProps"
    />
  </q-page>
</template>

<script lang="ts">
import taskService from "src/services/TaskService";
import { defineComponent } from "vue";
import GenericPopup from "../../components/GenericPopup.vue";
import helpers from "src/utils/helpers";
import Table from "src/components/Table.vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "PageIndex",
  mixins: [helpers],
  components: { GenericPopup, Table },
  data() {
    const establishments = this.$store.state.session.user.establishments ?? [];
    const signUp = {
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "",
      userEstablishment: {
        value: "",
        label: "",
      },
    };
    const disable: boolean = false;
    const identifier: string = new Date().getTime().toString();
    const task: any = {
      identifier: this.identifier,
      type: "",
      title: "",
      description: "",
      additionalDescription: "",
      audioDescription: "",
      reference: "",
    };
    const typeOptions: any = [
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
    ];
    const history: Array<Record<string, string | boolean>> = [];
    const update: boolean = true;
    const loading: boolean = false;
    const showPopup: boolean = false;
    const userUpdate: any = {};
    const popupProps: Record<string, string | boolean> = {};
    const positiveProps: Record<string, string | boolean> = {
      title: "Sucesso",
      titleStyle: "display: block; background-color: #ffffff",
      text: "Solicitação cadastrada com sucesso",
      sectionStyling: "padding-top: 20px;padding-bottom:15px",
      cardStyle: "max-width: 300px",
      titleSpanStyle: "color: #363636",
      separator: true,
    };
    const negativeProps: Record<string, string | boolean> = {
      title: "Erro",
      titleStyle: "display: block; background-color: #ffffff",
      text: "Erro inesperado. Verifique os campos e tente novamente",
      sectionStyling: "padding-top: 20px;padding-bottom:15px",
      cardStyle: "max-width: 300px",
      titleSpanStyle: "color: #363636",
      separator: true,
    };
    const columns: any = [
      {
        name: "date",
        required: true,
        label: "Data",
        align: "center",
        field: 'date'
      },
      {
        name: "type",
        required: true,
        label: "Tipo",
        align: "center",
        field: 'type'
      },
      {
        name: "title",
        required: true,
        label: "Título",
        align: "center",
        field: 'title'
      },
    ];
    const pagination: any = {
      rowsPerPage: 0,
    };
    return {
      signUp,
      userUpdate,
      showPopup,
      popupProps,
      establishments,
      loading,
      negativeProps,
      update,
      positiveProps,
      task,
      typeOptions,
      disable,
      history,
      columns,
      identifier
    };
  },

  computed: {
    ...mapGetters('session', ['isManager', 'selectedEstablishment']),
    invalidFields() {
      const signUp = this.signUp;

      if (!this.isValidEmail(signUp.email)) return true;
      if (!this.isValidPhone(signUp.phone)) return true;

      if (
        !this.task.type ||
        !this.task.title ||
        !this.task.description ||
        !this.task.reference
      )
        return true;
      return false;
    },
  },

  methods: {
    async handleSubmit() {
      this.loading = true;

      const formData = new FormData();
      formData.append("identifier", this.identifier);
      formData.append("establishmentId", this.selectedEstablishment);
      formData.append("type", this.task.type);
      formData.append("title", this.task.title);
      formData.append("description", this.task.description);
      formData.append("additionalDescription", this.task.additionalDescription);
      formData.append("audioDescription", this.task.reference);
      formData.append("reference", this.task.reference);

      const { status } = await taskService.save(formData);
      if (status && status == 200) {
        this.popupProps = this.positiveProps;
      } else {
        this.popupProps = this.negativeProps;
      }
      this.showPopup = true;
      this.loading = false;
    },

    handlePopupClose() {
      this.showPopup = false;
      this.$router.push("/home");
    },

    fillHistory() {
      const mockHistory = [
        {
          title: "Título 1",
          description: "Descrição 1",
          type: "FEED",
          date: "01/05/2022",
        },
        {
          title: "Título 2",
          description: "Descrição 2",
          type: "STORY",
          date: "15/04/2022",
        },
        {
          title: "Título 3",
          description: "Descrição 3",
          type: "FEED/STORY",
          date: "12/04/2022",
        },
      ];

      if (this.history[0]) {
        this.history = [];
      } else {
        this.history = mockHistory;
      }
    },
  }
});
</script>

<style lang="scss">
#request-card {
  border-radius: 4px;
  margin: 0;
}
#history-card {
  border-radius: 4px;
  margin-bottom: 15px;
}
.warning-div {
  display: inline;
  background: #c43421;
  text-align: center;
  min-height: 40px;
  cursor: pointer;
  p {
    color: #fff;
    margin: 6px auto auto auto;
  }
}
</style>
