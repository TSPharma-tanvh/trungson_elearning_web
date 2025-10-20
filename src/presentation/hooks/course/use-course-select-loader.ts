import type * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { GetCourseRequest } from '@/domain/models/courses/request/get-course-request';
import { type CourseDetailResponse } from '@/domain/models/courses/response/course-detail-response';
import { type CourseDetailListResult } from '@/domain/models/courses/response/course-detail-result';
import { type CourseUsecase } from '@/domain/usecases/courses/course-usecase';
import { type DisplayTypeEnum, type LearningModeEnum, type StatusEnum } from '@/utils/enum/core-enum';

import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';

interface UseCourseSelectLoaderProps {
  courseUsecase: CourseUsecase | null;
  isOpen: boolean;
  pathID?: string;
  disableStatus?: StatusEnum;
  courseType?: LearningModeEnum;
  displayType?: DisplayTypeEnum;
  hasPath?: boolean;
  searchText?: string;
}

interface CourseSelectLoaderState {
  courses: CourseDetailResponse[];
  loadingCourses: boolean;
  hasMore: boolean;
  isSelectOpen: boolean;
  pageNumber: number;
  totalPages: number;
  listRef: React.RefObject<HTMLUListElement>;
  setIsSelectOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  setCourseType: React.Dispatch<React.SetStateAction<LearningModeEnum | undefined>>;
  setDisplayType: React.Dispatch<React.SetStateAction<DisplayTypeEnum | undefined>>;
  setDisableStatus: React.Dispatch<React.SetStateAction<StatusEnum | undefined>>;
  setHasPath: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  searchText: string;
  courseType: LearningModeEnum | undefined;
  displayType: DisplayTypeEnum | undefined;
  disableStatus: StatusEnum | undefined;
  hasPath: boolean | undefined;
  loadCourses: (page: number, reset?: boolean) => Promise<void>;
}

export function useCourseSelectLoader({
  courseUsecase,
  isOpen,
  pathID,
  disableStatus: initialDisableStatus,
  courseType: initialCourseType,
  displayType: initialDisplayType,
  hasPath: initialHasPath,
  searchText: initialSearchText = '',
}: UseCourseSelectLoaderProps): CourseSelectLoaderState {
  const [courses, setCourses] = useState<CourseDetailResponse[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchText, setSearchText] = useState(initialSearchText);
  const [courseType, setCourseType] = useState<LearningModeEnum | undefined>(initialCourseType);
  const [displayType, setDisplayType] = useState<DisplayTypeEnum | undefined>(initialDisplayType);
  const [disableStatus, setDisableStatus] = useState<StatusEnum | undefined>(initialDisableStatus);
  const [hasPath, setHasPath] = useState<boolean | undefined>(initialHasPath);
  const listRef = useRef<HTMLUListElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadCourses = async (page: number, reset = false) => {
    if (!courseUsecase || loadingCourses || !isOpen) return;

    setLoadingCourses(true);
    abortControllerRef.current = new AbortController();

    try {
      const request = new GetCourseRequest({
        pathID,
        name: searchText || undefined,
        disableStatus,
        courseType,
        displayType,
        hasPath,
        pageNumber: page,
        pageSize: 10,
      });

      const result: CourseDetailListResult = await courseUsecase.getCourseListInfo(request);
      if (isOpen) {
        setCourses((prev) => (reset || page === 1 ? result.courses : [...prev, ...result.courses]));
        setHasMore(result.courses.length > 0 && result.totalRecords > courses.length + result.courses.length);
        setTotalPages(Math.ceil(result.totalRecords / 10));
        setPageNumber(page);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load courses.';
      CustomSnackBar.showSnackbar(message, 'error');
    } finally {
      if (isOpen) setLoadingCourses(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCourses([]);
      setPageNumber(1);
      setTotalPages(1);
      setHasMore(true);
      void loadCourses(1, true);
    }

    return () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
      setCourses([]);
      setPageNumber(1);
      setTotalPages(1);
      setHasMore(true);
      setIsSelectOpen(false);
    };
  }, [isOpen, pathID, searchText, disableStatus, courseType, displayType, hasPath]);

  return {
    courses,
    loadingCourses,
    hasMore,
    isSelectOpen,
    pageNumber,
    totalPages,
    listRef,
    setIsSelectOpen,
    setSearchText,
    setCourseType,
    setDisplayType,
    setDisableStatus,
    setHasPath,
    searchText,
    courseType,
    displayType,
    disableStatus,
    hasPath,
    loadCourses,
  };
}
