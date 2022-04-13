export interface SessionState {
  token: string;
  user: {
    name: string;
    id: string;
    roles: Array<string> | null;
  };
}

function state(): SessionState {
  return {
    token: "",
    user: {
      name: "",
      id: "",
      roles: [],
    },
  };
}

export default state;
