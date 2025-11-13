import { type CreateAttendanceRecordsRequest } from '@/domain/models/attendance/request/create-attendance-records-request';
import { type CreateAttendanceReportRequest } from '@/domain/models/attendance/request/create-attendance-report-request';
import { type EnrollUserListToClassRequest } from '@/domain/models/attendance/request/enroll-user-to-class-request';
import { type GetAttendanceRecordsRequest } from '@/domain/models/attendance/request/get-attendance-records-request';
import { type UpdateAttendanceRecordsRequest } from '@/domain/models/attendance/request/update-attendance-records-request';
import { type ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';

export interface AttendanceRecordsRepository {
  getAttendanceRecordsListInfo: (request: GetAttendanceRecordsRequest) => Promise<ApiPaginationResponse>;

  getAttendanceRecordsById: (id: string) => Promise<ApiResponse>;

  createAttendanceRecords: (request: CreateAttendanceRecordsRequest) => Promise<ApiResponse>;

  updateAttendanceRecords: (request: UpdateAttendanceRecordsRequest) => Promise<ApiResponse>;

  deleteAttendanceRecords: (id: string) => Promise<ApiResponse>;

  enrollUserListToClass: (request: EnrollUserListToClassRequest) => Promise<ApiResponse>;

  createAttendanceReport: (request: CreateAttendanceReportRequest) => Promise<ApiResponse>;
}
