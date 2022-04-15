<template>
  <q-item v-if="show && !subMenu" clickable :to="link">
    <q-item-section v-if="icon" avatar>
      <q-icon class="item-title" :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="item-title">{{ title }}</q-item-label>
      <q-item-label caption>
        {{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
  <q-expansion-item
    v-if="show && subMenu"
    :label="title"
    :icon="icon"
    style="color:#fff"
    expand-icon-class="icon"
    class="item-title"
  >
    <q-separator />
    <q-item v-for="(menu, i) in subMenu" :key="i">
      <q-item-section class="q-ml-xl">
        <q-item-label class="item-title">{{ menu.title }}</q-item-label>
        <q-item-label caption>
          {{ menu.caption }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-expansion-item>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Menu",
  props: {
    title: {
      type: String,
      default: "",
    },

    caption: {
      type: String,
      default: "",
    },

    link: {
      type: String,
      default: "#",
    },

    icon: {
      type: String,
      default: "",
    },

    show: {
      type: Boolean,
      default: false,
    },

    subMenu: {
      type: Array,
      default: null,
    },
  },

  created() {},
});
</script>
<style lang="scss">
.item-title {
  color: #fff !important;
}
.q-expansion-item {
  color: #fff;
}
</style>
