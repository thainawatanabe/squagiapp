<template>
  <q-page class="row justify-center items-center">
    <div class="col-sm-5 col-xs-12 text-center logo-div">
      <q-img src="../statics/images/squagi.png" class="logo"/>
      <h5>Está difícil administrar vários perfis nas redes sociais? <br />A gente te ajuda!</h5>
    </div>

    <div class="col-sm-5 col-xs-12 text-center">
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
  text-align: left;
  margin-left: 30px;
  font-family: 'Montserrat-Bold';
}
.logo-div {
  margin:auto auto;
}
#version {
  position: fixed;
  bottom: 0;
  right: 5px;
}
</style>
