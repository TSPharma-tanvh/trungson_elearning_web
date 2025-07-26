import { type UserResponse } from './user-response';

export interface UserListResult {
  users: UserResponse[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}
