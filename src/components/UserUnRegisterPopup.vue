<template>
  <q-dialog v-model="show">
    <q-card id="popup-card-users">
      <div class="row flex flex-center">
        <div class="col-12 text-center">
          <div class="q-pb-md flex">
            <p id="popup-title">
              Desvincular usuário
            </p>
            <q-btn
              class="absolute"
              style="top: 10px; right: 15px"
              flat
              round
              icon="close"
              @click="$emit('close')"
            />
          </div>
          <q-separator class="col-12"/>
        </div>

        <div class="col-xs-12 text-left" style="padding: 25px">
          <div>
            <q-select
              dense
              outlined
              color="primary"
              :rules="[(val) => !!val || 'Campo obrigatório']"
              hide-bottom-space
              v-model="userUpdate.user"
              :options="usersOption"
              use-input
              @update:model-value="filterEstablishments"
              @filter="filterUsers"
              option-label="name"
              model-value="name"
              name="name"
              label="Usuarios"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.name }}</q-item-label>
                    <q-item-label caption>ID: {{ scope.opt.identifier }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-select
              :disable="!userUpdate.user"
              dense
              outlined
              color="primary"
              behavior="menu"
              :rules="[(val) => !!val || 'Campo obrigatório']"
              lazy-rules
              hide-bottom-space
              v-if="role !== 'EMPLOYEE'"
              v-model="userUpdate.establishment"
              :options="establishmentOptions"
              fill-input
              hide-selected
              option-label="name"
              model-value="name"
              name="name"
              input-debounce="0"
              use-input
              label="Empresa"
            />
          </div>

          <p class="text-warning" v-if="error">
            {{ error }}
          </p>

          <div class="col-12">
            <q-btn
              :disable="loading || invalidFields"
              :loading="loading"
              flat
              style="width: 100%"
              label="Desvincular"
              class="col-12 theme-button"
              @click="handleSubmit()"
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
import UserService from "src/services/UserService";

export default {
  mixins: [helpers],
  props: {
    role: {
      type: String,
      default: null,
    },
    isNew: {
      type: String,
      default: false,
    },
    edit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: true,
      users: [],
      usersOption: [],
      userUpdate: {
        user: null,
        establishment: null,
      },
      establishmentOptions: [],
      positiveProps: {
        type: "positive",
        caption: "Sucesso",
        message: "Usuário cadastrado com sucesso",
        color: "positive",
      },
      negativeProps: {
        type: "negative",
        caption: "Erro",
        message: "Erro inesperado. Verifique os campos e tente novamente",
        color: "negative",
      },
      loading: false,

    };
  },

  methods: {
    async handleSubmit() {
      const payload = {
        identifier: this.userUpdate.user.identifier,
        establishmentId: this.userUpdate.establishment.establishmentId,
      };
      const response = await UserService.removeUserEstablishment(payload);
      this.positiveProps.message =
        "Usuário desvinculado à empresa com sucesso.";

      if (!response) {
        this.$q.notify(this.negativeProps);
      } else {
        this.$q.notify(this.positiveProps);
      }
      this.loading = false;
      this.$emit("close");
    },
    async getUsers() {
      this.users = [];
      this.loading = true;

      const {data, status} = await UserService.getUsers(
        "",
        500,
        1,
        "USER",
        this.selectedEstablishment
      );
      if (status == 200) {
        this.users = data.users.filter(value => value.establishments.length > 0);
        this.usersOption = data.users.filter(value => value.establishments.length > 0);
      }
      this.loading = false;
    },
    filterUsers(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        this.usersOption = this.users.filter(
          (v) => v.identifier.toLowerCase().indexOf(needle) > -1 || v.name.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    filterEstablishments(update) {
      this.establishmentOptions = update.establishments
      this.userUpdate.establishment = null
    },
  },

  computed: {
    ...mapGetters("session", ["username", "isEmployee", "isAdmin"]),
    invalidFields() {
      if (!this.userUpdate.establishment || !this.userUpdate.user) {
        return true;
      }
      return false;
    },
  },
  mounted() {
    this.getUsers()
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
