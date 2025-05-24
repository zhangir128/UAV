// src/api/auth.ts
import { auth_api } from "./axios";

export const login = async (email: string, password: string) => {
  const res = await auth_api.post("/login", { email, password });
  return res.data;
};

export const register = async (formData: {
  full_name: string;
  email: string;
  address: string;
  phone: string;
  password: string;
  role_id: number;
}) => {
  const res = await auth_api.post("/register", formData);
  return res.data;
};
