import { UserDeviceResponse } from './user-devices-response';

export interface UserDevicesResult {
  devices: UserDeviceResponse[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}
