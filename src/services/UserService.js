import axios from "axios";
import { Notify } from "quasar";
import store from "../store";

export default {
  async create(user) {
    const config = {
      headers: {
        token: store().state.session.token,
      },
    };

    try {
      const { data } = await axios.post(`users/v1/-/`, user, config);
      return data;
    } catch (error) {
      console.log("error :>> ", error.status);
    }
  },

  async newUser(user) {
    const config = {
      headers: {
        token: store().state.session.token,
      },
    };

    try {
      const { data } = await axios.post(`users/v1/-/save-user`, user, config);
      return data;
    } catch (error) {
      console.log("error :>> ", error.status);
    }
  },

  async newEstablishment(update) {
    const config = {
      headers: {
        token: store().state.session.token,
      },
    };

    try {
      const { data } = await axios.put(`users/v1/-/save-user-establishment`, update, config);
      return data;
    } catch (error) {
      console.log("error :>> ", error.status);
    }
  },

  async requestNewPassword(username) {
    const config = {
      headers: {
        token: store().state.session.token,
      },
    };

    try {
      const { data } = await axios.post(
        `users/v1/-/request-password?username=${username}`,
        null,
        config
      );
      return data;
    } catch (error) {
      console.log("error :>> ", error.status);
    }
  },

  async resetPassword(passwordRequest) {
    const config = {
      headers: {
        token: store().state.session.token,
      },
    };

    try {
      const { data } = await axios.put(
        `users/v1/-/reset-password?token=${passwordRequest.token}&password=${passwordRequest.password}`,
        null,
        config
      );
      return data;
    } catch (error) {
      console.log("error :>> ", error.status);
    }
  },

  notify(status) {
    Notify.create({
      progress: true,
      group: true,
      type: "negative",
      caption: "erro " + status + " no servidor",
      textColor: "white",
      message: `${
        status == 401
          ? "Credenciais inválidas. Verifique os campos e tente novamente"
          : "Erro interno do servidor."
      }`,
      color: "negative",
      position: "bottom-left",
      multiLine: false,
      timeout: 2000,
      closeBtn: true,
    });
  },
};
