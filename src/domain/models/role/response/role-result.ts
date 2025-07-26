import { type RoleResponse } from './role-response';

export interface UserRoleResult {
  roles: RoleResponse[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}
