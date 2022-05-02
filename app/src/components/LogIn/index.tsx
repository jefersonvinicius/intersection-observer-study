import { User } from 'App';
import React, { FormEvent, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { LogInContainer } from './styles';

type Props = {
  onNewUser: (user: User, socket: Socket, amountUsersOnline: number) => void;
};

export default function LogIn({ onNewUser }: Props) {
  const [usernameValue, setUsernameValue] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleLogIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (!usernameValue.trim()) return;

    const username = usernameValue.trim();
    if (username.includes(' ')) {
      setErrorMessage('username must not have spaces');
      return;
    }

    const socket = io('http://localhost:3333');
    socket.once('connect', () => {
      socket.emit('new-user', { username }, handleNewUserCallback);
    });

    function handleNewUserCallback(response: any) {
      if (!response || response.error) {
        setErrorMessage('username already used, choose another');
        return;
      }
      const user = response.user as User;
      onNewUser(user, socket, response.amountUsersOnline);
    }
  }

  return (
    <LogInContainer>
      <form onSubmit={handleLogIn}>
        <input
          placeholder="your username"
          autoFocus
          value={usernameValue}
          onChange={(e) => setUsernameValue(e.target.value)}
        />
        {errorMessage && <span>{errorMessage}</span>}
      </form>
    </LogInContainer>
  );
}
