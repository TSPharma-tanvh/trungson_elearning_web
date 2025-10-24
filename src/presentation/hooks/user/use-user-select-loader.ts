import type * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { GetUserRequest } from '@/domain/models/user/request/get-user-request';
import { type UserListResult } from '@/domain/models/user/response/user-list-result';
import { type UserResponse } from '@/domain/models/user/response/user-response';
import { type UserUsecase } from '@/domain/usecases/user/user-usecase';

import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';

interface UseUserSelectLoaderProps {
  userUsecase: UserUsecase | null;
  roles: string[];
  isOpen: boolean;
  searchText?: string;
  isActive?: boolean;
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
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  loadUsers: (page: number, reset?: boolean) => Promise<void>;
}

export function useUserSelectLoader({
  userUsecase,
  isOpen,
  roles: initialRoles = [],
  isActive: initialIsActive = true,
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
  const [isActive, setIsActive] = useState(initialIsActive);

  const listRef = useRef<HTMLUListElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadUsers = async (page: number, reset = false) => {
    if (!userUsecase || loadingUsers || !isOpen) return;

    setLoadingUsers(true);
    abortControllerRef.current = new AbortController();

    try {
      const request = new GetUserRequest({
        roles,
        searchTerm: searchText || undefined,
        isActive: isActive,
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
      const message = error instanceof Error ? error.message : 'An error has occurred.';
      CustomSnackBar.showSnackbar(message, 'error');
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
      void loadUsers(1, true);
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
    isActive,
    setIsActive,
  };
}
