import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { SessionState } from './state';

const getters: GetterTree<SessionState, StateInterface> = {
  loggedIn (context) {
    console.log('context :>> ', context);
    return context.token && context.token.length > 0;
  }
};

export default getters;
