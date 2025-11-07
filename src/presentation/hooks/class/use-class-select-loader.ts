import { useCallback, useEffect, useRef, useState } from 'react';
import { GetClassRequest } from '@/domain/models/class/request/get-class-request';
import { type ClassResponse } from '@/domain/models/class/response/class-response';
import { type ClassListResult } from '@/domain/models/class/response/class-result';
import { type ClassUsecase } from '@/domain/usecases/class/class-usecase';
import { LearningModeEnum, ScheduleStatusEnum } from '@/utils/enum/core-enum';

import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';

interface UseClassSelectLoaderProps {
  classUsecase: ClassUsecase | null;
  isOpen: boolean;
  classType?: LearningModeEnum;
  scheduleStatus?: ScheduleStatusEnum;
  searchText?: string;
}

export function useClassSelectLoader({
  classUsecase,
  isOpen,
  classType,
  scheduleStatus,
  searchText = '',
}: UseClassSelectLoaderProps) {
  const [classes, setClasses] = useState<ClassResponse[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const listRef = useRef<HTMLUListElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadClasses = useCallback(
    async (page: number, reset = false) => {
      if (!classUsecase || loadingClasses || !isOpen) return;

      // Hủy request cũ
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setLoadingClasses(true);

      try {
        const request = new GetClassRequest({
          searchText: searchText || undefined,
          classType: classType !== undefined ? LearningModeEnum[classType] : undefined,
          scheduleStatus: scheduleStatus !== undefined ? ScheduleStatusEnum[scheduleStatus] : undefined,
          pageNumber: page,
          pageSize: 10,
        });

        const result: ClassListResult = await classUsecase.getClassListInfo(request);

        if (isOpen && !abortControllerRef.current.signal.aborted) {
          setClasses((prev) => (reset || page === 1 ? result.class : [...prev, ...result.class]));
          setTotalPages(Math.ceil(result.totalRecords / 10));
          setPageNumber(page);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          const message = error instanceof Error ? error.message : 'Failed to load classes.';
          CustomSnackBar.showSnackbar(message, 'error');
        }
      } finally {
        if (isOpen) setLoadingClasses(false);
      }
    },
    [classUsecase, isOpen, classType, scheduleStatus, searchText]
  );

  // Reset khi mở dialog hoặc filter thay đổi
  useEffect(() => {
    if (isOpen) {
      setClasses([]);
      setPageNumber(1);
      setTotalPages(1);
      void loadClasses(1, true);
    }

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [isOpen, classType, scheduleStatus, searchText, loadClasses]);

  return {
    classes,
    loadingClasses,
    pageNumber,
    totalPages,
    listRef,
    loadClasses,
  };
}
