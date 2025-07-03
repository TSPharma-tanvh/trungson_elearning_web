import { useEffect, useRef, useState } from 'react';
import { GetClassRequest } from '@/domain/models/class/request/get-class-request';
import { ClassResponse } from '@/domain/models/class/response/class-response';
import { ClassListResult } from '@/domain/models/class/response/class-result';
import { ClassUsecase } from '@/domain/usecases/class/class-usecase';
import { DisplayTypeEnum, LearningModeEnum, ScheduleStatusEnum, StatusEnum } from '@/utils/enum/core-enum';

interface UseClassSelectLoaderProps {
  classUsecase: ClassUsecase | null;
  isOpen: boolean;
  classType?: LearningModeEnum;
  scheduleStatus?: ScheduleStatusEnum;
  searchText?: string;
}

interface ClassSelectLoaderState {
  classes: ClassResponse[];
  loadingClasses: boolean;
  hasMore: boolean;
  isSelectOpen: boolean;
  pageNumber: number;
  totalPages: number;
  listRef: React.RefObject<HTMLUListElement>;
  setIsSelectOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  setClassType: React.Dispatch<React.SetStateAction<LearningModeEnum | undefined>>;
  setScheduleStatus: React.Dispatch<React.SetStateAction<ScheduleStatusEnum | undefined>>;
  searchText: string;
  classType: LearningModeEnum | undefined;
  scheduleStatus: ScheduleStatusEnum | undefined;
  disableStatus: StatusEnum | undefined;
  loadClasses: (page: number, reset?: boolean) => Promise<void>;
}

export function useClassSelectLoader({
  classUsecase,
  isOpen,
  classType: initialClassType,
  scheduleStatus: initialScheduleStatus,
  searchText: initialSearchText = '',
}: UseClassSelectLoaderProps): ClassSelectLoaderState {
  const [classes, setClasses] = useState<ClassResponse[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchText, setSearchText] = useState(initialSearchText);
  const [classType, setClassType] = useState<LearningModeEnum | undefined>(initialClassType);
  const [scheduleStatus, setScheduleStatus] = useState<ScheduleStatusEnum | undefined>(initialScheduleStatus);
  const listRef = useRef<HTMLUListElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadClasses = async (page: number, reset: boolean = false) => {
    if (!classUsecase || loadingClasses || !isOpen) return;

    setLoadingClasses(true);
    abortControllerRef.current = new AbortController();

    try {
      const request = new GetClassRequest({
        searchText: searchText || undefined,
        pageNumber: page,
        pageSize: 10,
      });

      const result: ClassListResult = await classUsecase.getClassListInfo(request);
      if (isOpen) {
        setClasses((prev) => (reset || page === 1 ? result.class : [...prev, ...result.class]));
        setHasMore(result.class.length > 0 && result.totalRecords > classes.length + result.class.length);
        setTotalPages(Math.ceil(result.totalRecords / 10));
        setPageNumber(page);
      }
    } catch (error) {
      console.error('Error loading classes:', error);
    } finally {
      if (isOpen) setLoadingClasses(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setClasses([]);
      setPageNumber(1);
      setTotalPages(1);
      setHasMore(true);
      loadClasses(1, true);
    }

    return () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
      setClasses([]);
      setPageNumber(1);
      setTotalPages(1);
      setHasMore(true);
      setIsSelectOpen(false);
    };
  }, [isOpen, searchText, classType, scheduleStatus]);

  return {
    classes,
    loadingClasses,
    hasMore,
    isSelectOpen,
    pageNumber,
    totalPages,
    listRef,
    setIsSelectOpen,
    setSearchText,
    setClassType,
    setScheduleStatus,
    searchText,
    classType,
    scheduleStatus,
    disableStatus: undefined,
    loadClasses,
  };
}
