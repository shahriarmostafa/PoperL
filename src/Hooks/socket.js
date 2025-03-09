import { io } from "socket.io-client";

// Ensure the backend server URL is correct
const socket = io("http://localhost:5000", {
  transports: ["websocket"], // Ensures only WebSockets are used
  reconnectionAttempts: 5, // Number of retry attempts before failing
  timeout: 10000, // Timeout in milliseconds
  autoConnect: true, // Automatically connects when imported
});

export default socket;