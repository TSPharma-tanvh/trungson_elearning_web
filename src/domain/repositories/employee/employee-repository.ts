import { type ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { GetEmployeeDistinctRequest } from '@/domain/models/employee/request/get-employee-distinct-request';
import { type GetEmployeeFromHrmRequest } from '@/domain/models/employee/request/get-employee-from-hrm-request';
import { type GetEmployeeRequest } from '@/domain/models/employee/request/get-employee-request';
import { type SyncEmployeeFromHrmRequest } from '@/domain/models/employee/request/sync-employee-from-hrm-request';

export interface EmployeeRepository {
  getEmployeeListInfo: (request: GetEmployeeRequest) => Promise<ApiPaginationResponse>;

  getEmployeeById: (id: string) => Promise<ApiResponse>;

  getEmployeeDistinct: (request: GetEmployeeDistinctRequest) => Promise<ApiResponse>;

  getEmployeeFromHrm: (request: GetEmployeeFromHrmRequest) => Promise<ApiResponse>;

  syncEmployeeFromHrm: (request: SyncEmployeeFromHrmRequest) => Promise<ApiResponse>;

  syncDepartmentFromHrm: (request: SyncEmployeeFromHrmRequest) => Promise<ApiResponse>;

  deleteEmployee: (id: string) => Promise<ApiResponse>;
}
