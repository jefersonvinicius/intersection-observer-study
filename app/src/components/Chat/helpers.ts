import { User } from 'App';

export enum MessageTypes {
  Normal,
  NewUser,
  UserGone,
}

export type Message = {
  id: string;
  text: string;
  type: MessageTypes;
  viewed: boolean;
  user?: User;
};
