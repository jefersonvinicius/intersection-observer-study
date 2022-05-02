import { randomUUID } from 'crypto';

export class User {
  readonly id: string;

  constructor(readonly username: string, readonly socketId: string) {
    this.id = randomUUID();
  }
}
