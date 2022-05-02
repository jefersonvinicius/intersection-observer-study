import styled from 'styled-components';

export const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const ChatHeader = styled.div`
  padding-bottom: 10px;
`;

export const ChatMessagesArea = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: max-content;
`;

export const ChatInputBox = styled.form`
  padding-top: 10px;

  & > input {
    padding: 10px;
    font-size: 16px;
    border: 1px solid #999;
    border-radius: 5px;
    width: 100%;
  }
`;
