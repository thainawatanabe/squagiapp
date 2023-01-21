<template>
  <q-card id="popup-card" class="row">
    <div class="col-sm-8 col-xs-12" style="max-height: 80vh">
      <q-carousel
        animated
        v-model="slide"
        arrows
        navigation
        transition-prev="scale"
        transition-next="scale"
        swipeable
        control-color="black"
        height="100%"
      >
        <q-carousel-slide v-for="(file, i) in getImg(task)" :key="i" :name="i">
          <q-img
            class="align-self-center q-my-auto"
            height="100%"
            fit="contain"
            :src="`https://s3.sa-east-1.amazonaws.com/reference.squagi.com.br/${file}`"
          />
        </q-carousel-slide>
      </q-carousel>
    </div>

    <div class="col-sm-4 col-xs-12 description text-left">
      <div class="row justify-between" style="flex-direction: column">
        <div class="col-12">
          <div class="flex">
            <div id="title" class="q-mb-md">{{ title }}</div>
            <q-btn
              v-if="!isAdmin"
              class="absolute"
              style="top: 10px; right: 15px"
              flat
              round
              icon="close"
              v-close-popup
            />
            <q-btn
              class="col-6 absolute"
              color="primary"
              style="top: 15px; right: 15px"
              dense
              v-else
              flat
              icon="more_vert"
              no-caps
            >
              <q-menu auto-close max-width="340px">
                <div v-for="(option, i) in menuOptions" :key="i">
                  <q-item
                    v-if="
                      verifyStatus(option.value, task.status) && option.show
                    "
                    clickable
                    style="text-align: center; padding: 15px"
                    @click="
                      option.value == 'share' ||
                      option.value == 'delete' ||
                      option.value == 'designate'
                        ? $emit('handleMethod', task, option.value)
                        : setAction(option.value)
                    "
                  >
                    <q-item-section class="text-center">
                      <q-item-label :lines="3">
                        <span>{{ option.label }}</span>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
              </q-menu>
            </q-btn>
          </div>

          <q-separator />
          <q-expansion-item
            v-for="(section, i) in sections"
            v-model="sections[i].expanded"
            :key="i"
            :label="section.label"
            expand-icon-class="icon"
            active-class="is-active"
            @show="handleOpenTab(i)"
            @hide="sections[i].expanded = false"
            :header-class="sections[i].expanded ? 'active-expansion' : ''"
          >
            <q-separator />
            <q-scroll-area style="height: 350px">
              <div v-for="(info, j) in section.info" :key="j" class="q-pa-sm">
                <p
                  v-if="info.label != 'undefined' && info.value != 'undefined'"
                >
                  <span class="is-bold">{{ info.label }} </span
                  ><span v-html="info.value" />
                </p>
              </div>
            </q-scroll-area>
          </q-expansion-item>

          <div class="row justify-between" v-if="task.status == 'APPROVED'">
            <q-btn
              no-caps
              flat
              rounded
              @click="downloadAllFiles()"
              class="theme-button col-12"
              label="Baixar arquivo final"
            />
          </div>

          <div class="row" v-if="task.status == 'ACCEPTED'">
            <div class="col-12 q-my-sm">
              Enviar arquivo para cliente analisar
            </div>
            <q-file
              dense
              outlined
              class="q-mr-md q-my-sm col-12"
              accept=".jpg, .png"
              multiple
              max-files="3"
              max-file-size="167108864"
              v-if="isEmployee"
              v-model="finalArt"
              :disable="disable"
              label="Arte final"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </div>

          <div class="row" v-if="edit">
            <q-select
              dense
              class="col-12 q-my-sm"
              outlined
              color="primary"
              behavior="menu"
              label="Prioridade"
              v-model="status"
              :options="statusOptions"
              map-options
              emit-value
            />
          </div>

          <!--<div
            class="row justify-between"
            v-if="task.status == 'PENDING' && this.isEmployee"
          >
            <q-btn
              no-caps
              flat
              rounded
              @click="startTask()"
              class="theme-button col-12"
              label="Começar"
            />
          </div>-->
        </div>

        <div class="row justify-between" v-if="isAdmin && disapprove">
          <div class="col-12 q-mb-md">
            <textarea
              style="width: 100%"
              placeholder="Motivo da reprovação"
              v-model="disapprovalMotive"
            />
          </div>
          <q-btn
            no-caps
            flat
            rounded
            :loading="loading"
            @click="
              loading = true;
              $emit('rejectTask', { ...task, disapprovalMotive });
            "
            :disable="loading || !disapprovalMotive"
            class="positive-button col-12"
            label="Reprovar"
          />
        </div>

        <q-btn
          no-caps
          flat
          :loading="loading"
          :disable="loading || !employee"
          rounded
          v-if="designate"
          @click="
            loading = true;
            $emit('startTask', { ...task, employee });
          "
          class="theme-button col-12"
          label="Designar"
        />

        <q-btn
          no-caps
          flat
          :loading="loading"
          :disable="loading"
          rounded
          v-if="approve"
          @click="
            loading = true;
            $emit('approveTask', task);
          "
          class="theme-button col-12"
          label="Aprovar"
        />

        <q-btn
          no-caps
          flat
          :loading="loading"
          :disable="loading || !status"
          rounded
          v-if="edit"
          @click="
            loading = true;
            $emit('editTask', task, status);
          "
          class="theme-button col-12"
          label="Editar status"
        />

        <q-btn
          no-caps
          flat
          :loading="loading"
          :disable="loading"
          rounded
          v-if="
            (task.status == 'PENDING' || task.status == 'REJECTED') &&
            isEmployee
          "
          @click="
            loading = true;
            $emit('startTask', task);
          "
          class="theme-button col-12"
          :label="task.status == 'REJECTED' ? 'Corrigir' : 'Começar'"
        />

        <q-btn
          no-caps
          flat
          rounded
          v-if="task.status == 'ACCEPTED' && isEmployee"
          :loading="loading"
          :disable="!finalArt || !finalArt[0] || loading"
          class="theme-button col-12"
          :label="'Finalizar'"
          @click="
            loading = true;
            $emit('finishTask', { ...task, finalArt });
          "
        />
      </div>
    </div>
    <q-inner-loading :showing="loading">
      <q-spinner-oval size="50px" />
    </q-inner-loading>
  </q-card>
