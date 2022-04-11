import axios from "axios";
import { Notify } from "quasar";

export default {

  async auth(authData) {

    const config = {
      headers: {
        token: "123"
      }
    }

    try {
      const { data, status } = await axios.post(
        `auth/v1/-/`,
        authData,
        config
      );
      if (!data) return null;
      return data;
    } catch (error) {
      return null;
    }
  },

  notify(status) {
    Notify.create({
      progress: true,
      group: true,
      type: "negative",
      caption: "erro " + status + " no servidor",
      textColor: "white",
      message:
        `${status == 401 ? 'Credenciais inválidas. Verifique os campos e tente novamente' : 'Erro interno do servidor.'}`,
      color: "negative",
      position: "bottom-left",
      multiLine: false,
      timeout: 2000,
      closeBtn: true
    });
  }
}
