// src/api/auth.ts
import { drone_api, drones_control_api } from "./axios";

export const create = async (formData: {
  drone_id: number;
  departure_time: string;
  altitude: number;
  start_lat: number;
  start_lng: number;
  end_lat: number;
  end_lng: number;
}) => {
  const res = await drone_api.post("/create", formData);
  return res.data;
};

export const update_request = async (id: number, state: string) => {
  const res = await drone_api.post("/update", { id: id, state: state });
  return res.data;
};

export const get_all = async () => {
  const res = await drone_api.get("");
  return res.data;
};

export const register_drone = async (
  name: string,
  owner_id: number,
  port: string,
  maxspeed: number
) => {
  const res = await drones_control_api.post("/register", {
    name: name,
    owner_id: owner_id,
    ip: import.meta.env.VITE_DRONE_CONTROL_URL,
    port: port,
    maxspeed: maxspeed,
  });
  return res.data;
};

export const drone_status = async (drone_id: string) => {
  const res = await drones_control_api.get(`${drone_id}/status`);
  return res.data;
};

export const start_position = async (
  drone_id: string,
  latitude: number,
  longitude: number,
  altitude: number
) => {
  const res = await drones_control_api.post(`${drone_id}/move`, {
    longitude: longitude,
    latitude: latitude,
    altitude: altitude,
  });

  return res.data;
};

export const end_position = async (
  drone_id: string,
  latitude: number,
  longitude: number,
  altitude: number
) => {
  const res = await drones_control_api.post(`${drone_id}/move_to`, {
    longitude: longitude,
    latitude: latitude,
    altitude: altitude,
  });

  return res.data;
};

// export const register = async (formData: {
//   full_name: string;
//   email: string;
//   address: string;
//   phone: string;
//   password: string;
//   role_id: number;
// }) => {
//   const res = await drone_api.post("/register", formData);
//   return res.data;
// };
