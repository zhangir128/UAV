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

export const activate_drone = async (formData: {
  drone_id: number;
  altitude: number;
  lat: number;
  lng: number;
}) => {
  console.log("LOOOG", formData);
  const res = await drones_control_api.post("drone/activate", formData);
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

export const register_drone = async (name: string, max_speed: number) => {
  const res = await drones_control_api.post("drone/create", {
    name: name,
    max_speed: max_speed,
  });
  return res.data;
};

export const drone_status = async (drone_id: number) => {
  const res = await drones_control_api.post(`drone/info`, {
    drone_id: drone_id,
  });
  return res.data;
};

export const start_position = async (
  drone_id: string,
  latitude: number,
  longitude: number,
  altitude: number
) => {
  const res = await drones_control_api.post(`drone/${drone_id}/move`, {
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
  const res = await drones_control_api.post(`drone/${drone_id}/move_to`, {
    longitude: longitude,
    latitude: latitude,
    altitude: altitude,
  });

  return res.data;
};

export const list_drones = async () => {
  const res = await drones_control_api.post("/drone/getlist");
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
