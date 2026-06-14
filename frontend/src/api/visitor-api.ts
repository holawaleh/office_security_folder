import api from "./axios";

export interface Visitor {
  id: number;
  full_name: string;
  phone_number: string;
  email: string;
  host_name: string;
  visit_usage: string;
  custom_visit_usage: string;
  effective_visit_usage: string;
  purpose: string;
  access_code: string;
  status: string;
  approved_by: string;
  expected_arrival: string | null;
  check_in_time: string | null;
  check_out_time: string | null;
  created_at: string;
}

export interface CreateVisitorPayload {
  full_name: string;
  phone_number: string;
  email: string;
  host_name: string;
  visit_usage: string;
  custom_visit_usage: string;
  purpose: string;
  access_code: string;
  status: string;
  approved_by: string;
  expected_arrival: string | null;
}

interface VisitorResponse {
  count: number;
  results: Visitor[];
}

export async function getVisitors() {
  const response =
    await api.get<VisitorResponse>(
      "/api/visitors/"
    );

  return response.data.results;
}

export async function createVisitor(
  payload: CreateVisitorPayload
) {
  const response = await api.post<Visitor>(
    "/api/visitors/",
    payload
  );

  return response.data;
}
