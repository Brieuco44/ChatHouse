// src/stores/auth.ts
import { defineStore } from "pinia";
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem("token"),
  }),
  actions: {

    // Login function
    async login(credentials: {
      email: string;
      password: string;
    }): Promise<void> {
      const response = await axios.post<{ token: string; user: User }>(
        "https://apichathouse.enzopenisson.duckdns.org/auth/login",
        credentials
      );
      this.token = response.data.token;
      this.user = response.data.user;

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
        "https://apichathouse.enzopenisson.duckdns.org/auh/register",
        data
      );
    },

    // Logout function
    logout(): void {
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    },

    // Fetch user function
    async fetchUser(): Promise<void> {
      if (this.token) {
        try {
          const response = await axios.get<User>(
            "https://apichathouse.enzopenisson.duckdns.org/auth/profile"
          );
          this.user = response.data;
        } catch {
          this.logout();
        }
      }
    },
  },
});
