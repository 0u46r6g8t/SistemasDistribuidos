import { IContacts, IGroups, IKeysContact } from './IListsComplete';

export interface IUser {
  name: string;
  password: string;
  email: string;
  listContacts?: IContacts[];
  listGroups?: IGroups[];
  listKeysContact?: IKeysContact[];
}

export interface IUserBanco extends IUser {
  id: string;
}
