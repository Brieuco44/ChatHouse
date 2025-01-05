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

export const updateMessage = async (receiverId: string,messageId: string, newText: string) => {
  return await axios.put(
    `${API_URL}/edit_message`,
    { message_id: messageId, receiver_id: receiverId, new_text: newText },
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

export const fetchConversation = async (receiverid : string) => {
  return await axios.get(`${API_URL}/get_conversation?receiver_id=${receiverid}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
