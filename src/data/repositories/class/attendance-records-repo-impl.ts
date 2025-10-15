import { type CreateAttendanceRecordsRequest } from '@/domain/models/attendance/request/create-attendance-records-request';
import { type EnrollUserListToClassRequest } from '@/domain/models/attendance/request/enroll-user-to-class-request';
import { type GetAttendanceRecordsRequest } from '@/domain/models/attendance/request/get-attendance-records-request';
import { type UpdateAttendanceRecordsRequest } from '@/domain/models/attendance/request/update-attendance-records-request';
import { type ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type AttendanceRecordsRepository } from '@/domain/repositories/class/attendance-repository';

import { customApiClient } from '@/data/api/api-client';
import { apiEndpoints } from '@/data/api/api-endpoints';

export class AttendanceRecordsRepoImpl implements AttendanceRecordsRepository {
  async getAttendanceRecordsListInfo(request: GetAttendanceRecordsRequest): Promise<ApiPaginationResponse> {
    try {
      const response = await customApiClient.get<ApiPaginationResponse>(apiEndpoints.attendanceRecords.getAll, {
        params: request.toJson(),
      });

      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch AttendanceRecords info');
    }
  }

  async getAttendanceRecordsById(id: string): Promise<ApiResponse> {
    try {
      const response = await customApiClient.get<ApiResponse>(apiEndpoints.attendanceRecords.getById(id));
      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch AttendanceRecords info');
    }
  }

  async createAttendanceRecords(request: CreateAttendanceRecordsRequest): Promise<ApiResponse> {
    try {
      const response = await customApiClient.post<ApiResponse>(apiEndpoints.attendanceRecords.create, request.toJson());

      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to create AttendanceRecords');
    }
  }

  async updateAttendanceRecords(request: UpdateAttendanceRecordsRequest): Promise<ApiResponse> {
    try {
      const formData = request.toJson();

      const response = await customApiClient.put<ApiResponse>(apiEndpoints.attendanceRecords.update, formData);

      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch AttendanceRecords info');
    }
  }

  async deleteAttendanceRecords(id: string): Promise<ApiResponse> {
    try {
      const response = await customApiClient.delete<ApiResponse>(apiEndpoints.attendanceRecords.delete(id));

      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch AttendanceRecords info');
    }
  }

  async enrollUserListToClass(request: EnrollUserListToClassRequest): Promise<ApiResponse> {
    try {
      const response = await customApiClient.post<ApiResponse>(
        apiEndpoints.attendanceRecords.enroll,
        request.toFormData(),
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 3600000,
        }
      );

      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to create AttendanceRecords');
    }
  }
}
