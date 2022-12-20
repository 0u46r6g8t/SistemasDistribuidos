export interface IContacts {
  name: string;
  address: string;
  photo: string;
  userEmail?: string
}

export interface IGroups {
  name: string;
  description: string;
  listUsers: string[];
  address: string;
}

export interface IKeysContact {
  key: string;
  to: string;
}