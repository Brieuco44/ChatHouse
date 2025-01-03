import axios from "axios";

const API_URL = "https://apichathouse.enzopenisson.duckdns.org/communication";

export const sendMessage = async (receiverId: string, message: string) => {
  return await axios.post(
    `${API_URL}/send_message`,
    { receiver_id: receiverId, message },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const editMessage = async (messageId: string, newText: string) => {
  return await axios.put(
    `${API_URL}/edit_message`,
    { message_id: messageId, new_text: newText },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const deleteMessage = async (messageId: string) => {
  return await axios.delete(`${API_URL}/remove_message`, {
    data: { message_id: messageId },
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
