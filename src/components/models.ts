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
  phone: string,
  roles: Array<string>,
  createdAt: number,
  establishments: Array<Record<string, string>>
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
  roles: Array<string>,
  establishments: Array<Record<string, string>>
}

export interface IWorkplace {
  document: string,
  name: string,
  email: string,
  phone: string,
  department: string,
  website: string,
  address: Address,
  createdAt: number,
  establishmentId: string
}

export interface Address {
  country: string,
  state: string,
  city: string
}
