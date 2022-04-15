export interface SessionState {
  token: string;
  user: {
    name: string;
    id: string;
    roles: Array<string> | null;
    establishments: Array<Record<string, string>> | null
  };
}

function state(): SessionState {
  return {
    token: "",
    user: {
      name: "",
      id: "",
      roles: [],
      establishments: []
    }
  };
}

export default state;
