import http from 'http';
import { Server } from 'socket.io';
import { Message } from './Message';
import { MessagesRepository } from './MessagesRepository';
import { User } from './User';
import { UsersRepository } from './UsersRepository';

const httpServer = http.createServer();
const webSocketServer = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

type NewUserParams = {
  username: string;
};

type NewMessageParams = {
  userId: string;
  messageText: string;
};

const usersRepository = new UsersRepository();
const messagesRepository = new MessagesRepository();

let amountUsersOnline = 0;

function emitAmountUsersOnlineWhenConnect() {
  amountUsersOnline++;
  webSocketServer.emit('users-online', { value: amountUsersOnline });
}

function emitAmountUsersOnlineWhenDisconnect() {
  amountUsersOnline = Math.max(0, amountUsersOnline - 1);
  webSocketServer.emit('users-online', { value: amountUsersOnline });
}

webSocketServer.on('connection', (socket) => {
  socket.on('new-user', (params: NewUserParams, callback: Function) => {
    const username = params.username;
    if (usersRepository.checkIfUsernameExists(username))
      return callback({ error: true, message: 'username already used' });

    const user = new User(username, socket.id);
    usersRepository.add(user);
    socket.broadcast.emit('new-user', { username });
    emitAmountUsersOnlineWhenConnect();
    callback({ user, amountUsersOnline });
  });

  socket.on('new-message', (params: NewMessageParams) => {
    const { messageText } = params;

    const user = usersRepository.getUserBySocketId(socket.id);
    if (!user) return;
    const message = new Message(user.id, messageText);
    messagesRepository.add(message);

    const messageWithUser = { ...message, user };
    webSocketServer.emit('new-message', { message: messageWithUser });
  });

  socket.on('disconnect', () => {
    const user = usersRepository.getUserBySocketId(socket.id);
    if (user) {
      socket.broadcast.emit('user-gone', { username: user?.username });
      usersRepository.deleteBySocketId(socket.id);
    }
    emitAmountUsersOnlineWhenDisconnect();
  });
});

httpServer.listen(3333, () => {
  console.log('Serving at http://localhost:3333');
});
