import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { SessionState } from './state';

const getters: GetterTree<SessionState, StateInterface> = {
  loggedIn (context) {
    return context.token && context.token.length > 0;
  },

  isManager(context): boolean | undefined {

    const establishments = context.user.establishments ?? [];
    const establishment = establishments.find((e) => e.value === context.user.selectedEstablishment);
    return establishment && (establishment.role === 'MANAGER' || establishment.role == 'ADMIN');
  },

  isAdmin(context): boolean | null {

    return context.user.roles && context.user.roles.length == 1 && context.user.roles.includes("ADMIN");
  },

  isEmployee(context): boolean | null {

    return context.user.roles && context.user.roles.length == 1 && context.user.roles.includes("EMPLOYEE");
  },

  selectedEstablishment(context): string {

    return context.user.selectedEstablishment;
  },

  username(context): string {

    return context.user.email;
  }
};

export default getters;
