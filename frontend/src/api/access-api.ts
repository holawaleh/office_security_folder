import api from "./axios";

export interface AccessPerson {
  id: number;
  full_name: string;
  phone_number: string;
  email: string;
  person_type: string;
  employee_id: string | null;
  rfid_uid: string | null;
  fingerprint_id: number | null;
  access_level: string;
  is_active: boolean;
  display_identifier: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAccessPersonPayload {
  full_name: string;
  phone_number: string;
  email: string;
  person_type: string;
  employee_id: string | null;
  rfid_uid: string | null;
  fingerprint_id: number | null;
  access_level: string;
  is_active: boolean;
}

interface AccessPersonResponse {
  count: number;
  results: AccessPerson[];
}

export async function getAccessPeople() {
  const response =
    await api.get<AccessPersonResponse>(
      "/api/access/persons/"
    );

  return response.data.results;
}

export async function createAccessPerson(
  payload: CreateAccessPersonPayload
) {
  const response =
    await api.post<AccessPerson>(
      "/api/access/persons/",
      payload
    );

  return response.data;
}
