import { User } from './User';

export class UsersRepository {
  users = new Map<string, User>();

  checkIfUsernameExists(username: string) {
    return Array.from(this.users.values()).some((user) => user.username === username);
  }

  add(user: User) {
    this.users.set(user.socketId, user);
  }

  getUserBySocketId(socketId: string) {
    return this.users.get(socketId);
  }

  deleteBySocketId(socketId: string) {
    return this.users.delete(socketId);
  }
}
