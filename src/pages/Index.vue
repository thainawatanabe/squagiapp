<template>
  <q-page class="row items-center justify-evenly">
    <EmployeeDashboard v-if="isEmployee || selectedEstablishment" />
    <ExampleDashboard v-else />
  </q-page>
</template>

<script lang="ts">
import { Todo, Meta } from 'components/models';
import { defineComponent } from 'vue';
import { mapGetters } from "vuex";
import EmployeeDashboard from 'components/EmployeeDashboard.vue';
import ExampleDashboard from 'components/ExampleDashboard.vue';

export default defineComponent({
  name: 'PageIndex',
  components: { EmployeeDashboard, ExampleDashboard },
  data() {

  },

  computed: {
    ...mapGetters('session', ['isManager', 'isEmployee', 'selectedEstablishment']),
  }
});
</script>
