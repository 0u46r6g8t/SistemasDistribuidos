import { IUser, IUserBanco } from "../interface/IUser";
import { UsersData } from "../assets/data/user";
import { IHash } from "../Provider/interface/hash";
import { HashProvider } from "../Provider/hash";
import { IDataRegContact, IDataRegGroup } from "../interface/IData";

export default class ServiceUser {
  private readonly hashProvider: IHash;

  constructor() {
    this.hashProvider = new HashProvider();
  }

  public createUser = (data: IUser) => {
    if (this.findUserByEmail(data.email)) {
      return {
        error: "User already exists",
        status: 409,
        message: "",
      };
    }

    if (this.findUserByUsername(data.name)) {
      return {
        error: "User already exists",
        status: 409,
        message: "",
      };
    }

    const { password, ...user } = data;

    var passwordTemp = this.hashProvider.generate(password);
    console.log(data);
    UsersData.push({
      id: `${UsersData.length + 1}`,
      ...user,
      password: passwordTemp,
      listContacts: [],
      listGroups: []
    });

    return {
      status: 200,
      message: `Successfully user created`,
      error: "",
    };
  };

  public updateUser = (user: IUserBanco) => {
    const findUser = this.findUserByEmail(user.email);

    if (!findUser) {
      return {
        status: 404,
        error: `User not found`,
        message: "",
      };
    }

    const indexUser = UsersData.findIndex((item) => item.email === user.email);

    if (indexUser !== -1) {
      UsersData[indexUser] = user;
    }

    return {
      status: 200,
      message: UsersData[indexUser],
      error: "",
    };
  };

  public findUserById = (id: string) => {
    const data = UsersData.filter((user) => user.id === id)[0];

    if (!data) {
      throw new Error(`User with id ${id} not found`);
    }

    return data;
  };

  public findUserByEmail = (email: string) => {
    const data = UsersData.filter((user) => user.email === email)[0];

    return data;
  };

  public findUserByUsername = (name: string) => {
    const data = UsersData.filter((user) => user.name === name)[0];
    return data;
  };

  public insertContact = (data: IDataRegContact) => {
    const user = this.findUserByEmail(data.userAuth);
    const contact = user.listContacts?.filter(
      (item) => item.address === data.address
      )[0];
      if (contact) {
        return {
          status: 409,
        error: "Contact already exists in list",
        message: "",
      };
    }
    var { userEmail, ...contactNew } = data;
    user.listContacts?.push({...contactNew});
    
    return {
      status: 200,
      message: "Contact save your list",
      error: "",
    };
  };

  public insertGroup = (data: IDataRegGroup) => {
    const user = this.findUserByEmail(data.userEmail);

    const contact = user.listContacts?.filter(
      (item) => item.address === data.address
    )[0];
    if (contact) {
      return {
        status: 409,
        error: "Group already exists in list",
        message: "",
      };
    }
    var { userEmail, ...contactGroup } = data;

    user.listGroups?.push(contactGroup);

    return {
      status: 200,
      message: "Contact save your list",
      error: "",
    };
  };
}
