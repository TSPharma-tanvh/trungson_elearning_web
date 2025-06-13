export interface GetUserRequest {
  userId?: string;
  userName?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
  searchTerm?: string;
  pageNumber: number;
  pageSize: number;
}

export function getUserRequestFromJSON(json: any): GetUserRequest {
  return {
    userId: json?.userId ?? undefined,
    userName: json?.userName ?? undefined,
    email: json?.email ?? undefined,
    firstName: json?.firstName ?? undefined,
    lastName: json?.lastName ?? undefined,
    roles: Array.isArray(json?.roles) ? json.roles : [],
    searchTerm: json?.searchTerm ?? undefined,
    pageNumber: json?.pageNumber ?? 1,
    pageSize: json?.pageSize ?? 10,
  };
}

export function getUserRequestToJSON(dto: GetUserRequest): any {
  return {
    userId: dto.userId,
    userName: dto.userName,
    email: dto.email,
    firstName: dto.firstName,
    lastName: dto.lastName,
    roles: dto.roles,
    searchTerm: dto.searchTerm,
    pageNumber: dto.pageNumber,
    pageSize: dto.pageSize,
  };
}
