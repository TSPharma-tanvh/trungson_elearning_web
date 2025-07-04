import { useEffect, useRef, useState } from 'react';
import { GetUserRequest } from '@/domain/models/user/request/get-user-request';
import { UserListResult } from '@/domain/models/user/response/user-list-result';
import { UserResponse } from '@/domain/models/user/response/user-response';
import { UserUsecase } from '@/domain/usecases/user/user-usecase';
import { DisplayTypeEnum, LearningModeEnum, ScheduleStatusEnum, StatusEnum } from '@/utils/enum/core-enum';

interface UseUserSelectLoaderProps {
  userUsecase: UserUsecase | null;
  roles: string[];
  isOpen: boolean;
  searchText?: string;
}

interface UserSelectLoaderState {
  users: UserResponse[];
  loadingUsers: boolean;
  hasMore: boolean;
  isSelectOpen: boolean;
  pageNumber: number;
  totalPages: number;
  listRef: React.RefObject<HTMLUListElement>;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  searchText: string;
  setRoles: React.Dispatch<React.SetStateAction<string[]>>;
  roles: string[];
  loadUsers: (page: number, reset?: boolean) => Promise<void>;
}

export function useUserSelectLoader({
  userUsecase,
  isOpen,
  roles: initialRoles = [],
  searchText: initialSearchText = '',
}: UseUserSelectLoaderProps): UserSelectLoaderState {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchText, setSearchText] = useState(initialSearchText);
  const [roles, setRoles] = useState(initialRoles);

  const listRef = useRef<HTMLUListElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadUsers = async (page: number, reset: boolean = false) => {
    if (!userUsecase || loadingUsers || !isOpen) return;

    setLoadingUsers(true);
    abortControllerRef.current = new AbortController();

    try {
      const request = new GetUserRequest({
        roles: roles,
        searchTerm: searchText || undefined,
        pageNumber: page,
        pageSize: 10,
      });

      const result: UserListResult = await userUsecase.getUserListInfo(request);
      if (isOpen) {
        setUsers((prev) => (reset || page === 1 ? result.users : [...prev, ...result.users]));
        setHasMore(result.users.length > 0 && result.totalRecords > users.length + result.users.length);
        setTotalPages(Math.ceil(result.totalRecords / 10));
        setPageNumber(page);
      }
    } catch (error) {
      console.error('Error loading Users:', error);
    } finally {
      if (isOpen) setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setUsers([]);
      setPageNumber(1);
      setTotalPages(1);
      setHasMore(true);
      loadUsers(1, true);
    }

    return () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
      setUsers([]);
      setPageNumber(1);
      setTotalPages(1);
      setHasMore(true);
      setIsSelectOpen(false);
    };
  }, [isOpen, searchText, roles]);

  return {
    users,
    loadingUsers,
    hasMore,
    isSelectOpen,
    pageNumber,
    totalPages,
    listRef,
    setSearchText,
    searchText,
    setRoles,
    roles,
    loadUsers,
  };
}
