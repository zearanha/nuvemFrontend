import axios from "axios";

// Em desenvolvimento usamos o prefixo `/api` e configuramos um proxy no Vite
// (`vite.config.ts`) que encaminha `/api/*` para o backend remoto.
export const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;