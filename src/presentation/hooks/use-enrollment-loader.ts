import type * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { GetEnrollmentCriteriaRequest } from '@/domain/models/enrollment/request/get-enrollment-criteria-request';
import type { EnrollmentCriteriaDetailResponse } from '@/domain/models/enrollment/response/enrollment-criteria-detail-response';
import type { EnrollmentCriteriaListResult } from '@/domain/models/enrollment/response/enrollment-criteria-result';
import type { EnrollmentUsecase } from '@/domain/usecases/enrollment/enrollment-usecase';
import type { CategoryEnum } from '@/utils/enum/core-enum';

import CustomSnackBar from '../components/core/snack-bar/custom-snack-bar';

interface UseEnrollmentLoaderProps {
  categoryUsecase: EnrollmentUsecase | null;
  isOpen: boolean;
  categoryEnum: CategoryEnum;
}

interface CategoryLoaderState {
  categories: EnrollmentCriteriaDetailResponse[];
  loadingCategories: boolean;
  hasMore: boolean;
  isSelectOpen: boolean;
  pageNumber: number;
  hasOverflow: boolean;
  listRef: React.RefObject<HTMLUListElement>;
  handleScroll: (event: React.UIEvent<HTMLUListElement>) => void;
  setIsSelectOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useEnrollmentLoader({
  categoryUsecase,
  isOpen,
  categoryEnum,
}: UseEnrollmentLoaderProps): CategoryLoaderState {
  const [categories, setCategories] = useState<EnrollmentCriteriaDetailResponse[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [initialRenderDone, setInitialRenderDone] = useState(false);
  const listRef = useRef<HTMLUListElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadCategories = useCallback(
    async (page: number): Promise<void> => {
      if (!categoryUsecase || loadingCategories || !isOpen) {
        return;
      }

      setLoadingCategories(true);
      abortControllerRef.current = new AbortController();

      try {
        const request = new GetEnrollmentCriteriaRequest({
          targetType: categoryEnum,
          pageNumber: page,
          pageSize: 10,
        });

        const result: EnrollmentCriteriaListResult = await categoryUsecase.getEnrollmentList(request);

        if (isOpen) {
          const enrollments = result.enrollments.filter(
            (item): item is EnrollmentCriteriaDetailResponse =>
              typeof item === 'object' &&
              item !== null &&
              'targetType' in item &&
              typeof (item as EnrollmentCriteriaDetailResponse).toJson === 'function'
          );

          setCategories((prev) => (page === 1 ? enrollments : [...prev, ...enrollments]));

          setHasMore(
            result.enrollments.length > 0 &&
              result.totalRecords > (page === 1 ? 0 : categories.length + result.enrollments.length)
          );

          setPageNumber(page);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        CustomSnackBar.showSnackbar(message, 'error');
      } finally {
        if (isOpen) {
          setLoadingCategories(false);
        }
      }
    },
    [categoryUsecase, loadingCategories, isOpen, categoryEnum, categories.length]
  );

  useEffect(() => {
    if (isOpen) {
      void loadCategories(1);
      if (!initialRenderDone) {
        setIsSelectOpen(false);
      }
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      setCategories([]);
      setPageNumber(1);
      setHasMore(true);
      setHasOverflow(false);
      setIsSelectOpen(false);
      setInitialRenderDone(false);
    };
  }, [isOpen, categoryEnum, loadCategories, initialRenderDone]);

  useEffect(() => {
    if (loadingCategories || !hasMore || hasOverflow || !isOpen) return;

    const checkOverflow = (): void => {
      if (!isOpen) return;

      if (!initialRenderDone) {
        setInitialRenderDone(true);
        setIsSelectOpen(false);
      }

      const listElement = listRef.current;
      if (listElement) {
        const { scrollHeight, clientHeight } = listElement;
        const isOverflowing = scrollHeight > clientHeight;
        setHasOverflow(isOverflowing);

        if (!isOverflowing && hasMore) {
          void loadCategories(pageNumber + 1);
        }
      }
    };

    const timer = setTimeout(checkOverflow, 100);

    const resizeObserver = new ResizeObserver(checkOverflow);
    const currentListRef = listRef.current;
    if (currentListRef) {
      resizeObserver.observe(currentListRef);
    }

    return () => {
      clearTimeout(timer);
      if (currentListRef) {
        resizeObserver.unobserve(currentListRef);
      }
    };
  }, [categories, loadingCategories, hasMore, hasOverflow, initialRenderDone, isOpen, pageNumber, loadCategories]);

  const handleScroll = (event: React.UIEvent<HTMLUListElement>): void => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore && !loadingCategories && isOpen) {
      void loadCategories(pageNumber + 1);
    }
  };

  return {
    categories,
    loadingCategories,
    hasMore,
    isSelectOpen,
    pageNumber,
    hasOverflow,
    listRef,
    handleScroll,
    setIsSelectOpen,
  };
}
