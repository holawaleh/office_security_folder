import api from "./axios";

import type { Device } from "../types/device";

interface DeviceResponse {
  count: number;
  results: Device[];
}

export async function getDevices() {
  const response =
    await api.get<DeviceResponse>(
      "/api/devices/"
    );

  return response.data.results;
}