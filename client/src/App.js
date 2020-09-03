import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { TextField } from '@material-ui/core';
import './App.css';

const socket = io.connect('http://localhost:4000');

function App() {
  const [state, setState] = useState({ name: '', message: '' });
  const [chat, setChat] = useState([]);

  useEffect(() => {
    console.log('Nu körs useEffect!');
    socket.on('message', ({ name, message }) => {
      setChat([...chat, { name, message }]);
    });
  });

  const onTextChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const onMessageSubmit = (event) => {
    event.preventDefault();
    const { name, message } = state;
    console.log(JSON.stringify({ name, message }, null, 2));

    socket.emit('message', { name, message });
    setState({ name: '', message: '' });
  };

  const renderChat = () => {
    return chat.map(({ name, message }, index) => (
      <div key={index}>
        <h3>
          {name}: <span>{message}</span>
        </h3>
      </div>
    ));
  };

  return (
    <div className="card">
      <form onSubmit={onMessageSubmit}>
        <h1>
          Chat-app with websockets.io{' '}
          <span role="img" aria-label="icon">
            🚀
          </span>
        </h1>
        <div className="name-field">
          <TextField
            name="name"
            onChange={onTextChange}
            value={state.name}
            label="Name"
          />
        </div>
        <div>
          <TextField
            name="message"
            onChange={onTextChange}
            value={state.message}
            id="outlined-multiline-static"
            variant="outlined"
            label="Message here..."
          />
        </div>
        <button>Send message</button>
      </form>
      <div className="chat-view">
        <h1>Live-chat </h1>
        {renderChat()}
      </div>
    </div>
  );
}

export default App;
