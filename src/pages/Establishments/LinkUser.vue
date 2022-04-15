<template>
  <q-page class="row items-center justify-evenly">
    <FeedbackComponent :type="'invitation'" />
  </q-page>
</template>

<script lang="ts">
import FeedbackComponent from 'src/components/FeedbackComponent.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageIndex',
  components: { FeedbackComponent },
  data() {

  }
});
</script>
