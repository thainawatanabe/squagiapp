<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
});
</script>

<style lang="scss">
* {
  font-family: 'Muli-SemiBold';
  font-size: 14px;
  color: #363636;
}
.q-card {
  max-width: 450px;
  min-width: 350px;
  background-color: #fff;
  text-align: center;
  border-radius: 15px;
  box-shadow: 0px 5px 10px #92929259;
  padding: 20px;
}

.q-layout {
  background-color: #f1f1f1;
}

.theme-button {
  background: $primary;
  color:#363636;
}

.text-warning {
  color: #c34241 !important;
  font-size: 11px;
}
</style>
