import { MutationTree } from 'vuex';
import state, { SessionState } from './state';

const mutation: MutationTree<SessionState> = {
  saveSessionInfo( state: SessionState, payload ) {

    const user = {
      name: payload.name,
      id: payload.id.toString(),
      roles: payload.roles,
      establishments: []
    }
    state.token = payload.token;
    state.user = user;
  },

  updateWorkplaces( state: SessionState, payload ) {
    state.user.establishments?.push(payload);
  }
};

export default mutation;
