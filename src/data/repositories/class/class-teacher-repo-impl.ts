import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { ApiResponse } from '@/domain/models/core/api-response';
import { CreateClassTeacherRequest } from '@/domain/models/teacher/request/create-class-teacher-request';
import { GetClassTeacherRequest } from '@/domain/models/teacher/request/get-class-teacher-request';
import { UpdateClassTeacherRequest } from '@/domain/models/teacher/request/update-class-teacher-request';
import { ClassTeacherRepository } from '@/domain/repositories/class/class-teacher-repository';

import { apiClient } from '@/data/api/api-client';
import { apiEndpoints } from '@/data/api/api-endpoints';

export class ClassTeacherRepoImpl implements ClassTeacherRepository {
  async getClassTeacherListInfo(request: GetClassTeacherRequest): Promise<ApiPaginationResponse> {
    try {
      const response = await apiClient.get<ApiPaginationResponse>(apiEndpoints.classTeacher.getAll, {
        params: request.toJSON(),
      });

      const apiResponse = response.data;

      if (!apiResponse || !apiResponse.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch ClassTeacher info');
    }
  }

  async getClassTeacherById(id: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.get<ApiResponse>(apiEndpoints.classTeacher.getById(id));
      const apiResponse = response.data;

      if (!apiResponse || !apiResponse.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch ClassTeacher info');
    }
  }

  async createClassTeacher(request: CreateClassTeacherRequest): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>(apiEndpoints.classTeacher.create, request.toJson());

      const apiResponse = response.data;

      if (!apiResponse || !apiResponse.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to create ClassTeacher');
    }
  }

  async updateClassTeacher(request: UpdateClassTeacherRequest): Promise<ApiResponse> {
    try {
      const json = request.toJson();

      const response = await apiClient.put<ApiResponse>(apiEndpoints.classTeacher.update, json);

      const apiResponse = response.data;

      if (!apiResponse || !apiResponse.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch ClassTeacher info');
    }
  }
}
