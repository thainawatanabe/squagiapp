<template>
  <q-dialog
    persistent
    v-model="show"
  >
    <q-card
      style="width: 330px;border-radius:12px;padding:0"
      :style="styling"
    >
      <q-card-section
        class="card-title"
        :style="properties.titleStyle"
      >
        <img
          v-if="properties.img"
          :src="properties.img"
          :style="properties.style"
        >
        <span
          class="title"
          :style="properties.titleSpanStyle"
        >{{
          properties.title
        }}</span>
      </q-card-section>
      <q-separator v-if="properties.separator" />
      <q-card-section
        class="alert-section"
        :style="properties.sectionStyling"
      >
        <p
          v-if="properties.titleText"
          style="color: #034151; font-weight: 700; text-align: center; white-space: normal; margin-bottom: 0px;"
          class="alert"
        >
          {{ properties.titleText }}
        </p>
        <br v-if="properties.titleText && properties.text">
        <p
          v-if="properties.titleText && properties.text"
          style="text-align: center; white-space: normal; font-size: 14px;"
          class="alert"
        >
          {{ properties.text }}
        </p>
        <p
          style="text-align: left; white-space: normal; font-size: 14px;"
          class="alert"
          v-html="properties.html"
        ></p>
        <span
          v-if="!properties.titleText"
          class="alert"
        >{{
          properties.text
        }}</span>
        <span
          v-if="properties.grayText"
          style="color:#535353;margin-bottom:0;display:block"
          :style="properties.grayTextStyling"
        >
          {{ properties.grayText }}
        </span>
        <br v-if="properties.otherGrayText">
        <span
          v-if="properties.otherGrayText"
          style="color:#535353;margin-bottom:0"
          :style="properties.grayTextStyling"
        >
          {{ properties.otherGrayText }}
        </span>
      </q-card-section>
      <q-card-section
        class="modal-header"
        style="text-align: center"
      >
        <q-btn
          v-if="!properties.doubleButtons"
          unelevated
          label= "Entendi"
          @click="$emit('close')"
          :class="properties.blueBtn ? 'blue-btn' : 'action-button'"
          v-close-popup
          no-caps
        />
        <q-btn
          rounded
          unelevated
          v-if="properties.doubleButtons"
          :label="properties.firstLabel"
          @click="$emit('agree')"
          class="popup-btn"
          style="margin-right:10px"
          v-close-popup
          no-caps
        />
        <q-btn
          rounded
          unelevated
          v-if="properties.doubleButtons"
          :label="properties.secondLabel"
          @click="$emit('close')"
          style="margin-left:10px"
          class="action-button"
          v-close-popup
          no-caps
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  // eslint-disable-next-line
  props: ["properties"],
  data() {
    return {
      show: true
    };
  },
  computed: {
    styling() {
      if (this.properties.cardStyle) {
        return this.properties.cardStyle;
      } else {
        return {};
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
  color: #ffffff;
  font-size: 16px;
  font-family: "Muli-Bold";
  width: 100%;
  display: inline-block;
}
.msg {
  text-align: right;
  font-family: "Muli";
  font-size: 14px;
  margin: 5px 0 0;
}
.btn-div {
  text-align: right;
  font-weight: bolder;
}
.alert {
  text-align: center;
  font-size: 13px;
  font-family: "Muli";
}
.card-title {
  padding: 10px 8px !important;
  display: grid;
  grid-template-columns: 0.1fr 1fr;
  min-height: 50px;
  max-height: 60px;
}
.alert-section {
  padding: 0 40px;
  text-align: center;
  color: #151515;
  font-size: 13px;
}
.q-btn {
  font-weight: bold;
  font-size: 14px;
}
.popup-btn {
  background: none;
  color: $primary;
}
.blue-btn {
  color: #ffffff;
  background: $primary;
  padding: 3px 10px;
}
.popup-btn:hover {
  color: $primary;
}
.q-dialog__inner > div {
  overflow: inherit !important;
}
.action-button {
  padding: 0px 15px;
  background: $primary;
}
</style>
