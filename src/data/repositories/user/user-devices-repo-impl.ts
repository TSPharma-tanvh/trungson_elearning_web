import { type ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type GetUserDevicesRequest } from '@/domain/models/user-devices/request/get-user-devices-request';
import { type UpdateUserDevicesRequest } from '@/domain/models/user-devices/request/update-user-devices-request';
import { type UserDevicesRepository } from '@/domain/repositories/user/device-repository';

import { customApiClient } from '@/data/api/api-client';
import { apiEndpoints } from '@/data/api/api-endpoints';

export class UserDevicesRepoImpl implements UserDevicesRepository {
  async getUserDevicesListInfo(request: GetUserDevicesRequest): Promise<ApiPaginationResponse> {
    try {
      const response = await customApiClient.get<ApiPaginationResponse>(apiEndpoints.userDevices.getAll, {
        params: request.toJson(),
      });

      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch device info');
    }
  }

  async getUserDevicesById(id: string): Promise<ApiResponse> {
    try {
      const response = await customApiClient.get<ApiResponse>(apiEndpoints.userDevices.getById(id));
      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch device info');
    }
  }

  async deleteUserDevicesById(id: string): Promise<ApiResponse> {
    try {
      const response = await customApiClient.delete<ApiResponse>(apiEndpoints.userDevices.delete, {
        params: { id },
      });

      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to delete user device');
    }
  }

  async updateUserDevices(request: UpdateUserDevicesRequest): Promise<ApiResponse> {
    try {
      const response = await customApiClient.put<ApiResponse>(apiEndpoints.userDevices.update, request.toJson());

      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch device info');
    }
  }
}
