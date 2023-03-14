import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { SERVER_URL } from './constansts';

const socket = io(SERVER_URL, { withCredentials: true });

function ChatRoom({
  user,
}: {
  user: string;
}) {
  const [messages, setMessages] = useState<{ user: string, msg: string }[]>([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    socket.on('msg', ({ user, msg }: { user: string, msg: string }) => {
      console.log('msg', user, msg)
      setMessages((prevMessages) => [...prevMessages, { user, msg }]);
    });

    return () => {
      socket.off('msg');
    }
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inputValue) {
      socket.emit('write', { user, msg: inputValue });
      setMessages((prevMessages) => [...prevMessages, { user, msg: inputValue }]);
      setInputValue('');
    }
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
  }

  return (
    <div>
      <ul>
        {messages.map(({ user, msg }, index) => (
          <li key={index}>{user}: {msg}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="text" value={inputValue} onChange={handleInputChange} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatRoom;