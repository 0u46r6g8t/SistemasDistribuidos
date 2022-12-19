import { IContacts, IGroups } from "./IListsComplete";

export interface IUser {
  name: string;
  password: string;
  email: string;
  listContacts?: IContacts[];
  listGroups?: IGroups[];
}

export interface IUserBanco extends IUser {
  id: string;
}
