import { Message } from './Message';

export class MessagesRepository {
  private messages = new Map<string, Message>();

  add(message: Message) {
    this.messages.set(message.userId, message);
  }
}
