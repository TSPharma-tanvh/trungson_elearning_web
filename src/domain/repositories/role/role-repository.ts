import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { GetRoleRequest } from '@/domain/models/role/request/get-role-request';

export interface RoleRepository {
  getAllRoles(request: GetRoleRequest): Promise<ApiPaginationResponse>;
}
