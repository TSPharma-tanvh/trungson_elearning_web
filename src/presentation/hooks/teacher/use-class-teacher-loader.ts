import { useCallback, useEffect, useRef, useState, type Dispatch, type RefObject, type SetStateAction } from 'react';
import { GetClassTeacherRequest } from '@/domain/models/teacher/request/get-class-teacher-request';
import type { ClassTeacherResponse } from '@/domain/models/teacher/response/class-teacher-response';
import type { ClassTeacherListResult } from '@/domain/models/teacher/response/class-teacher-result';
import type { ClassTeacherUsecase } from '@/domain/usecases/class/class-teacher-usecase';
import { ActiveEnum } from '@/utils/enum/core-enum';
import type { LearningModeEnum, ScheduleStatusEnum, StatusEnum } from '@/utils/enum/core-enum';

import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';

interface UseClassTeacherSelectLoaderProps {
  classUsecase: ClassTeacherUsecase | null;
  isOpen: boolean;
  classType?: LearningModeEnum;
  scheduleStatus?: ScheduleStatusEnum;
  searchText?: string;
}

interface ClassTeacherSelectLoaderState {
  classes: ClassTeacherResponse[];
  loadingClassTeachers: boolean;
  hasMore: boolean;
  isSelectOpen: boolean;
  pageNumber: number;
  totalPages: number;
  listRef: RefObject<HTMLUListElement>;
  setIsSelectOpen: Dispatch<SetStateAction<boolean>>;
  setSearchText: Dispatch<SetStateAction<string>>;
  setClassTeacherType: Dispatch<SetStateAction<LearningModeEnum | undefined>>;
  setScheduleStatus: Dispatch<SetStateAction<ScheduleStatusEnum | undefined>>;
  searchText: string;
  classType: LearningModeEnum | undefined;
  scheduleStatus: ScheduleStatusEnum | undefined;
  disableStatus: StatusEnum | undefined;
  loadClassTeachers: (page: number, reset?: boolean) => Promise<void>;
}

export function useClassTeacherSelectLoader({
  classUsecase,
  isOpen,
  classType: initialClassTeacherType,
  scheduleStatus: initialScheduleStatus,
  searchText: initialSearchText = '',
}: UseClassTeacherSelectLoaderProps): ClassTeacherSelectLoaderState {
  const [classes, setClassTeachers] = useState<ClassTeacherResponse[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingClassTeachers, setLoadingClassTeachers] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchText, setSearchText] = useState(initialSearchText);
  const [classType, setClassTeacherType] = useState<LearningModeEnum | undefined>(initialClassTeacherType);
  const [scheduleStatus, setScheduleStatus] = useState<ScheduleStatusEnum | undefined>(initialScheduleStatus);

  const listRef = useRef<HTMLUListElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const loadClassTeachers = useCallback(
    async (page: number, reset = false): Promise<void> => {
      if (!classUsecase || loadingClassTeachers || !isOpen) return;

      setLoadingClassTeachers(true);
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
          setClassTeachers((prev) => {
            const updated = reset || page === 1 ? result.teachers : [...prev, ...result.teachers];
            setHasMore(result.teachers.length > 0 && result.totalRecords > updated.length);
            return updated;
          });
          setTotalPages(Math.ceil(result.totalRecords / 10));
          setPageNumber(page);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        CustomSnackBar.showSnackbar(message, 'error');
      } finally {
        if (isOpen) setLoadingClassTeachers(false);
      }
    },
    [classUsecase, loadingClassTeachers, isOpen, searchText]
  );

  useEffect(() => {
    if (!isOpen) return;

    const loadInitial = async () => {
      setClassTeachers([]);
      setPageNumber(1);
      setTotalPages(1);
      setHasMore(true);
      await loadClassTeachers(1, true);
    };

    void loadInitial();

    return () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
      setClassTeachers([]);
      setPageNumber(1);
      setTotalPages(1);
      setHasMore(true);
      setIsSelectOpen(false);
    };
  }, [isOpen, searchText, classType, scheduleStatus]);

  return {
    classes,
    loadingClassTeachers,
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
    loadClassTeachers,
  };
}
