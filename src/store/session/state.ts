export interface SessionState {
  token: string;
  user: {
    name: string;
    id: string;
    email: string;
    roles: Array<string> | null;
    establishments: Array<Record<string, string>> | null,
    selectedEstablishment: string
  };
}

function state(): SessionState {
  return {
    token: "",
    user: {
      name: "",
      id: "",
      email: "",
      roles: [],
      establishments: [],
      selectedEstablishment: ""
    }
  };
}

export default state;
