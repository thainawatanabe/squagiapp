<template>
  <q-item
    v-if="show && !subMenu"
    clickable
    :to="url ? '' : link"
    @click="url ? openUrl() : ''"
    :active="link == $router.name"
    active-class="active-item"
  >
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
    expand-icon-class="icon"
    class="item-title"
    :to="link"
    :class="'/' + currentRoute.fullPath.split('/')[1] == link ? 'active-expansion' : ''"
    v-model="expanded"
    @click="expanded = !expanded"
  >
    <q-separator />
    <q-list v-for="(menu, i) in subMenu" :key="i">
      <q-item
        :active="currentRoute.fullPath == link + menu.link"
        active-class="submenu-class-active"
        :class="currentRoute.fullPath == link + menu.link ? '' : 'submenu-class-inactive'"
        clickable
        v-ripple
        @click="$router.push(link + menu.link)"
      >
        <q-item-section class="q-ml-xl">
          <q-item-label :class="currentRoute.fullPath == link + menu.link ? 'active-label' : ''">{{ menu.title }}</q-item-label>
          <q-item-label caption>
            {{ menu.caption }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-expansion-item>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Menu",
  data() {
    return {
      expanded: false
    }
  },
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

    url: {
      type: String,
      default: null,
    },
  },

  methods: {
    openUrl() {
      window.open(this.url, "_blank");
    },
  },

  computed: {
    currentRoute() {

      return this.$router.currentRoute.value;
    }
  },

  mounted() {
    if ('/' + this.currentRoute.fullPath.split('/')[1] == (this.link)) {
      this.expanded = true
    }
  }
});
</script>
<style lang="scss">
.active-item {
  background: linear-gradient(
    90deg,
    rgba(255, 188, 0, 0.4) 0%,
    rgba(255, 188, 0, 0.6) 50%,
    rgba(255, 188, 0, 0.8) 100%
  );
  // div {
  //   color: $primary_shadow;
  // }
}
.submenu-class-active {
  background: #fff;
  div {
    color: $primary_shadow;
  }
}
.submenu-class-inactive {
  background: #fff;
  .q-item__label {
    color: #363636 !important;
  }
}
.active-expansion {
  background: linear-gradient(
    90deg,
    rgba(255, 188, 0, 0.4) 0%,
    rgba(255, 188, 0, 0.6) 50%,
    rgba(255, 188, 0, 0.8) 100%
  );
  // .q-item__label {
  //   color: $primary_shadow_dark;
  // }
}
</style>
