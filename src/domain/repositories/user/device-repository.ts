import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { ApiResponse } from '@/domain/models/core/api-response';
import { GetUserDevicesRequest } from '@/domain/models/user-devices/request/get-user-devices-request';
import { UpdateUserDevicesRequest } from '@/domain/models/user-devices/request/update-user-devices-request';

export interface UserDevicesRepository {
  getUserDevicesListInfo: (request: GetUserDevicesRequest) => Promise<ApiPaginationResponse>;

  getUserDevicesById: (id: string) => Promise<ApiResponse>;

  updateUserDevices: (request: UpdateUserDevicesRequest) => Promise<ApiResponse>;

  deleteUserDevicesById: (id: string) => Promise<ApiResponse>;
}
