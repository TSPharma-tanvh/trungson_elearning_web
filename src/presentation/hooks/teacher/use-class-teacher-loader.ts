import { useEffect, useRef, useState } from 'react';
import { GetClassTeacherRequest } from '@/domain/models/teacher/request/get-class-teacher-request';
import { ClassTeacherResponse } from '@/domain/models/teacher/response/class-teacher-response';
import { ClassTeacherListResult } from '@/domain/models/teacher/response/class-teacher-result';
import { ClassTeacherUsecase } from '@/domain/usecases/class/class-teacher-usecase';
import { ActiveEnum, DisplayTypeEnum, LearningModeEnum, ScheduleStatusEnum, StatusEnum } from '@/utils/enum/core-enum';

interface UseClassTeacherSelectLoaderProps {
  classUsecase: ClassTeacherUsecase | null;
  isOpen: boolean;
  classType?: LearningModeEnum;
  scheduleStatus?: ScheduleStatusEnum;
  searchText?: string;
}

interface ClassTeacherSelectLoaderState {
  classes: ClassTeacherResponse[];
  loadingClassTeacheres: boolean;
  hasMore: boolean;
  isSelectOpen: boolean;
  pageNumber: number;
  totalPages: number;
  listRef: React.RefObject<HTMLUListElement>;
  setIsSelectOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  setClassTeacherType: React.Dispatch<React.SetStateAction<LearningModeEnum | undefined>>;
  setScheduleStatus: React.Dispatch<React.SetStateAction<ScheduleStatusEnum | undefined>>;
  searchText: string;
  classType: LearningModeEnum | undefined;
  scheduleStatus: ScheduleStatusEnum | undefined;
  disableStatus: StatusEnum | undefined;
  loadClassTeacheres: (page: number, reset?: boolean) => Promise<void>;
}

export function useClassTeacherSelectLoader({
  classUsecase,
  isOpen,
  classType: initialClassTeacherType,
  scheduleStatus: initialScheduleStatus,
  searchText: initialSearchText = '',
}: UseClassTeacherSelectLoaderProps): ClassTeacherSelectLoaderState {
  const [classes, setClassTeacheres] = useState<ClassTeacherResponse[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingClassTeacheres, setLoadingClassTeacheres] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchText, setSearchText] = useState(initialSearchText);
  const [classType, setClassTeacherType] = useState<LearningModeEnum | undefined>(initialClassTeacherType);
  const [scheduleStatus, setScheduleStatus] = useState<ScheduleStatusEnum | undefined>(initialScheduleStatus);
  const listRef = useRef<HTMLUListElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadClassTeacheres = async (page: number, reset: boolean = false) => {
    if (!classUsecase || loadingClassTeacheres || !isOpen) return;

    setLoadingClassTeacheres(true);
    abortControllerRef.current = new AbortController();

    try {
      const request = new GetClassTeacherRequest({
        searchText: searchText || undefined,
        status: ActiveEnum[ActiveEnum.Active],
        pageNumber: page,
        pageSize: 10,
      });

      const result: ClassTeacherListResult = await classUsecase.getClassTeacherListInfo(request);
      if (isOpen) {
        setClassTeacheres((prev) => (reset || page === 1 ? result.teachers : [...prev, ...result.teachers]));
        setHasMore(result.teachers.length > 0 && result.totalRecords > classes.length + result.teachers.length);
        setTotalPages(Math.ceil(result.totalRecords / 10));
        setPageNumber(page);
      }
    } catch (error) {
      console.error('Error loading classes:', error);
    } finally {
      if (isOpen) setLoadingClassTeacheres(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setClassTeacheres([]);
      setPageNumber(1);
      setTotalPages(1);
      setHasMore(true);
      loadClassTeacheres(1, true);
    }

    return () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
      setClassTeacheres([]);
      setPageNumber(1);
      setTotalPages(1);
      setHasMore(true);
      setIsSelectOpen(false);
    };
  }, [isOpen, searchText, classType, scheduleStatus]);

  return {
    classes,
    loadingClassTeacheres,
    hasMore,
    isSelectOpen,
    pageNumber,
    totalPages,
    listRef,
    setIsSelectOpen,
    setSearchText,
    setClassTeacherType,
    setScheduleStatus,
    searchText,
    classType,
    scheduleStatus,
    disableStatus: undefined,
    loadClassTeacheres,
  };
}
