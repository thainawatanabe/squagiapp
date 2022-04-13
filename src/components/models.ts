export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface ISignUp {
  name: string,
  email: string,
  password: string,
  phone: string
}

export interface IPasswordRequest {
  token: string | null,
  password: string
}

export interface IUserSignUp {
  name: string,
  email: string,
  password: string,
  phone: string,
  roles: Array<string>
}
