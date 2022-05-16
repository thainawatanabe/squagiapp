import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { SessionState } from './state';

const actions: ActionTree<SessionState, StateInterface> = {
  saveSessionInfo(context, payload) {
    context.commit('saveSessionInfo', payload);
    if (payload.establishments && payload.establishments[0]) {
      payload.establishments.forEach((e: Record<string, string>) => {
        context.commit('updateWorkplaces', {
          label: e.name,
          value: e.establishmentId,
          role: e.role
        });
      });
    }
  },

  updateWorkplaces(context, payload) {
    context.commit('updateWorkplaces', payload);
  },

  clearSession(context) {
    context.commit('clearSession');
  },

  onSelectEstablishment(context, payload) {
    context.commit('onSelectEstablishment', payload);
  }
};

export default actions;
