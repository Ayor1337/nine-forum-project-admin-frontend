import axios from "axios";
import { getToken } from "./token";

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
});

client.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = "Bearer " + getToken();
    return config;
  },
  (error) => {
    return error;
  },
);

client.interceptors.response.use(
  (resp) => {
    return resp;
  },
  (error) => {
    return Promise.reject(error);
  },
);
