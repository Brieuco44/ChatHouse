import axios from "axios";

const API_URL = "http://localhost:8000"; // URL de votre backend

// Rechercher des contacts par nom ou email
export const searchContactsAPI = async (query: string) => {
  const response = await axios.get(`${API_URL}/search_contacts`, {
    params: { query },
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
};

// Assurez-vous que toutes les fonctions nécessaires sont exportées
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
