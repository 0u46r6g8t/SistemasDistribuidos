import { IMessage } from '../interface/IMessage';
import { IUser, IUserBanco } from '../interface/IUser';

import server from '../config/server';
import ServiceUser from '../services/user';
import {
  IDataAuth,
  IDataLogin,
  IDataRegContact,
  IDataRegister,
  IDataPrivate,
} from '../interface/IData';
import { HashProvider } from '../Provider/hash';
import { UsersData } from '../assets/data/user';

const dbMessage: Array<IMessage> = [];

const connection = server.ioConnection.on('connection', (socket) => {
  const serviceUser = new ServiceUser();

  socket.on('joinChatPrivate', (to: string) => {
    console.log('joinChatPrivate', to);
    console.log('joinChatPrivate:socketID: ', socket.id);

    socket.join(to);
  });

  socket.on('chatPrivate', ({ from, content, to }: IDataPrivate) => {
    console.log(from, content, to);
    socket.broadcast.emit('chatPrivate', {
      content,
      from,
    });
  });

  socket.on('getMessages', (data) => {
    socket.emit('getMessages', dbMessage);
  });

  socket.on('login', (data: IDataLogin) => {
    const userFound = serviceUser.findUserByEmail(data.email);
    if (!userFound) {
      socket.emit('login', {
        status: 404,
        error: 'User not Found',
        message: '',
      });
    } else {
      const hashProvider = new HashProvider();
      var userLogin = hashProvider.compare(
        data.password,
        userFound.password && userFound.password
      );

      if (!userLogin) {
        socket.emit('login', {
          status: 404,
          message: 'Credentials invalid, verify your parameters',
        });
      } else {
        // if userFound
        console.log('Successfully logged in');
        socket.emit('login', {
          status: 200,
          message: 'User logged',
          error: '',
        });
      }
    }
  });

  socket.on('registerContact', (data: IDataRegContact) => {
    if (!serviceUser.findUserByEmail(data.userAuth)) {
      socket.emit('registerContact', {
        status: 404,
        message: 'User not found',
      });
    } else {
      const saveContact = serviceUser.insertContact(data);
      socket.emit('registerContact', saveContact);
    }
  });
  // Não mexa pq está com BO
  socket.on('registerGroup', (data: IDataRegContact) => {
    if (!serviceUser.findUserByEmail(data.userEmail)) {
      socket.emit('registerGroup', {
        status: 404,
        message: 'User not found',
      });
    } else {
      const saveContact = serviceUser.insertContact(data);

      socket.emit('registerGroup', saveContact);
    }
  });

  socket.on('getAllList', (data: IDataAuth) => {
    const user = serviceUser.findUserByEmail(data.email);
    if (!user) {
      socket.emit('getAllList', {
        status: 404,
        message: 'User not found',
      });
    } else {
      socket.emit('getAllList', {
        listContact: user.listContacts,
        listGroups: user.listGroups,
        user: user.email,
      });
    }
  });

  socket.on('register', (data: IDataRegister) => {
    const userFound = serviceUser.findUserByEmail(data.email);

    if (userFound) {
      socket.emit('register', {
        status: 409,
        message: 'User already exists',
      });
    } else {
      const dataService = serviceUser.createUser(data);
      // if userFound
      if (dataService.status === 404) {
        socket.emit('register', dataService);
      } else {
        socket.emit('register', dataService);
      }
    }
  });
});

export default [connection];
