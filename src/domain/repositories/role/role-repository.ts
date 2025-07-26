import { type ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type CreateRoleRequest } from '@/domain/models/role/request/create-role-request';
import { type GetRoleRequest } from '@/domain/models/role/request/get-role-request';
import { type UpdateRoleRequest } from '@/domain/models/role/request/update-role-request';

export interface RoleRepository {
  getAllRoles: (request: GetRoleRequest) => Promise<ApiPaginationResponse>;

  getAllPermissions: () => Promise<ApiResponse>;

  createRole: (request: CreateRoleRequest) => Promise<ApiResponse>;

  updateRole: (id: string, request: UpdateRoleRequest) => Promise<ApiResponse>;

  deleteRole: (id: string) => Promise<ApiResponse>;
}
