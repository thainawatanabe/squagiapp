import axios from "axios";
import { Notify } from "quasar";
import store from "../store";

export default {
  async get(type, establishmentId) {
    const config = {
      headers: {
        token: store().state.session.token,
      },
    };

    try {
      const { data, status } = await axios.get(`credits/v1/-/?product=${type}&establishmentId=${establishmentId}`, config);
      return { data, status };
    } catch (error) {
      return { data: null, status: error.status };
    }
  },

  async add(body) {
    const config = {
      headers: {
        token: store().state.session.token,
      },
    };

    try {
      const { data, status } = await axios.put(`credits/v1/-/add-credits`, body, config);
      return { data, status };
    } catch (error) {
      return { data: null, status: error.status };
    }
  },

  async remove(body) {
    const config = {
      headers: {
        token: store().state.session.token,
      },
    };

    try {
      const { data, status } = await axios.put(`credits/v1/-/remove-credits`, body, config);
      return { data, status };
    } catch (error) {
      return { data: null, status: error.status };
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
