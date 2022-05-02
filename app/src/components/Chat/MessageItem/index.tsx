import React, { useEffect, useRef } from 'react';
import { Message } from 'components/Chat/helpers';
import { MessageContainer } from './styles';

type Props = {
  message: Message;
  currentUserId: string;
  messagesAreaElement: HTMLElement | null;
  onViewed: (message: Message) => void;
};

export default function MessageItem({ message, currentUserId, messagesAreaElement, onViewed }: Props) {
  const messageElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!messagesAreaElement || message.viewed) return;

    const callback = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        onViewed(message);
        observer.disconnect();
      }
    };

    const observer = new IntersectionObserver(callback, {
      root: messagesAreaElement,
      threshold: 1.0,
    });

    if (messageElementRef.current) observer.observe(messageElementRef.current);

    return () => {
      observer.disconnect();
    };
  }, [message, message.viewed, messagesAreaElement, onViewed]);

  const isUserMessage = !!message.user;
  const isOwnMessage = message.user?.id === currentUserId;

  const align = isOwnMessage ? 'flex-end' : isUserMessage ? 'flex-start' : 'center';

  return (
    <MessageContainer
      ref={messageElementRef}
      messageType={message.type}
      isUserMessage={isUserMessage}
      style={{ alignSelf: align }}
    >
      {message.user && !isOwnMessage && <span className="username">{message.user.username}</span>}
      <p style={{ fontStyle: message.viewed ? 'normal' : 'italic' }}>{message.text}</p>
    </MessageContainer>
  );
}
