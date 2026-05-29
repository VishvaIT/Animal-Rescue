import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to the backend Socket.io server
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // If we want to send the user ID on connect, we could emit it here
    if (user) {
      newSocket.emit('authenticate', user._id);
    }

    return () => {
      newSocket.close();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
