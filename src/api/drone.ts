// src/api/auth.ts
import { drone_api } from "./axios";

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
