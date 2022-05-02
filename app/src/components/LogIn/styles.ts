import styled from 'styled-components';

export const LogInContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  & > form {
    margin-top: 200px;
  }

  & > form > input {
    font-size: 32px;
    padding: 10px;
    border: none;
    outline: none;
    text-align: center;
  }
`;
