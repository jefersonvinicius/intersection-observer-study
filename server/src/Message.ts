import { randomUUID } from 'crypto';

export class Message {
  readonly id: string;

  constructor(readonly userId: string, readonly text: string) {
    this.id = randomUUID();
  }
}
