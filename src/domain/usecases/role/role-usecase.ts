import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { GetRoleRequest } from '@/domain/models/role/request/get-role-request';
import { RoleResponse } from '@/domain/models/role/response/role-response';
import { RoleRepository } from '@/domain/repositories/role/role-repository';

export class RoleUsecase {
  constructor(private readonly roleRepo: RoleRepository) {}

  async getAllRoles(request: GetRoleRequest): Promise<RoleResponse[]> {
    const result: ApiPaginationResponse = await this.roleRepo.getAllRoles(request);

    if (!result || !Array.isArray(result.result)) {
      throw new Error('Failed to load role list.');
    }

    return result.result.map(RoleResponse.fromJSON);
  }
}
