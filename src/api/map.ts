import { map_api } from "./axios";

export interface RestrictedZone {
  id: number;
  user_id: number;
  name: string;
  radius: number;
  latitude: number;
  longitude: number;
  altitude: number;
  state: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export const create_zone = async (formData: {
  user_id: number;
  name: string;
  radius: number;
  latitude: number;
  longitude: number;
  altitude: number;
  state: string;
  expires_at: string;
}) => {
  const res = await map_api.post("/create", formData);
  return res.data;
};

export const get_all_zones = async () => {
  const res = await map_api.get("");
  return res.data;
};
