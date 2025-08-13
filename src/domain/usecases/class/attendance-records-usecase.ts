import { type CreateAttendanceRecordsRequest } from '@/domain/models/attendance/request/create-attendance-records-request';
import { type EnrollUserListToClassRequest } from '@/domain/models/attendance/request/enroll-user-to-class-request';
import { type GetAttendanceRecordsRequest } from '@/domain/models/attendance/request/get-attendance-records-request';
import { UpdateAttendanceRecordsRequest } from '@/domain/models/attendance/request/update-attendance-records-request';
import { AttendanceRecordDetailResponse } from '@/domain/models/attendance/response/attendance-record-detail-response';
import { type AttendanceRecordsListResult } from '@/domain/models/attendance/response/attendance-record-result';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type AttendanceRecordsRepository } from '@/domain/repositories/class/attendance-repository';
import { CheckinTimeEnum } from '@/utils/enum/core-enum';

export class AttendanceRecordsUsecase {
  constructor(private readonly AttendanceRecordsRepo: AttendanceRecordsRepository) {}

  async getAttendanceRecordsListInfo(request: GetAttendanceRecordsRequest): Promise<AttendanceRecordsListResult> {
    const result = await this.AttendanceRecordsRepo.getAttendanceRecordsListInfo(request);

    if (!result || !Array.isArray(result.result)) {
      throw new Error('Failed to load user list.');
    }

    // const data = result.result.map(AttendanceRecordDetailResponse.fromJson);
    const data = result.result.map((x) => AttendanceRecordDetailResponse.fromJson(x));

    return {
      records: data,
      totalRecords: result.totalRecords ?? result.result.length,
      pageSize: result.pageSize ?? request.pageSize,
      pageNumber: result.pageNumber ?? request.pageNumber,
    };
  }

  async getAttendanceRecordsById(id: string): Promise<AttendanceRecordDetailResponse> {
    if (id === null || id === undefined || id.trim() === '') {
      throw new Error('ID is missing.');
    }

    const result = await this.AttendanceRecordsRepo.getAttendanceRecordsById(id);

    const userResponse = AttendanceRecordDetailResponse.fromJson(result.result);

    return userResponse;
  }

  async createAttendanceRecords(request: CreateAttendanceRecordsRequest): Promise<ApiResponse> {
    const response = await this.AttendanceRecordsRepo.createAttendanceRecords(request);

    return response;
  }

  async updateAttendanceRecords(request: UpdateAttendanceRecordsRequest): Promise<ApiResponse> {
    const result = await this.AttendanceRecordsRepo.updateAttendanceRecords(request);

    return result;
  }

  async deleteAttendanceRecords(id: string): Promise<ApiResponse> {
    const result = await this.AttendanceRecordsRepo.deleteAttendanceRecords(id);
    return result;
  }

  async enrollUserListToClass(request: EnrollUserListToClassRequest): Promise<ApiResponse> {
    const response = await this.AttendanceRecordsRepo.enrollUserListToClass(request);

    return response;
  }
}
