import type * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { GetEnrollmentCriteriaRequest } from '@/domain/models/enrollment/request/get-enrollment-criteria-request';
import { type EnrollmentCriteriaDetailResponse } from '@/domain/models/enrollment/response/enrollment-criteria-detail-response';
import { type EnrollmentCriteriaListResult } from '@/domain/models/enrollment/response/enrollment-criteria-result';
import { type EnrollmentUsecase } from '@/domain/usecases/enrollment/enrollment-usecase';
import { type CategoryEnum, type StatusEnum } from '@/utils/enum/core-enum';

import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';

interface UseEnrollmentSelectLoaderProps {
  enrollmentUsecase: EnrollmentUsecase | null;
  isOpen: boolean;
  categoryEnum: CategoryEnum;
  disableStatus?: StatusEnum;
}

interface EnrollmentSelectLoaderState {
  enrollments: EnrollmentCriteriaDetailResponse[];
  loadingEnrollments: boolean;
  hasMore: boolean;
  isSelectOpen: boolean;
  pageNumber: number;
  totalPages: number;
  listRef: React.RefObject<HTMLUListElement>;
  setIsSelectOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loadEnrollments: (page: number, reset?: boolean) => Promise<void>;
  setDisableStatus: React.Dispatch<React.SetStateAction<StatusEnum | undefined>>;
  disableStatus: StatusEnum | undefined;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
}

export function useEnrollmentSelectLoader({
  enrollmentUsecase,
  isOpen,
  categoryEnum,
  disableStatus: initialDisableStatus,
}: UseEnrollmentSelectLoaderProps): EnrollmentSelectLoaderState {
  const [enrollments, setEnrollments] = useState<EnrollmentCriteriaDetailResponse[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [disableStatus, setDisableStatus] = useState<StatusEnum | undefined>(initialDisableStatus);
  const listRef = useRef<HTMLUListElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [searchText, setSearchText] = useState('');

  const loadEnrollments = async (page: number, reset = false) => {
    if (!enrollmentUsecase || loadingEnrollments || !isOpen) return;

    setLoadingEnrollments(true);

    abortControllerRef.current = new AbortController();

    try {
      const request = new GetEnrollmentCriteriaRequest({
        targetType: categoryEnum,
        disableStatus: disableStatus !== undefined ? disableStatus : undefined,
        searchText,
        pageNumber: page,
        pageSize: 10,
      });

      const result: EnrollmentCriteriaListResult = await enrollmentUsecase.getEnrollmentList(request);

      if (isOpen) {
        setEnrollments((prev) => (reset || page === 1 ? result.enrollments : [...prev, ...result.enrollments]));
        setHasMore(
          result.enrollments.length > 0 && result.totalRecords > enrollments.length + result.enrollments.length
        );
        setTotalPages(Math.ceil(result.totalRecords / 10));
        setPageNumber(page);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error has occurred.';
      CustomSnackBar.showSnackbar(message, 'error');
    } finally {
      if (isOpen) setLoadingEnrollments(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setEnrollments([]);
      setPageNumber(1);
      setTotalPages(1);
      setHasMore(true);
      void loadEnrollments(1, true);
      setIsSelectOpen(false);
    }

    return () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
      setEnrollments([]);
      setPageNumber(1);
      setTotalPages(1);
      setHasMore(true);
      setIsSelectOpen(false);
    };
  }, [isOpen, disableStatus]);

  return {
    enrollments,
    loadingEnrollments,
    hasMore,
    isSelectOpen,
    pageNumber,
    totalPages,
    listRef,
    setIsSelectOpen,
    loadEnrollments,
    setDisableStatus,
    disableStatus,
    searchText,
    setSearchText,
  };
}
