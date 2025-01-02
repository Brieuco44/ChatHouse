// src/stores/auth.ts
import { defineStore } from "pinia";
import axios from "axios";
import { Contact } from "@/types/contacts";

interface AuthState {
  contact: Contact | null;
  token: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    contact: null,
    token: localStorage.getItem("token"),
  }),
  actions: {

    // Login function
    async login(credentials: {
      email: string;
      password: string;
    }): Promise<void> {
      const response = await axios.post<{ token: string; contact: Contact }>(
        "https://apichathouse.enzopenisson.duckdns.org/auth/login",
        credentials
      );
      
      this.token = response.data.token;
      localStorage.setItem("token", this.token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
    },
    
    // Register function
    async register(data: {
      fullname: string;
      password: string;
      telephone: string;
      birthdate: string;
      email: string;
    }): Promise<void> {
      await axios.post(
        "https://apichathouse.enzopenisson.duckdns.org/auth/register",
        data
      );
    },
    
    // Logout function
    logout(): void {
      console.log(localStorage.getItem("token"));
      this.contact = null;
      this.token = null;
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    },

    // Fetch contact function
    async fetchContact(): Promise<void> {
      if (this.token) {
        
        try {
          const response = await axios.get<Contact>(
            "https://apichathouse.enzopenisson.duckdns.org/auth/profile",
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );
          console.log(response);
          
          this.contact = response.data;
          
        } catch {
          // this.logout();
          
        }
      }
    },

    isLogin(): boolean {
      return !!localStorage.getItem("token");
    }
  },
});
