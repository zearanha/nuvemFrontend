import axios from "axios";

// Em desenvolvimento usamos o prefixo `/api` e configuramos um proxy no Vite
// (`vite.config.ts`) que encaminha `/api/*` para o backend remoto.
export const api = axios.create({
  baseURL: "https://kong-b97fc7d5c3uskyjyt.kongcloud.dev/estoque",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;