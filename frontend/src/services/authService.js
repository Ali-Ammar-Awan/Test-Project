// src/services/authService.js
import api from "../axios";

export default {
  async login(email, password) {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

    async signup(userData) {
    const response = await api.post("/auth/signup", userData);
    return response.data;
  },
};
