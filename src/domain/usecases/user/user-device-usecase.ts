import { type ApiResponse } from '@/domain/models/core/api-response';
import { type GetUserDevicesRequest } from '@/domain/models/user-devices/request/get-user-devices-request';
import { type UpdateUserDevicesRequest } from '@/domain/models/user-devices/request/update-user-devices-request';
import { UserDeviceResponse } from '@/domain/models/user-devices/response/user-devices-response';
import { type UserDevicesResult } from '@/domain/models/user-devices/response/user-devices-result';
import { type UserDevicesRepository } from '@/domain/repositories/user/device-repository';

export class UserDevicesUsecase {
  constructor(private readonly UserDevicesRepo: UserDevicesRepository) {}

  async getUserDevicesListInfo(request: GetUserDevicesRequest): Promise<UserDevicesResult> {
    const result = await this.UserDevicesRepo.getUserDevicesListInfo(request);

    if (!result || !Array.isArray(result.result)) {
      throw new Error('Failed to load user list.');
    }

    const data = result.result.map((x) => UserDeviceResponse.fromJSON(x));

    return {
      devices: data,
      totalRecords: result.totalRecords ?? result.result.length,
      pageSize: result.pageSize ?? request.pageSize,
      pageNumber: result.pageNumber ?? request.pageNumber,
    };
  }

  async getUserDevicesById(id: string): Promise<UserDeviceResponse> {
    if (id === null || id === undefined || id.trim() === '') {
      throw new Error('ID is missing.');
    }

    const result = await this.UserDevicesRepo.getUserDevicesById(id);

    const userResponse = UserDeviceResponse.fromJSON(result.result);

    return userResponse;
  }

  //   async createUserDevices(request: CreateUserDevicesRequest): Promise<ApiResponse> {
  //     const response = await this.UserDevicesRepo.createUserDevices(request);

  //     return response;
  //   }

  async updateUserDevices(request: UpdateUserDevicesRequest): Promise<ApiResponse> {
    const result = await this.UserDevicesRepo.updateUserDevices(request);

    return result;
  }

  async deleteUserDevices(id: string): Promise<ApiResponse> {
    const result = await this.UserDevicesRepo.deleteUserDevicesById(id);
    return result;
  }
}
