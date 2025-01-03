import axios from "axios";

const API_URL = "https://apichathouse.enzopenisson.duckdns.org/contact"; // URL de votre backend

export const getContactsAPI = async () => {
  const response = await axios.get(`${API_URL}/get_contacts`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
};

export const addContactAPI = async (contactId: string) => {
  const response = await axios.post(
    `${API_URL}/add`,
    { contact_id: contactId },
    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
  );
  return response.data;
};

export const removeContactAPI = async (contactId: string) => {
  const response = await axios.post(
    `${API_URL}/remove`,
    { contact_id: contactId },
    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
  );
  return response.data;
};

export const searchContactAPI = async (username: string) => {
  const response = await axios.get(`${API_URL}/search?query=${username}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
}
