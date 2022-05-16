import axios from "axios";
import { Notify } from "quasar";
import store from "../store";

export default {

  async save(task) {
    const config = {
      headers: {
        token: store().state.session.token
      },
    };

    try {
      const { data, status } = await axios.post(`tasks/v1/-/`, task, config);
      return { data, status };
    } catch (error) {
      return { data: null, status: error.status };
    }
  },

  async getTasks(establishmentId) {
    const config = {
      headers: {
        token: store().state.session.token
      },
    };

    try {
      const { data, status } = await axios.get(`tasks/v1/-/?establishmentId=${establishmentId}`, config);
      return { data, status };
    } catch (error) {
      return { data: null, status: error.status };
    }
  },

  async startTask(identifier, username) {
    const config = {
      headers: {
        token: store().state.session.token
      },
    };

    try {
      const { data, status } = await axios.put(`tasks/v1/-/start?identifier=${identifier}&username=${username}`, null, config);
      return { data, status };
    } catch (error) {
      return { data: null, status: error.status };
    }
  },

  async finishTask(payload) {
    const config = {
      headers: {
        token: store().state.session.token
      },
    };

    try {
      const { data, status } = await axios.put(`tasks/v1/-/finish`, payload, config);
      return { data, status };
    } catch (error) {
      return { data: null, status: error.status };
    }
  },

  async approveTask(identifier) {
    const config = {
      headers: {
        token: store().state.session.token
      },
    };

    try {
      const { data, status } = await axios.put(`tasks/v1/-/approve?identifier=${identifier}`, null, config);
      return { data, status };
    } catch (error) {
      return { data: null, status: error.status };
    }
  },

  async rejectTask(identifier) {
    const config = {
      headers: {
        token: store().state.session.token
      },
    };

    try {
      const { data, status } = await axios.put(`tasks/v1/-/reject?identifier=${identifier}`, null, config);
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
