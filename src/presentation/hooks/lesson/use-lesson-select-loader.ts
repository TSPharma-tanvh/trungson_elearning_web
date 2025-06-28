import { useEffect, useRef, useState } from 'react';
import { GetLessonRequest } from '@/domain/lessons/request/get-lesson-request';
import { LessonDetailResponse } from '@/domain/lessons/response/lesson-detail-response';
import { LessonDetailListResult } from '@/domain/lessons/response/lesson-detail-result';
import { LessonUsecase } from '@/domain/usecases/lessons/lesson-usecase';
import { DisplayTypeEnum, LearningModeEnum, ScheduleStatusEnum, StatusEnum } from '@/utils/enum/core-enum';

interface UseLessonSelectLoaderProps {
  lessonUsecase: LessonUsecase | null;
  isOpen: boolean;
  disableStatus?: StatusEnum;
  lessonType?: LearningModeEnum;
  searchText?: string;
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
  setLessonType: React.Dispatch<React.SetStateAction<LearningModeEnum | undefined>>;
  setDisplayType: React.Dispatch<React.SetStateAction<DisplayTypeEnum | undefined>>;
  setScheduleStatus: React.Dispatch<React.SetStateAction<ScheduleStatusEnum | undefined>>;
  setDisableStatus: React.Dispatch<React.SetStateAction<StatusEnum | undefined>>;
  searchText: string;
  lessonType: LearningModeEnum | undefined;
  disableStatus: StatusEnum | undefined;
  loadLessons: (page: number, reset?: boolean) => Promise<void>;
}

export function useLessonSelectLoader({
  lessonUsecase,
  isOpen,
  disableStatus: initialDisableStatus,
  lessonType: initialLessonType,
  searchText: initialSearchText = '',
}: UseLessonSelectLoaderProps): LessonSelectLoaderState {
  const [lessons, setLessons] = useState<LessonDetailResponse[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const [searchText, setSearchText] = useState(initialSearchText);
  const [lessonType, setLessonType] = useState<LearningModeEnum | undefined>(initialLessonType);
  const [disableStatus, setDisableStatus] = useState<StatusEnum | undefined>(initialDisableStatus);

  const [displayType, setDisplayType] = useState<DisplayTypeEnum | undefined>();
  const [scheduleStatus, setScheduleStatus] = useState<ScheduleStatusEnum | undefined>();

  const listRef = useRef<HTMLUListElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadLessons = async (page: number, reset: boolean = false) => {
    if (!lessonUsecase || loadingLessons || !isOpen) return;

    setLoadingLessons(true);
    abortControllerRef.current = new AbortController();

    try {
      const request = new GetLessonRequest({
        name: searchText || undefined,
        status: disableStatus,
        lessonType: lessonType,
        pageNumber: page,
        pageSize: 10,
      });

      const result: LessonDetailListResult = await lessonUsecase.getLessonListInfo(request);
      if (isOpen) {
        setLessons((prev) => (reset || page === 1 ? result.Lessons : [...prev, ...result.Lessons]));
        setHasMore(result.Lessons.length > 0 && result.totalRecords > lessons.length + result.Lessons.length);
        setTotalPages(Math.ceil(result.totalRecords / 10));
        setPageNumber(page);
      }
    } catch (error) {
      console.error('Error loading Lessons:', error);
    } finally {
      if (isOpen) setLoadingLessons(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setLessons([]);
      setPageNumber(1);
      setTotalPages(1);
      setHasMore(true);
      loadLessons(1, true);
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
  }, [isOpen, searchText, disableStatus, lessonType]);

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
    setLessonType,
    setDisplayType,
    setScheduleStatus,
    setDisableStatus,
    searchText,
    lessonType,
    disableStatus,
    loadLessons,
  };
}
