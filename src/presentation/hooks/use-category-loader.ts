import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { GetCategoryRequest } from '@/domain/models/category/request/get-category-request';
import { type CategoryDetailResponse } from '@/domain/models/category/response/category-detail-response';
import { type CategoryListResult } from '@/domain/models/category/response/category-result';
import { type CategoryUsecase } from '@/domain/usecases/category/category-usecase';
import { CategoryEnumUtils, type CategoryEnum } from '@/utils/enum/core-enum';

import CustomSnackBar from '../components/core/snack-bar/custom-snack-bar';

interface UseCategoryLoaderProps {
  categoryUsecase: CategoryUsecase | null;
  isOpen: boolean;
  categoryEnum: CategoryEnum;
  searchText?: string;
}

interface CategoryLoaderState {
  categories: CategoryDetailResponse[];
  loadingCategories: boolean;
  hasMore: boolean;
  isSelectOpen: boolean;
  pageNumber: number;
  totalPages: number;
  listRef: React.RefObject<HTMLUListElement>;
  setIsSelectOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loadCategories: (page: number, reset?: boolean) => Promise<void>;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
}

export function useCategoryLoader({
  categoryUsecase,
  isOpen,
  categoryEnum,
  searchText: initialSearchText = '',
}: UseCategoryLoaderProps): CategoryLoaderState {
  const [categories, setCategories] = useState<CategoryDetailResponse[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const listRef = useRef<HTMLUListElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [searchText, setSearchText] = useState(initialSearchText);

  const loadCategories = async (page: number, reset = false) => {
    if (!categoryUsecase || loadingCategories || !isOpen) return;

    setLoadingCategories(true);
    abortControllerRef.current = new AbortController();

    try {
      const request = new GetCategoryRequest({
        category: CategoryEnumUtils.getCategoryKeyFromValue(categoryEnum),
        pageNumber: page,
        pageSize: 10,
        searchText: searchText || undefined,
      });

      const result: CategoryListResult = await categoryUsecase.getCategoryList(request);

      if (isOpen) {
        setCategories((prev) => (reset || page === 1 ? result.categories : [...prev, ...result.categories]));
        setHasMore(
          result.categories.length > 0 &&
            result.totalRecords > (reset ? result.categories.length : categories.length + result.categories.length)
        );
        setPageNumber(page);
        setTotalPages(Math.ceil(result.totalRecords / 10));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error has occurred.';
      CustomSnackBar.showSnackbar(message, 'error');
    } finally {
      if (isOpen) setLoadingCategories(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCategories([]);
      setPageNumber(1);
      setTotalPages(1);
      setHasMore(true);
      void loadCategories(1, true);
      setIsSelectOpen(false);
    }

    return () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
      setCategories([]);
      setPageNumber(1);
      setTotalPages(1);
      setHasMore(true);
      setIsSelectOpen(false);
    };
  }, [isOpen, categoryEnum, searchText]);

  return {
    categories,
    loadingCategories,
    hasMore,
    isSelectOpen,
    pageNumber,
    totalPages,
    listRef,
    setIsSelectOpen,
    loadCategories,
    searchText,
    setSearchText,
  };
}
