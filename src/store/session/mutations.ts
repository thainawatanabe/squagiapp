import { MutationTree } from 'vuex';
import state, { SessionState } from './state';

const mutation: MutationTree<SessionState> = {
  saveSessionInfo( state: SessionState, payload ) {

    const user = {
      name: payload.name,
      id: payload.id.toString(),
      email: payload.email,
      roles: payload.roles,
      establishments: [],
      selectedEstablishment: ""
    }
    state.token = payload.token;
    state.user = user;
  },

  updateWorkplaces( state: SessionState, payload ) {
    state.user.establishments?.push(payload);
  },

  clearSession( state: SessionState ) {
    state.token = "";
    state.user = {
      name: "",
      id: "",
      email: "",
      roles: [],
      establishments: [],
      selectedEstablishment: ""
    };
  },

  onSelectEstablishment( state: SessionState, payload ) {
    state.user.selectedEstablishment = payload;
  }
};

export default mutation;
