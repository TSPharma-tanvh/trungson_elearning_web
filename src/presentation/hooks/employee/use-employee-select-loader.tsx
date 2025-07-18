import { useEffect, useRef, useState } from 'react';
import { GetEmployeeRequest } from '@/domain/models/employee/request/get-employee-request';
import { EmployeeResponse } from '@/domain/models/employee/response/employee-response';
import { EmployeeListResult } from '@/domain/models/employee/response/employee-result';
import { EmployeeUsecase } from '@/domain/usecases/employee/employee-usecase';





interface UseEmployeeSelectLoaderProps {
  employeeUsecase: EmployeeUsecase | null;
  isOpen: boolean;
  searchText?: string;
}

interface EmployeeSelectLoaderState {
  employees: EmployeeResponse[];
  loadingEmployees: boolean;
  hasMore: boolean;
  isSelectOpen: boolean;
  pageNumber: number;
  totalPages: number;
  listRef: React.RefObject<HTMLUListElement>;
  setIsSelectOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  searchText: string;
  loadEmployees: (page: number, reset?: boolean) => Promise<void>;
}

export function useEmployeeSelectLoader({
  employeeUsecase,
  isOpen,
  searchText: initialSearchText = '',
}: UseEmployeeSelectLoaderProps): EmployeeSelectLoaderState {
  const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchText, setSearchText] = useState(initialSearchText);

  const listRef = useRef<HTMLUListElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadEmployees = async (page: number, reset: boolean = false) => {
    if (!employeeUsecase || loadingEmployees || !isOpen) return;

    setLoadingEmployees(true);
    abortControllerRef.current = new AbortController();

    try {
      const request = new GetEmployeeRequest({
        name: searchText || undefined,
        pageNumber: page,
        pageSize: 10,
      });

      const result: EmployeeListResult = await employeeUsecase.getEmployeeListInfo(request);
      if (isOpen) {
        setEmployees((prev) => (reset || page === 1 ? result.employees : [...prev, ...result.employees]));
        setHasMore(result.employees.length > 0 && result.totalRecords > employees.length + result.employees.length);
        setTotalPages(Math.ceil(result.totalRecords / 10));
        setPageNumber(page);
      }
    } catch (error) {
      console.error('Error loading employees:', error);
    } finally {
      if (isOpen) setLoadingEmployees(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setEmployees([]);
      setPageNumber(1);
      setTotalPages(1);
      setHasMore(true);
      loadEmployees(1, true);
    }

    return () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
      setEmployees([]);
      setPageNumber(1);
      setTotalPages(1);
      setHasMore(true);
      setIsSelectOpen(false);
    };
  }, [isOpen, searchText]);

  return {
    employees,
    loadingEmployees,
    hasMore,
    isSelectOpen,
    pageNumber,
    totalPages,
    listRef,
    setIsSelectOpen,
    setSearchText,
    searchText,
    loadEmployees,
  };
}