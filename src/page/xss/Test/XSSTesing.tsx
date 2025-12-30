import React from 'react';

const XSSTesing = () => {
  const [message, setMessage] = React.useState('');

  return (
    <div>
      <label htmlFor=''>hola</label>
      <input type='text' onChange={(e) => setMessage(e.target.value)} />
      <button onClick={() => console.log(message)}>enviar</button>
      <div>{message}</div>
    </div>
  );
};

export default XSSTesing;
