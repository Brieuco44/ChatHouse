import { io } from "socket.io-client";

// Connect to the socket server
const socket = io("https://apichathouse.enzopenisson.duckdns.org", {
  auth: {
    token: localStorage.getItem("token"),
  },
});

const MESSAGE_STORAGE_KEY = "offlineMessages";

// Save message to localStorage when offline
const saveOfflineMessage = (message: any) => {
  let offlineMessages = JSON.parse(localStorage.getItem(MESSAGE_STORAGE_KEY) || "[]");
  offlineMessages.push(message);
  localStorage.setItem(MESSAGE_STORAGE_KEY, JSON.stringify(offlineMessages));
};

// Sync offline messages when the network is restored
const syncOfflineMessages = () => {
  const offlineMessages = JSON.parse(localStorage.getItem(MESSAGE_STORAGE_KEY) || "[]");

  if (offlineMessages.length > 0) {
    offlineMessages.forEach((message: any) => {
      socket.emit("new_message", message);
      console.log("Syncing offline message", message);
    });
    localStorage.removeItem(MESSAGE_STORAGE_KEY); // Clear local storage after sending
  }
};

// Event listener for network status
window.addEventListener('online', () => {
  console.log("Network is back online, syncing messages...");
  syncOfflineMessages();
});

window.addEventListener('offline', () => {
  console.log("Network is offline, saving messages locally...");
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
  if (navigator.onLine) {
    socket.emit("new_message", message);
    console.log("new message", message);
  } else {
    saveOfflineMessage(message); // Save the message locally if offline
  }
};

export default socket;
