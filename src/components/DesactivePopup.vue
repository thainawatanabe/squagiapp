<template>
  <q-dialog v-model="show">
    <q-card id="popup-card-users">
      <div class="row flex flex-center">
        <div class="col-12 text-center">
          <div class="q-pb-md flex">
            <p id="popup-title">Atenção</p>
            <q-btn
              class="absolute"
              style="top: 10px; right: 15px"
              flat
              round
              icon="close"
              @click="$emit('close')"
            />
          </div>
          <div>
            <p>Deseja realmente ativar/desativar ?</p>
          </div>
          <q-separator class="col-12"/>
        </div>

        <div class="col-xs-12" style="padding: 25px">

          <div class="col-12">
            <q-btn
              flat
              label="Sim"
              class="col-5 theme-button"
              @click="$emit('agree', item)"
            />

            <q-btn
              flat
              label="Não"
              class="col-5 q-ml-sm negative-button"
              @click="$emit('close')"
            />
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
import helpers from "src/utils/helpers";
import {mapGetters} from "vuex";

export default {
  mixins: [helpers],
  props: {
    identifier: {
      type: String,
      default: null,
    },
    item: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      show: true,
      loading: false,
    };
  },

  methods: {
    async handleSubmit() {
      this.$emit("desactive");
    },
  },

  computed: {
    ...mapGetters("session", ["username", "isEmployee", "isAdmin"]),
  },

  created() {

  }
};
</script>

<style lang="scss">
#popup-title {
  margin: auto auto;
  text-align: center;
}

#popup-card-users {
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
