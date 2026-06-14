import api from "./axios";

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string;
  phone_number: string;
  created_at: string;
}

export interface CreateUserPayload {
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: string;
}

export interface UpdateUserPayload {
  username?: string;
  password?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  role?: string;
}

interface UserProfileResponse {
  count: number;
  results: UserProfile[];
}

export async function getUserProfiles() {
  const response =
    await api.get<UserProfileResponse>(
      "/api/accounts/"
    );

  return response.data.results;
}

export async function createUserProfile(
  payload: CreateUserPayload
) {
  const response =
    await api.post<UserProfile>(
      "/api/accounts/",
      payload
    );

  return response.data;
}

export async function registerUserAccount(
  payload: CreateUserPayload
) {
  const response =
    await api.post<UserProfile>(
      "/api/accounts/register/",
      payload
    );

  return response.data;
}

export async function updateUserProfile(
  id: number,
  payload: UpdateUserPayload
) {
  const response =
    await api.patch<UserProfile>(
      `/api/accounts/${id}/`,
      payload
    );

  return response.data;
}
