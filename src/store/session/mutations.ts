import { MutationTree } from 'vuex';
import { SessionState } from './state';

const mutation: MutationTree<SessionState> = {
  saveSessionInfo( state: SessionState, payload: SessionState ) {

    state.name = payload.name;
    state.token = payload.token;
    state.roles = payload.roles;
  }
};

export default mutation;
