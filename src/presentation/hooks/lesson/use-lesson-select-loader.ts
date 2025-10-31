import type * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { GetLessonRequest } from '@/domain/models/lessons/request/get-lesson-request';
import type { LessonDetailResponse } from '@/domain/models/lessons/response/lesson-detail-response';
import type { LessonDetailListResult } from '@/domain/models/lessons/response/lesson-detail-result';
import type { LessonUsecase } from '@/domain/usecases/lessons/lesson-usecase';
import type { LearningModeEnum, LessonContentEnum, StatusEnum } from '@/utils/enum/core-enum';

import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';

interface LessonFilters {
  lessonType?: LearningModeEnum;
  disableStatus?: StatusEnum;
  contentType?: LessonContentEnum;
  status?: StatusEnum;
  hasVideo?: boolean;
  hasFileResource?: boolean;
  hasCourse?: boolean;
}

interface UseLessonSelectLoaderProps {
  lessonUsecase: LessonUsecase | null;
  isOpen: boolean;
  searchText?: string;
  filters?: LessonFilters;
}

interface LessonSelectLoaderState {
  lessons: LessonDetailResponse[];
  loadingLessons: boolean;
  hasMore: boolean;
  isSelectOpen: boolean;
  pageNumber: number;
  totalPages: number;
  listRef: React.RefObject<HTMLUListElement>;
  setIsSelectOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  searchText: string;
  loadLessons: (page: number, reset?: boolean) => Promise<void>;
}

export function useLessonSelectLoader({
  lessonUsecase,
  isOpen,
  searchText: initialSearchText = '',
  filters = {},
}: UseLessonSelectLoaderProps): LessonSelectLoaderState {
  const [lessons, setLessons] = useState<LessonDetailResponse[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchText, setSearchText] = useState(initialSearchText);
  const listRef = useRef<HTMLUListElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadLessons = useCallback(
    async (page: number, reset = false): Promise<void> => {
      if (!lessonUsecase || loadingLessons || !isOpen) return;

      setLoadingLessons(true);
      abortControllerRef.current = new AbortController();

      try {
        const request = new GetLessonRequest({
          searchText: searchText || undefined,
          status: filters.status,
          lessonType: filters.lessonType,
          contentType: filters.contentType,
          hasVideo: filters.hasVideo,
          hasFileResource: filters.hasFileResource,
          hasCourse: filters.hasCourse,

          pageNumber: page,
          pageSize: 10,
        });

        const result: LessonDetailListResult = await lessonUsecase.getLessonListInfo(request);
        if (isOpen) {
          setLessons((prev: LessonDetailResponse[]) => {
            const newLessons = reset || page === 1 ? result.Lessons : [...prev, ...result.Lessons];
            setHasMore(result.Lessons.length > 0 && result.totalRecords > newLessons.length);
            return newLessons;
          });
          setTotalPages(Math.ceil(result.totalRecords / 10));
          setPageNumber(page);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load lessons.';
        CustomSnackBar.showSnackbar(message, 'error');
      } finally {
        if (isOpen) setLoadingLessons(false);
      }
    },
    [lessonUsecase, isOpen, searchText, filters]
  );

  useEffect(() => {
    if (isOpen) {
      setLessons([]);
      setPageNumber(1);
      setTotalPages(1);
      setHasMore(true);
      void loadLessons(1, true);
      setIsSelectOpen(false);
    }

    return () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
      setLessons([]);
      setPageNumber(1);
      setTotalPages(1);
      setHasMore(true);
      setIsSelectOpen(false);
    };
  }, [isOpen, filters, searchText, loadLessons]);

  return {
    lessons,
    loadingLessons,
    hasMore,
    isSelectOpen,
    pageNumber,
    totalPages,
    listRef,
    setIsSelectOpen,
    setSearchText,
    searchText,
    loadLessons,
  };
}
