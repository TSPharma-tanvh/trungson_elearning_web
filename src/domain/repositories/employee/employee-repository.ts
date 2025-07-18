import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { ApiResponse } from '@/domain/models/core/api-response';
import { GetEmployeeFromHrmRequest } from '@/domain/models/employee/request/get-employee-from-hrm-request';
import { GetEmployeeRequest } from '@/domain/models/employee/request/get-employee-request';
import { SyncEmployeeFromHrmRequest } from '@/domain/models/employee/request/sync-employee-from-hrm-request';

export interface EmployeeRepository {
  getEmployeeListInfo(request: GetEmployeeRequest): Promise<ApiPaginationResponse>;

  getEmployeeById(id: string): Promise<ApiResponse>;

  getEmployeeFromHrm(request: GetEmployeeFromHrmRequest): Promise<ApiResponse>;

  syncEmployeeFromHrm(request: SyncEmployeeFromHrmRequest): Promise<ApiResponse>;

  deleteEmployee(id: string): Promise<ApiResponse>;
}
