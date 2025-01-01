import axios from "axios";

const API_URL = "https://apichathouse.enzopenisson.duckdns.org"; // Ton URL backend

// Envoyer un message
export const sendMessage = async (message: {
  receiver_id: string;
  message: string;
}) => {
  const response = await axios.post(`${API_URL}/send_message`, message, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
};

// Récupérer une conversation
export const getConversation = async (receiver_id: string) => {
  const response = await axios.get(`${API_URL}/get_conversation`, {
    params: { receiver_id },
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
};

// Modifier un message
export const editMessage = async (message_id: string, new_text: string) => {
  const response = await axios.put(
    `${API_URL}/edit_message`,
    { message_id, new_text },
    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
  );
  return response.data;
};

// Supprimer un message
export const removeMessage = async (message_id: string) => {
  const response = await axios.delete(`${API_URL}/remove_message`, {
    data: { message_id },
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
};
