import { IUser, IUserBanco } from '../interface/IUser';

import server from '../config/server';
import ServiceUser from '../services/user';
import ServiceLog from '../services/generateLog';
import ServiceContent from '../services/content';
import {
  IDataAuth,
  IDataLogin,
  IDataRegContact,
  IDataRegister,
  IDataPrivate,
} from '../interface/IData';
import { HashProvider } from '../Provider/hash';
import { UsersData } from '../assets/data/user';

const serviceContent = new ServiceContent();
const connection = server.ioConnection.on('connection', (socket) => {
  const fileLog = new ServiceLog();
  const serviceUser = new ServiceUser();

  socket.on('joinChatPrivate', ({ to }: IDataPrivate) => {
    socket.join(to);
  });

  socket.on('refreshChatPrivate', ({ to }: IDataPrivate) => {
    const dateRefresh = serviceContent.getMessage({
      to,
      from: '',
      content: '',
    });
    console.log(dateRefresh);

    if (dateRefresh) {
      socket.broadcast.to(to).emit('chatPrivate');
    }
  });

  socket.on('chatPrivate', ({ from, content, to }: IDataPrivate) => {
    serviceContent.createObject({ from, content, to });
    const infoData = serviceContent.saveMessage({ from, content, to });
    if (infoData !== undefined) {
      fileLog.saveLog({
        from,
        to,
        log: `${from} send message`,
      });
      socket.broadcast.to(to).emit('chatPrivate', infoData);
    }
  });

  socket.on('login', (data: IDataLogin) => {
    const userFound = serviceUser.findUserByEmail(data.email);
    if (!userFound) {
      fileLog.saveLog({
        from: data.email,
        log: `${data.email} login failed, why password or email is invalid`,
      });
      socket.emit('login', {
        status: 404,
        error: 'User not Found',
      });
    } else {
      const hashProvider = new HashProvider();
      var userLogin = hashProvider.compare(
        data.password,
        userFound.password && userFound.password
      );

      if (!userLogin) {
        fileLog.saveLog({
          from: data.email,
          log: `${data.email} login failed, why password or email is invalid`,
        });
        socket.emit('login', {
          status: 404,
          message: 'Credentials invalid, verify your parameters',
        });
      } else {
        fileLog.saveLog({
          from: data.email,
          log: `${data.email}, Successfully logged in`,
        });
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
      fileLog.saveLog({
        from: data.userEmail,
        to: data.userAuth,
        log: `${data.userAuth}, try register user not registered`,
      });
    } else {
      const saveContact = serviceUser.insertContact(data);
      fileLog.saveLog({
        from: data.userEmail,
        to: data.userAuth,
        log: `${data.userAuth}, regitered in list of contact to user ${data.userEmail}`,
      });
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

  socket.on('getContact', ({ from, email }: any) => {
    const user = serviceUser.findUserByEmail(email);

    fileLog.saveLog({
      from,
      log: `${from}, request data to user ${email}`,
    });

    if (!user) {
      socket.emit('getContact', {
        status: 404,
        message: 'User not found',
      });
    } else {
      socket.emit('getContact', {
        user,
      });
    }
  });

  socket.on('register', (data: IDataRegister) => {
    const userFound = serviceUser.findUserByEmail(data.email);

    if (userFound) {
      fileLog.saveLog({
        from: data.email,
        log: `${data.name}, account already axists`,
        status: '',
      });
      socket.emit('register', {
        status: 409,
        message: 'User already exists',
      });
    } else {
      const dataService = serviceUser.createUser(data);
      // if userFound
      fileLog.saveLog({
        from: data.email,
        log:
          dataService.status === 200
            ? `${data.name} registered`
            : `${data.name} not registered`,
        status: dataService.status.toString(),
      });
      socket.emit('register', dataService);
    }
  });
});

export default [connection];
