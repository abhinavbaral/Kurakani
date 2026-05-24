import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { token } = useAuth();

  const socketRef = useRef(null);
  const tokenRef = useRef(null);

  const [isConnected, setIsConnected] = useState(false);

  const host = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    // no token → disconnect existing socket
    if (!token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      tokenRef.current = null;
      setIsConnected(false);
      return;
    }

    // prevent re-creating socket if token didn't change
    if (tokenRef.current === token && socketRef.current) return;

    // cleanup old socket before creating new one
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const socket = io(host, {
      auth: { token },
      withCredentials: true,
    });

    socketRef.current = socket;
    tokenRef.current = token;

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, host]);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);