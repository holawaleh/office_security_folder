export interface Device {
  id: number;
  name: string;
  serial_number: string;
  location: string;
  status: string;
  ip_address: string | null;
  firmware_version: string;
  last_seen: string | null;
  created_at: string;
  updated_at: string;
}
