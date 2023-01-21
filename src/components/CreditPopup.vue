<template>
  <q-dialog v-model="show">
    <q-card id="popup-card-designer">
      <div class="row flex flex-center">
        <div
          id="title"
          class="col-12 text-center q-mb-sm"
          style="text-align: center !important; font-size: 22px"
        >
          Créditos
        </div>
        <div>
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
            <q-tabs
              v-model="tab"
              dense
              class="text-grey col-12"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator
            >
              <q-tab name="add" label="Adicionar" />
              <q-tab name="remove" label="Remover" />
            </q-tabs>
            <q-select
              dense
              class="col-12 q-mt-md"
              outlined
              color="primary"
              behavior="menu"
              @update:model-value="getAmount()"
              label="Estabelecimento"
              v-model="establishment"
              :options="establishments"
            />
            <q-select
              dense
              v-if="establishment.value"
              class="col-12 q-mt-md"
              outlined
              color="primary"
              behavior="menu"
              map-options
              emit-value
              @update:model-value="getAmount()"
              label="Produto"
              v-model="product"
              :options="products"
            />
            <p v-if="currentAmount">{{ "Quantidade: " + currentAmount }}</p>
            <q-input
              dense
              v-if="product"
              class="col-12 q-mt-md"
              outlined
              color="primary"
              type="tel"
              behavior="menu"
              label="Digite a quantidade"
              v-model="quantity"
            />

            <q-tab-panels v-model="tab" animated class="col-12">
              <q-tab-panel name="add" style="padding: 0; height: auto">
                <q-input
                  dense
                  v-if="product"
                  class="col-12 q-mt-md"
                  outlined
                  placeholder="R$0,00"
                  color="primary"
                  mask="###.##"
                  fill-mask="0"
                  reverse-fill-mask
                  behavior="menu"
                  label="Digite o valor"
                  v-model="price"
                />
                <q-input
                  label="Expira em"
                  class="q-mt-md col-12"
                  dense
                  outlined
                  v-model="date"
                  mask="##/##/####"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="qDateProxy"
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date v-model="date" mask="DD/MM/YYYY">
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <textarea
                  class="q-mt-md col-12 full-width"
                  placeholder="Descrição"
                  v-model="description"
                />
              </q-tab-panel>

              <q-tab-panel name="remove" style="padding: 0"> </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
        <q-btn
          flat
          :disable="
            !product ||
            !quantity ||
            !establishment ||
            (tab == 'remove' && quantity > currentAmount)
          "
          :label="tab == 'remove' ? 'Remover' : 'Adicionar'"
          class="col-5 theme-button"
          @click="tab == 'remove' ? removeCredits() : addCredits()"
        />
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
import { mapGetters } from "vuex";
import miscService from "src/services/MiscService";
import creditService from "src/services/CreditService";
export default {
  data() {
    return {
      show: true,
      establishment: "",
      establishments: [],
      currentAmount: 0,
      price: "",
      description: "",
      product: "",
      quantity: "",
      date: "",
      tab: "add",
      products: [
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
      positiveProps: {
        type: "positive",
        caption: "Sucesso",
        message: "Ação realizada com sucesso",
        color: "positive",
      },
      negativeProps: {
        type: "negative",
        caption: "Erro",
        message: "Erro inesperado. Tente novamente mais tarde",
        color: "negative",
      },
    };
  },

  methods: {
    replacePrice() {
      this.price = parseFloat(this.price);
    },

    async getAmount() {
      this.currentAmount = 0;
      setTimeout(async () => {
        const { data } = await creditService.get(this.product, this.establishment.value);
        this.currentAmount = data;
      }, 500)
    },

    async addCredits() {
      const body = {
        establishmentId: this.establishment.value,
        establishment: this.establishment.label,
        product: this.product,
        expirationDate: this.date,
        description: this.description,
        quantity: parseInt(this.quantity),
        price: parseFloat(this.price)
      }
      const { status } = await creditService.add(body);
      if (status == 200) {
        this.$q.notify(this.positiveProps);
      } else {
        this.$q.notify(this.negativeProps);
      }
      this.$emit("close");
    },

    async removeCredits() {
      const body = {
        establishmentId: this.establishment.value,
        establishment: this.establishment.label,
        product: this.product,
        quantity: parseInt(this.quantity)
      }
      const { status } = await creditService.remove(body);
      if (status == 200) {
        this.$q.notify(this.positiveProps);
      } else {
        this.$q.notify(this.negativeProps);
      }
      this.$emit("close");
    },
  },

  async created() {
    const { data } = await miscService.getEstablishments();
    this.establishments = data.map((e) => {
      return {
        label: e.name,
        value: e.establishmentId,
      };
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
