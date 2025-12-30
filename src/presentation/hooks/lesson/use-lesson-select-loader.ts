import { useCallback, useEffect, useRef, useState } from 'react';
import { GetLessonRequest } from '@/domain/models/lessons/request/get-lesson-request';
import type { LessonDetailResponse } from '@/domain/models/lessons/response/lesson-detail-response';
import type { LessonDetailListResult } from '@/domain/models/lessons/response/lesson-detail-result';
import type { LessonUsecase } from '@/domain/usecases/lessons/lesson-usecase';
import type { LessonContentEnum, LessonTypeEnum, StatusEnum } from '@/utils/enum/core-enum';

import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';

interface LessonFilters {
  lessonType?: LessonTypeEnum;
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
  pageNumber: number;
  totalPages: number;
  listRef: React.RefObject<HTMLUListElement>;
  loadLessons: (page: number, reset?: boolean) => Promise<void>;
}

export function useLessonSelectLoader({
  lessonUsecase,
  isOpen,
  searchText = '',
  filters = {},
}: UseLessonSelectLoaderProps): LessonSelectLoaderState {
  const [lessons, setLessons] = useState<LessonDetailResponse[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingLessons, setLoadingLessons] = useState(false);

  const listRef = useRef<HTMLUListElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadLessons = useCallback(
    async (page: number, reset = false) => {
      if (!lessonUsecase || !isOpen) return;

      setLoadingLessons(true);
      abortControllerRef.current?.abort();
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

        setLessons((prev) => (reset || page === 1 ? result.lessons : [...prev, ...result.lessons]));
        setPageNumber(page);
        setTotalPages(Math.ceil(result.totalRecords / 10));
      } catch (error) {
        CustomSnackBar.showSnackbar(error instanceof Error ? error.message : 'Failed to load lessons', 'error');
      } finally {
        setLoadingLessons(false);
      }
    },
    [lessonUsecase, isOpen, searchText, filters]
  );

  useEffect(() => {
    if (!isOpen) return;

    setLessons([]);
    setPageNumber(1);
    setTotalPages(1);
    void loadLessons(1, true);

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [isOpen, searchText, filters, loadLessons]);

  return {
    lessons,
    loadingLessons,
    pageNumber,
    totalPages,
    listRef,
    loadLessons,
  };
}
