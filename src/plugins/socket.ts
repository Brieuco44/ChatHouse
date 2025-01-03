import { io } from "socket.io-client";

const socket = io("https://apichathouse.enzopenisson.duckdns.org", {
  // withCredentials: true,
  // transports: ["websocket"],
  auth: {
    token: localStorage.getItem("token"),
  },
});

// Rejoindre une salle de conversation
export const joinConversationRoom = (room: string) => {
  socket.emit("join_room", { room });
  console.log("join room", room);
  
};

// Quitter une salle de conversation
export const leaveConversationRoom = (room: string) => {
  socket.emit("leave_room", { room });
};

// Envoyer un événement de nouveau message
export const emitNewMessage = (message: any) => {
  socket.emit("new_message", message);
};

export default socket;
