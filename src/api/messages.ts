import axios from "axios";

const API_URL = "https://apichathouse.enzopenisson.duckdns.org";
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const sendMessageAPI = async (receiverId: string, message: string) => {
  const response = await axios.post(
    `${API_URL}/send_message`,
    { receiver_id: receiverId, message },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const editMessageAPI = async (messageId: string, newText: string) => {
  const response = await axios.put(
    `${API_URL}/edit_message`,
    { message_id: messageId, new_text: newText },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const removeMessageAPI = async (messageId: string) => {
  const response = await axios.delete(`${API_URL}/remove_message`, {
    headers: getAuthHeaders(),
    data: { message_id: messageId },
  });
  return response.data;
};

export const joinRoomAPI = (socket: any, userId: string, room: string) => {
  socket.emit("join_room", { user_id: userId, room });
};
