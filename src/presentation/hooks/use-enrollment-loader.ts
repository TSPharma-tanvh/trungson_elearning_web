import { useEffect, useRef, useState } from 'react';
import { GetCategoryRequest } from '@/domain/models/category/request/get-category-request';
import { CategoryResponse } from '@/domain/models/category/response/category-response';
import { CategoryListResult } from '@/domain/models/category/response/category-result';
import { EnrollmentCriteriaResponse } from '@/domain/models/criteria/response/enrollment-criteria-response';
import { GetEnrollmentCriteriaRequest } from '@/domain/models/enrollment/request/get-enrollment-criteria-request';
import { EnrollmentCriteriaListResult } from '@/domain/models/enrollment/response/enrollment-criteria-result';
import { CategoryUsecase } from '@/domain/usecases/category/category-usecase';
import { EnrollmentUsecase } from '@/domain/usecases/enrollment/enrollment-usecase';
import { CategoryEnum, CategoryEnumUtils } from '@/utils/enum/core-enum';

interface UseEnrollmentLoaderProps {
  categoryUsecase: EnrollmentUsecase | null;
  isOpen: boolean;
  categoryEnum: CategoryEnum;
}

interface CategoryLoaderState {
  categories: EnrollmentCriteriaResponse[];
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
  const [categories, setCategories] = useState<EnrollmentCriteriaResponse[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [initialRenderDone, setInitialRenderDone] = useState(false);
  const listRef = useRef<HTMLUListElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadCategories = async (page: number) => {
    if (!categoryUsecase || loadingCategories || !isOpen) {
      console.error('CategoryUsecase missing or already loading:', { categoryUsecase, loadingCategories, isOpen });
      return;
    }

    setLoadingCategories(true);
    abortControllerRef.current = new AbortController();
    try {
      const request = new GetEnrollmentCriteriaRequest({
        targetType: CategoryEnumUtils.getCategoryKeyFromValue(categoryEnum), // Use dynamic categoryEnum
        pageNumber: page,
        pageSize: 10,
      });
      const result: EnrollmentCriteriaListResult = await categoryUsecase.getEnrollmentList(request);
      if (isOpen) {
        setCategories((prev) => (page === 1 ? result.enrollments : [...prev, ...result.enrollments]));
        setHasMore(
          result.enrollments.length > 0 && result.totalRecords > categories.length + result.enrollments.length
        );
        setPageNumber(page);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      if (isOpen) {
        setLoadingCategories(false);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadCategories(1);
      if (!initialRenderDone) {
        setIsSelectOpen(false); //Select menu to open automatically
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
  }, [isOpen, categoryEnum]);

  useEffect(() => {
    if (loadingCategories || !hasMore || hasOverflow || !isOpen) return;

    const checkOverflow = () => {
      if (!isOpen) return;

      if (!initialRenderDone) {
        setInitialRenderDone(true);
        setIsSelectOpen(false);
      }

      if (listRef.current) {
        const { scrollHeight, clientHeight } = listRef.current;
        const isOverflowing = scrollHeight > clientHeight;
        setHasOverflow(isOverflowing);
        console.log('Overflow check:', { scrollHeight, clientHeight, isOverflowing, pageNumber });

        if (!isOverflowing && hasMore) {
          loadCategories(pageNumber + 1);
        }
      }
    };

    const timer = setTimeout(checkOverflow, 100);
    const resizeObserver = new ResizeObserver(checkOverflow);
    if (listRef.current) {
      resizeObserver.observe(listRef.current);
    }

    return () => {
      clearTimeout(timer);
      if (listRef.current) {
        resizeObserver.unobserve(listRef.current);
      }
    };
  }, [categories, loadingCategories, hasMore, hasOverflow, initialRenderDone, isOpen, pageNumber]);

  const handleScroll = (event: React.UIEvent<HTMLUListElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore && !loadingCategories && isOpen) {
      loadCategories(pageNumber + 1);
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
