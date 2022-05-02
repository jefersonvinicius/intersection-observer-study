import styled from 'styled-components';
import { MessageTypes } from 'components/Chat/helpers';

const COLORS: Record<number, string> = {
  [MessageTypes.NewUser]: '#29b6f6',
  [MessageTypes.UserGone]: '#ef9a9a',
  [MessageTypes.Normal]: '#e0e0e0',
};

export const MessageContainer = styled.div<{ messageType: MessageTypes; isUserMessage: boolean }>`
  background-color: ${(props) => COLORS[props.messageType] ?? '#fff'};
  padding: 10px;
  border-radius: 5px;

  & > span {
    font-size: 12px;
    font-weight: bold;
  }

  & > p {
    font-size: 14px;
  }
`;
