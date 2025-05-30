/*
Create the centralized axios instances for all these servers:
- auth api
- drone api
- admin api
- map api
*/

import axios from "axios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: token ? `Bearer ${token}` : undefined,
    "ngrok-skip-browser-warning": "true",
  };
};

const auth_api = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL,
  withCredentials: false,
  // headers: getAuthHeaders(),
});

const drone_api = axios.create({
  baseURL: import.meta.env.VITE_DRONE_URL,
  withCredentials: false,
  headers: getAuthHeaders(),
});

const drones_control_api = axios.create({
  baseURL: import.meta.env.VITE_MAIN_URL,
  withCredentials: false,
  headers: getAuthHeaders(),
});

const drone_control_api = axios.create({
  baseURL: import.meta.env.VITE_DRONE_CONTROL_URL,
  withCredentials: false,
  headers: getAuthHeaders(),
});

const map_api = axios.create({
  baseURL: import.meta.env.VITE_MAP_URL,
  withCredentials: false,
  headers: getAuthHeaders(),
});

// Optional: keep interceptors if token may change after creation
[auth_api, drone_api, drones_control_api, drone_control_api, map_api].forEach(
  (instance) => {
    instance.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.headers["ngrok-skip-browser-warning"] = "true";
      return config;
    });
  }
);

export { auth_api, drone_api, drones_control_api, drone_control_api, map_api };
