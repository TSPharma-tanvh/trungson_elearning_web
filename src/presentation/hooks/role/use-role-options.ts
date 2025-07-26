import { useCallback, useEffect, useRef, useState } from 'react';
import { GetRoleRequest } from '@/domain/models/role/request/get-role-request';
import { type RoleResponse } from '@/domain/models/role/response/role-response';
import { type RoleUsecase } from '@/domain/usecases/role/role-usecase';

const DEFAULT_PAGE_SIZE = 20;

export function useRoleOptions(roleUsecase: RoleUsecase) {
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const isFetchingRef = useRef(false);

  const loadMoreRoles = useCallback(async () => {
    if (loading || !hasMore || isFetchingRef.current) return;

    isFetchingRef.current = true;
    setLoading(true);

    try {
      const request = new GetRoleRequest({ pageNumber: page, pageSize: DEFAULT_PAGE_SIZE });
      const result = await roleUsecase.getAllRoles(request);

      if (result.roles.length === 0) {
        setHasMore(false);
      } else {
        setRoles((prev) => [...prev, ...result.roles]);
        const totalPages = Math.ceil(result.totalRecords / result.pageSize);
        setHasMore(page < totalPages);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      setHasMore(false);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [page, loading, hasMore, roleUsecase]);

  useEffect(() => {
    void loadMoreRoles();
  }, []);

  return {
    roleOptions: roles.map((r) => ({ label: r.name, value: r.name })),
    loadMoreRoles,
    hasMore,
    loading,
  };
}
