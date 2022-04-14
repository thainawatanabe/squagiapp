<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",

  computed: {
    rootDocument() {
      return document.documentElement;
    },

    smallScreen() {
      return this.$q.screen.xs;
    },
  },

  created() {
    if (this.smallScreen) {
      this.setSmallDeviceStyle();
    }
  },

  methods: {
    setSmallDeviceStyle() {
      const rootDocument = document.documentElement;
      rootDocument.style.setProperty("--card-bg", "");
      rootDocument.style.setProperty("--card-shadow", "none");
    },
  },

  watch: {
    smallScreen() {
      if (this.smallScreen) {
        this.setSmallDeviceStyle();
      }
    },
  },
});
</script>

<style lang="scss">
* {
  font-family: "Muli-SemiBold";
  font-size: 14px;
  color: #363636;
}
:root {
  --card-bg: transparent;
  --card-shadow: 0px 5px 10px #92929259;
}
#title {
  font-size: 26px;
  text-align: left;
  font-family: "Montserrat-Bold";
}
.background-white {
  background-color: #fff;
}
.color-white {
  color: #fff;
}
.theme-dark {
  background-color: rgba(18, 19, 23, 1);
}
.theme-dark-sidebar {
  background-color: rgba(26, 28, 35, 1);
}
.q-field {
  background-color: #fff;
  border-radius: 7px;
}
.auto-margin {
  margin: auto auto;
}
.q-page {
  padding: 20px;
}
#input-section {
  .q-input {
    margin: auto auto 10px auto;
  }
  .q-select {
    margin: auto auto 10px auto;
  }
}
.q-card {
  max-width: 450px;
  background-color: var(--card-bg);
  text-align: center;
  border-radius: 15px;
  box-shadow: var(--card-shadow);
  padding: 20px;
  margin: auto auto;
}

.q-layout {
  background-color: $background_main;
  @media (max-width: $breakpoint-xs-max) {
    background-color: $background_main_small;
  }
}

.q-drawer {
  background-color: $background_lighter;
}

.q-header {
  background-color: $background_lighter;
}

.theme-button {
  background: $primary;
  color: #fff !important;
  border-radius: 5px;
  span {
    color: #fff !important;
  }
}

.signup-button {
  background: $positive;
  color: #fff !important;
  border-radius: 5px;
  span {
    color: #fff !important;
  }
}

.no-bottom {
  margin-bottom: 0;
}

.text-warning {
  color: #c34241 !important;
  font-size: 11px;
}
</style>
