import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { SessionState } from './state';

const actions: ActionTree<SessionState, StateInterface> = {
  saveSessionInfo(context, payload) {
    context.commit('saveSessionInfo', payload);
  }
};

export default actions;
