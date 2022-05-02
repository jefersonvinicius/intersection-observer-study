import React, { useState } from 'react';
import { Container, ContainerHeader } from './App.styles';
import Chat from './components/Chat';
import LogIn from './components/LogIn';
import { Socket } from 'socket.io-client';
import { useBoundingClientRect } from 'hooks/dom';

export type User = {
  id: string;
  username: string;
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [initialOnlineUsersAmount, setInitialOnlineUsersAmount] = useState(1);

  const { handleRef, boundingClientRect } = useBoundingClientRect();

  function handleNewUser(newUser: User, userSocket: Socket, onlineUsersAmount: number) {
    setUser(newUser);
    setSocket(userSocket);
    setInitialOnlineUsersAmount(onlineUsersAmount);
  }

  return (
    <Container>
      <ContainerHeader ref={handleRef}>
        <h1>WorldChat</h1>
        {user && (
          <span>
            Logged in as: <strong>{user.username}</strong>
          </span>
        )}
      </ContainerHeader>
      {user && socket ? (
        <Chat
          user={user}
          socket={socket}
          initialOnlineUsersAmount={initialOnlineUsersAmount}
          topComponentsHeight={boundingClientRect?.height ?? 0}
        />
      ) : (
        <LogIn onNewUser={handleNewUser} />
      )}
    </Container>
  );
}

export default App;
