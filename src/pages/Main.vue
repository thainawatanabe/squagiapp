<template>
  <q-page :class="`row justify-center ${$q.screen.xs ? 'items-start' : 'items-center'}`">
    <div :class="`col-sm-6 col-xs-12 ${$q.screen.xs ? 'text-center' : 'text-left'} logo-div`">
      <q-img src="../statics/images/squagi.png" :class="`${$q.screen.xs ? '' : 'q-ml-xl'} logo`"/>
      <h5 class="gt-xs q-ml-xl q-mt-xs">Cresça tão rápido quanto o carregamento dessa página 🚀 e conte com os melhores serviços para isso acontecer.<br />A gente te ajuda!</h5>
    </div>

    <div class="col-sm-6 col-xs-12 text-center" >
      <SignUpComponent />
    </div>

    <p id="version">{{ 'Versão: ' + version }}</p>
  </q-page>
</template>

<script lang="ts">
import SignUpComponent from "components/SignUpComponent.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "PageIndex",
  components: { SignUpComponent },
  data() {
    const type: string = 'login';
    return { type };
  },

  computed: {
    version() {
      return process.env.APP_VERSION;
    }
  }
});
</script>
<style lang="scss">
.logo {
  max-width: 350px;
}
h5 {
  font-size: 1.3rem;
  text-align: left;
  font-family: 'Montserrat-Bold';
}
.logo-div {
  margin:auto auto;
  @media (max-width: $breakpoint-xs-max) {
    margin: 0 auto;
    align-self: self-end;
  }
}
#version {
  position: fixed;
  bottom: 0;
  right: 5px;
}
</style>
