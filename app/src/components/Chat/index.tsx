import React, { FormEvent, useCallback, useEffect, useState, useMemo } from 'react';
import { Socket } from 'socket.io-client';
import MessageItem from './MessageItem';
import { User } from '../../App';
import { ChatContainer, ChatHeader, ChatInputBox, ChatMessagesArea } from './styles';
import { Message, MessageTypes } from 'components/Chat/helpers';
import { useBoundingClientRect } from 'hooks/dom';
import { useRef } from 'react';

type Props = {
  user: User;
  socket: Socket;
  initialOnlineUsersAmount: number;
  topComponentsHeight: number;
};

function makeUserGoneMessage(params: { username: string }): Message {
  const username = params.username;
  return { id: `user-gone-${username}`, text: `${username} saiu!`, type: MessageTypes.UserGone, viewed: false };
}

function makeNewUserMessage(params: { username: string }): Message {
  const username = params.username;
  return {
    id: `new-user-${username}`,
    text: `${username} acabou de se conectar!`,
    type: MessageTypes.NewUser,
    viewed: false,
  };
}

function makeUserMessage(params: { id: string; text: string; user: User }): Message {
  return { ...params, type: MessageTypes.Normal, viewed: false };
}

const CONTAINER_PADDING = 10;

export default function Chat({ user, socket, initialOnlineUsersAmount, topComponentsHeight }: Props) {
  const messagesAreaRef = useRef<HTMLDivElement>(null);

  const [messageValue, setMessageValue] = useState('');
  const [onlineUsersAmount, setOnlineUsersAmount] = useState(initialOnlineUsersAmount);
  const [messages, setMessages] = useState<Message[]>([]);

  const chatHeaderClientRect = useBoundingClientRect();
  const inputBoxClientRect = useBoundingClientRect();

  const messageAreaHeight = useMemo(() => {
    const chatHeaderHeight = chatHeaderClientRect.boundingClientRect?.height ?? 0;
    const inputBoxHeight = inputBoxClientRect.boundingClientRect?.height ?? 0;
    return window.innerHeight - (topComponentsHeight + chatHeaderHeight + inputBoxHeight + 2 * CONTAINER_PADDING);
  }, [
    chatHeaderClientRect.boundingClientRect?.height,
    inputBoxClientRect.boundingClientRect?.height,
    topComponentsHeight,
  ]);

  useEffect(() => {
    function addMessage(message: Message) {
      setMessages((old) => [...old, message]);
    }

    function handleNewUserEvent({ username }: any) {
      const message = makeNewUserMessage({ username });
      addMessage(message);
    }

    function handleNewMessage({ message }: any) {
      const userMessage = makeUserMessage({ ...message });
      addMessage(userMessage);
    }

    function handleUserGoneEvent({ username }: any) {
      const message = makeUserGoneMessage({ username });
      addMessage(message);
    }

    function handleOnlineUsersAmount({ value }: any) {
      setOnlineUsersAmount(value);
    }

    socket.on('new-user', handleNewUserEvent);
    socket.on('new-message', handleNewMessage);
    socket.on('user-gone', handleUserGoneEvent);
    socket.on('users-online', handleOnlineUsersAmount);

    return () => {
      socket.removeListener('new-user', handleNewUserEvent);
      socket.removeListener('new-message', handleNewMessage);
      socket.removeListener('users-online', handleOnlineUsersAmount);
      socket.removeListener('user-gone', handleUserGoneEvent);
    };
  }, [socket]);

  function handleSubmitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = messageValue.trim();
    if (!message) return;

    socket.emit('new-message', { messageText: message });
    setMessageValue('');
  }

  const handleMessageView = useCallback((viewedMessage: Message) => {
    console.log(`message ${viewedMessage.text} viewed`);
    setMessages((old) => {
      return old.map((message) => {
        if (message.id !== viewedMessage.id) return message;
        return { ...message, viewed: true };
      });
    });
  }, []);

  const renderMessage = useCallback(
    (message: Message) => (
      <MessageItem
        key={message.id}
        message={message}
        currentUserId={user.id}
        messagesAreaElement={messagesAreaRef.current}
        onViewed={handleMessageView}
      />
    ),
    [handleMessageView, user.id]
  );

  return (
    <ChatContainer style={{ padding: CONTAINER_PADDING }}>
      <ChatHeader ref={chatHeaderClientRect.handleRef}>Online: {onlineUsersAmount}</ChatHeader>
      <ChatMessagesArea ref={messagesAreaRef} style={{ height: messageAreaHeight }}>
        {messages.map(renderMessage)}
      </ChatMessagesArea>
      <ChatInputBox ref={inputBoxClientRect.handleRef} onSubmit={handleSubmitMessage}>
        <input value={messageValue} onChange={(e) => setMessageValue(e.target.value)} placeholder="Message..." />
      </ChatInputBox>
    </ChatContainer>
  );
}
