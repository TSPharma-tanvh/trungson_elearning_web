import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { ApiResponse } from '@/domain/models/core/api-response';
import { CreateRoleRequest } from '@/domain/models/role/request/create-role-request';
import { GetRoleRequest } from '@/domain/models/role/request/get-role-request';
import { UpdateRoleRequest } from '@/domain/models/role/request/update-role-request';
import { PermissionResponse } from '@/domain/models/role/response/permission-reponse';
import { RoleResponse } from '@/domain/models/role/response/role-response';
import { UserRoleResult } from '@/domain/models/role/response/role-result';
import { RoleRepository } from '@/domain/repositories/role/role-repository';

export class RoleUsecase {
  constructor(private readonly roleRepo: RoleRepository) {}

  async getAllRoles(request: GetRoleRequest): Promise<UserRoleResult> {
    const result: ApiPaginationResponse = await this.roleRepo.getAllRoles(request);

    if (!result || !Array.isArray(result.result)) {
      throw new Error('Failed to load role list.');
    }

    const data = result.result.map(RoleResponse.fromJSON);

    return {
      roles: data,
      totalRecords: result.totalRecords ?? result.result.length,
      pageSize: result.pageSize ?? request.pageSize,
      pageNumber: result.pageNumber ?? request.pageNumber,
    };
  }

  async getAllPermission(): Promise<PermissionResponse[]> {
    const result: ApiPaginationResponse = await this.roleRepo.getAllPermissions();

    if (!result || !Array.isArray(result.result)) {
      throw new Error('Failed to load permission list.');
    }

    return result.result.map((item: any) => PermissionResponse.fromJSON(item));
  }

  async createRole(request: CreateRoleRequest): Promise<ApiResponse> {
    const result: ApiResponse = await this.roleRepo.createRole(request);

    return result;
  }

  async updateRole(id: string, request: UpdateRoleRequest): Promise<ApiResponse> {
    const result: ApiResponse = await this.roleRepo.updateRole(id, request);

    return result;
  }

  async deleteRole(id: string): Promise<ApiResponse> {
    const result: ApiPaginationResponse = await this.roleRepo.deleteRole(id);

    return result;
  }
}
