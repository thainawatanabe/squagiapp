import { MutationTree } from "vuex";
import state, { SessionState } from "./state";

const mutation: MutationTree<SessionState> = {
  saveSessionInfo(state: SessionState, payload) {
    const user = {
      name: payload.name,
      id: payload.id.toString(),
      roles: payload.roles,
      establishments: payload.establishments.map(
        (e: Record<string, string>) => {
          return {
            label: e.name,
            value: e.establishmentId,
            role: e.role,
          };
        }
      ),
    };
    state.token = payload.token;
    state.user = user;
  },

  updateWorkplaces(state: SessionState, payload) {
    state.user.establishments?.push(payload);
  },
};

export default mutation;