</template>
<script>
import helpers from "src/utils/helpers";
import { mapGetters } from "vuex";
import taskService from "src/services/TaskService";
export default {
  props: ["task", "menuOptions"],
  mixins: [helpers],
  data() {
    return {
      slide: 0,
      finalArt: [],
      expanded: false,
      loading: false,
      sections: [],
      designate: false,
      approve: false,
      employee: "",
      employees: [],
      action: "",
      disapprovalMotive: "",
      disapprove: false,
      status: "",
      statusOptions: [
        {
          label: "Baixa",
          value: 1,
        },
        {
          label: "Normal",
          value: 2,
        },
        {
          label: "Alta",
          value: 3,
        },
        {
          label: "Urgente",
          value: 5,
        },
      ],
      edit: false,
    };
  },

  computed: {
    ...mapGetters("session", ["username", "isEmployee", "isAdmin"]),
    title() {
      switch (this.task.status) {
        case "WAITING_APPROVAL":
          return "ANALISAR";
        case "APPROVED":
          return "CONCLUÍDO";
        case "REJECTED":
          return "REPROVADO";
        case "ACCEPTED":
          return "DESENVOLVENDO";
        default:
          return "AGUARDANDO";
      }
    },
  },

  async created() {
    const action = this.task.adminAction ?? this.action;
    this.setAction(action);

    if (this.isAdmin) {
      this.sections = [
        {
          label: "DESCRIÇÃO",
          expanded: true,
          info: [
            {
              label: "ID: ",
              value: this.task.identifier,
            },
            {
              label: "SOLICITADO EM: ",
              value: this.formatDate(this.task.createdAt),
            },
            {
              label: "PRAZO DE ENTREGA: ",
              value: this.formatDate(this.task.deadline),
            },
            {
              label: "PRIORIDADE: ",
              value: this.$t(`MAIN_TABLE.${this.task.priority}`),
            },
            {
              label: "TIPO: ",
              value: this.$t(`MAIN_TABLE.${this.task.type}`),
            },
            {
              label: "DESCRIÇÃO: ",
              value: this.task.description,
            },
            {
              label: "DESCRIÇÃO FEED: ",
              value: this.task.additionalDescription,
            },
            {
              label: "DESIGNER: ",
              value: this.task.designerName + " (" + this.task.designer + ")",
            },
            {
              label: "DESIGNER INICIOU: ",
              value: this.formatDateHour(this.task.acceptedAt),
            },
            {
              label: "DESIGNER CONCLUIU: ",
              value: this.formatDateHour(this.task.deliveredAt),
            },
            {
              label: "CONCLUÍDO: ",
              value: this.formatDateHour(this.task.finishedAt),
            },
            {
              label: "",
              value: `${
                this.task.status == "REJECTED"
                  ? this.getDisapprovalText(this.task)
                  : null
              }`,
            },
          ],
        },
        {
          label: "INFORMAÇÕES BÁSICAS",
          expanded: false,
          info: [],
        },
        {
          label: "CORES DA EMPRESA",
          expanded: false,
          info: [],
        },
        {
          label: "LOGO",
          expanded: false,
          info: [],
        },
      ];

      return;
    }

    this.sections = [
      {
        label: "DESCRIÇÃO",
        expanded: true,
        info: [
          {
            label: "ID: ",
            value: this.task.identifier,
          },
          {
            label: "EMPRESA: ",
            value: this.formatDate(this.task.establishment),
          },
          {
            label: "SOLICITADO EM: ",
            value: this.formatDate(this.task.createdAt),
          },
          {
            label: "PRAZO DE ENTREGA: ",
            value: this.formatDate(this.task.deadline),
          },
          {
            label: "PRIORIDADE: ",
            value: this.$t(`MAIN_TABLE.${this.task.priority}`),
          },
          {
            label: "TIPO: ",
            value: this.$t(`MAIN_TABLE.${this.task.type}`),
          },
          {
            label: "DESCRIÇÃO: ",
            value: this.task.description,
          },
          {
            label: "DESCRIÇÃO FEED: ",
            value: this.task.additionalDescription,
          },
          {
            label: "",
            value: `${
              this.task.status == "REJECTED"
                ? this.getDisapprovalText(this.task)
                : null
            }`,
          },
        ],
      },
      {
        label: "INFORMAÇÕES BÁSICAS",
        expanded: false,
        info: [],
      },
      {
        label: "CORES DA EMPRESA",
        expanded: false,
        info: [],
      },
      {
        label: "LOGO",
        expanded: false,
        info: [],
      },
    ];
  },

  methods: {
    verifyStatus(option, status) {
      if (option == "disapprove" || option == "approve" || option == "share") {
        return status == "WAITING_APPROVAL";
      }
      if (option == "designate") {
        return (
          status == "PENDING" || status == "REJECTED" || status == "ACCEPTED"
        );
      }
      return true;
    },

    downloadAllFiles() {
      this.task.finalArt.map((art) => {
        this.download(
          `https://s3.sa-east-1.amazonaws.com/reference.squagi.com.br/${art}`
        );
      });
    },

    downloadAllFiles() {
      this.task.finalArt.map((art) => {
        this.download(
          `https://s3.sa-east-1.amazonaws.com/reference.squagi.com.br/${art}`
        );
      });
    },

    downloadAllFiles() {
      this.task.finalArt.map((art) => {
        this.downloadImage(
          `https://s3.sa-east-1.amazonaws.com/reference.squagi.com.br/${art}`,
          art
        );
      });
    },

    downloadImage(url, title) {
      const FileSaver = require('file-saver');
      FileSaver.saveAs(url, title);
    },

    async setAction(action) {
      if (!action) return;
      this.loading = true;
      this.approve = false;
      this.disapprove = false;
      this.edit = false;
      if (action == "close") {
        this.$emit("close");
      }
      if (action == "approve") {
        this.approve = true;
      } else if (action == "disapprove") {
        this.disapprove = true;
      } else if (action == "edit") {
        this.edit = true;
      }
      this.loading = false;
    },

    getDisapprovalText(task) {
      if (!task.solicitationHistory[0]) return "";
      const reprovalObj = this.task.solicitationHistory.find(
        (s) => s.disapprovalMotive && s.disapprovedAt
      );

      if (!reprovalObj) return "";

      return `<span class='q-my-sm' style='font-family: Muli-Bold'>${
        reprovalObj.disapprovalResponsible
      } </span>${reprovalObj.disapprovalMotive} - Data: ${this.formatDateHour(
        reprovalObj.disapprovedAt
      )}`;
    },

    handleOpenTab(i) {
      this.sections[i].expanded = true;
      this.sections.map((s, j) => {
        if (j != i) {
          this.sections[j].expanded = false;
        }
      });
    },

    getImg(task) {
      const status = task.status;
      if (status == "PENDING" || status == "ACCEPTED") return task.reference;
      return task.finalArt;
    },
  },
};
</script>

<style lang="scss">
#popup-card {
  min-width: 80%;
  min-height: 80%;
  padding: 0;
  max-height: 100%;

  p {
    margin-bottom: 0;
  }

  @media (max-width: $breakpoint-xs-max) {
    min-width: 100%;
    min-height: 0;
  }

  .description {
    .is-bold {
      font-family: "Muli-Bold";
    }
    padding: 15px 10px;
    border-left: 0.1rem solid #92929259;
    @media (max-width: $breakpoint-xs-max) {
      border-left: none;
    }
  }

  .is-active {
    background: $primary;
    color: #fff;
  }
}
.active-expansion {
  background: linear-gradient(
    90deg,
    rgba(255, 188, 0, 0.4) 0%,
    rgba(255, 188, 0, 0.6) 50%,
    rgba(255, 188, 0, 0.8) 100%
  );
}
</style>
