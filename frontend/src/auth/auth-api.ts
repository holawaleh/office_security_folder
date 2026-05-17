import api from "../api/axios";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  refresh: string;
  access: string;
}

export async function loginUser(
  payload: LoginPayload
): Promise<LoginResponse> {
  const response = await api.post(
    "/api/token/",
    payload
  );

  return response.data;
}