import { defineComponent } from "vue";
import { copyToClipboard } from "quasar";

export default defineComponent({
  methods: {
    isValidEmail(val: string) {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || "E-mail inválido";
    },

    isValidPhone(phone: string) {
      const firstDigit = phone.charAt(2);
      const len = phone.length;
      return (firstDigit == "9" && len == 11) || "Telefone inválido";
    },

    isValidPassword(password: string) {
      const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
      return passwordPattern.test(password) || "Senha deve conter pelo menos 6 caracteres, contendo letras e números."
    },

    isValidName(name: string) {
      const normalizedName = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return !/[^a-zA-Z ]/i.test(normalizedName) || "Utilize apenas caracteres válidos"
    },

    copy(content: string) {
      copyToClipboard(content);
    },

    formatDateHour(timestamp: number) {
      const date = new Date(timestamp);
      const day = `${date.getDate()}`.padStart(2, "0");
      const month = `${date.getMonth() + 1}`.padStart(2, "0");
      const year = `${date.getFullYear()}`.padStart(2, "0");
      const stringDate = `${day}/${month}/${year}`;
      const timeDate = new Date(timestamp);
      const hours = "0" + timeDate.getHours();
      const minutes = "0" + timeDate.getMinutes();
      const formattedTime = hours.substr(-2) + "h" + minutes.substr(-2);
      const formattedDateTime = stringDate + " às " + formattedTime;
      return formattedDateTime;
    }
  }
});
