<template>
  <q-page class="row items-center justify-evenly">
    <TaskTable v-if="selectedEstablishment || isAdmin" :type="'feed_story'"/>
    <p v-else>Selecione um estabelecimento</p>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from "vuex";
import TaskTable from 'components/TaskTable.vue';

export default defineComponent({
  name: 'PageIndex',
  components: { TaskTable },
  data() {

  },

  computed: {
    ...mapGetters('session', ['selectedEstablishment', 'isAdmin']),
  }
});
</script>
