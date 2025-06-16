import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { ApiResponse } from '@/domain/models/core/api-response';
import { CreateRoleRequest } from '@/domain/models/role/request/create-role-request';
import { GetRoleRequest } from '@/domain/models/role/request/get-role-request';
import { UpdateRoleRequest } from '@/domain/models/role/request/update-role-request';

export interface RoleRepository {
  getAllRoles(request: GetRoleRequest): Promise<ApiPaginationResponse>;

  getAllPermissions(): Promise<ApiResponse>;

  createRole(request: CreateRoleRequest): Promise<ApiResponse>;

  updateRole(id: string, request: UpdateRoleRequest): Promise<ApiResponse>;

  deleteRole(id: string): Promise<ApiResponse>;
}
