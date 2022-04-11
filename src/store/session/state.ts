export interface SessionState {
  token: string,
  name: string,
  roles: Object | null
}

function state(): SessionState {
  return {
    token: '',
    name: '',
    roles: null
  }
};

export default state;
