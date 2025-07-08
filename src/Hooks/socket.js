import { io } from "socket.io-client";

// const socket = io("http://localhost:5000", {
const socket = io("https://backend-yege.onrender.com", {

  transports: ["websocket"],
  reconnectionAttempts: 5,
  timeout: 10000,
  autoConnect: true,
});

export default socket;