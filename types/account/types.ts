export interface IAccountType {
  username: string;
  create_time: string;
  phone: string;
  diary_no: string;
  permission: string;
}

export interface IAddAccount {
  user_name: string;
  password: string;
  name: string;
  level: number;
  phone: string;
}