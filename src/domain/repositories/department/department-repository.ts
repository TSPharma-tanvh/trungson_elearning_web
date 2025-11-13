import { type ApiResponse } from '@/domain/models/core/api-response';
import { type SyncDepartmentFromHrmRequest } from '@/domain/models/department/request/sync-department-from-hrm-request';

export interface DepartmentRepository {
  // getDepartmentListInfo: (request: GetDepartmentRequest) => Promise<ApiPaginationResponse>;

  // getDepartmentById: (id: string) => Promise<ApiResponse>;

  // getDepartmentFromHrm: (request: GetDepartmentFromHrmRequest) => Promise<ApiResponse>;

  // syncDepartmentFromHrm: (request: SyncDepartmentFromHrmRequest) => Promise<ApiResponse>;

  syncDepartmentFromHrm: (request: SyncDepartmentFromHrmRequest) => Promise<ApiResponse>;

  // deleteDepartment: (id: string) => Promise<ApiResponse>;
}
