import { io } from "socket.io-client";

const socket = io("https://apichathouse.enzopenisson.duckdns.org", {
  withCredentials: true,
  transports: ["websocket"],
});

export default socket;
