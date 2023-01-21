<template>
  <q-card id="popup-card-user" class="row">
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
        <div id="title" class="q-mb-md col-12">
          <p id="title">{{ title }}</p>
          <q-btn
            class="absolute"
            style="top: 10px; right: 15px"
            flat
            round
            v-if="!token"
            icon="close"
            v-close-popup
          />
          <q-separator class="q-my-sm" />
          <q-scroll-area style="height: 400px">
            <p v-if="task.description" v-html="task.description" />

            <div v-if="task.status == 'REJECTED'">
              <p v-html="getDisapprovalText(task)"></p>
            </div>
          </q-scroll-area>
        </div>

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

        <div
          class="row justify-between"
          v-if="task.status == 'WAITING_APPROVAL'"
        >
          <div v-if="disapproval" class="col-12 q-mb-md">
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
            v-if="!disapproval"
            :loading="loading"
            :disable="loading"
            @click="disapproval = true"
            class="negative-button col-5 q-mr-sm"
            label="Reprovar"
          />
          <q-btn
            no-caps
            flat
            rounded
            v-if="!disapproval"
            @click="
              loading = true;
              $emit('approveTask', task);
            "
            :loading="loading"
            :disable="loading"
            class="positive-button col-5"
            label="Aprovar"
          />
          <q-btn
            v-if="disapproval"
            no-caps
            flat
            rounded
            @click="disapproval = false"
            class="theme-button col-5 q-mr-sm"
            label="Cancelar"
          />
          <q-btn
            v-if="disapproval"
            no-caps
            flat
            rounded
            :loading="loading"
            @click="
              loading = true;
              $emit('rejectTask', { ...task, disapprovalMotive });
            "
            :disable="loading || !disapprovalMotive"
            class="positive-button col-5 q-mr-sm"
            label="Reprovar"
          />
        </div>
      </div>
    </div>
  </q-card>
</template>
<script>
import helpers from "src/utils/helpers";
import { mapGetters } from "vuex";
export default {
  props: ["task", "token"],
  mixins: [helpers],
  data() {
    return {
      disapproval: false,
      disapprovalMotive: "",
      slide: 0,
    };
  },
  methods: {
    getDisapprovalText(task) {
      const lastIndex = task.solicitationHistory.length - 1;
      const h = this.task.solicitationHistory[lastIndex];
      return `<span class='q-my-sm' style='font-family: Muli-Bold'>${
        h.disapprovalResponsible
      } </span>${h.disapprovalMotive} - Data: ${this.formatDateHour(
        h.disapprovedAt
      )}`;
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
};
</script>

<style lang="scss">
#popup-card-user {
  min-width: 80%;
  min-height: 80%;
  padding: 0;

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
