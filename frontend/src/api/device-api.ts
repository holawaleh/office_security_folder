import api from "./axios";

import type { Device } from "../types/device";

interface DeviceResponse {
  count: number;
  results: Device[];
}

export interface CreateDevicePayload {
  name: string;
  serial_number: string;
  location: string;
  ip_address?: string;
  firmware_version?: string;
  status?: string;
}

export async function getDevices() {
  const response =
    await api.get<DeviceResponse>(
      "/api/devices/"
    );

  return response.data.results;
}

export async function createDevice(
  payload: CreateDevicePayload
) {
  const response = await api.post<Device>(
    "/api/devices/",
    payload
  );

  return response.data;
}
