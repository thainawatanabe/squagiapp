import { MutationTree } from 'vuex';
import { SessionState } from './state';

const mutation: MutationTree<SessionState> = {
  saveSessionInfo( state: SessionState, payload ) {

    const user = {
      name: payload.name,
      id: payload.id.toString(),
      roles: payload.roles
    }
    state.token = payload.token;
    state.user = user;
  }
};

export default mutation;
