export interface IContacts {
  name: string;
  photo: string;
  userEmail?: string;
}

export interface IGroups {
  name: string;
  description: string;
  listUsers: string[];
}

export interface IKeysContact {
  key: string;
  to: string;
}
