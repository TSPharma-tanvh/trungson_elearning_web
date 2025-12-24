import type * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { GetCourseRequest } from '@/domain/models/courses/request/get-course-request';
import { type CourseDetailResponse } from '@/domain/models/courses/response/course-detail-response';
import { type CourseDetailListResult } from '@/domain/models/courses/response/course-detail-result';
import { type CourseUsecase } from '@/domain/usecases/courses/course-usecase';
import { CourseTypeEnum, type DisplayTypeEnum, type LearningModeEnum, type StatusEnum } from '@/utils/enum/core-enum';

import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';

interface UseCourseSelectLoaderProps {
  courseUsecase: CourseUsecase | null;
  isOpen: boolean;
  disableStatus?: StatusEnum;
  courseType?: CourseTypeEnum;
  displayType?: DisplayTypeEnum;
  searchText?: string;

  // NEW FILTERS
  positionCode?: string;
  positionStateCode?: string;
  departmentTypeCode?: string;
  isFixedCourse?: boolean;
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
  setCourseType: React.Dispatch<React.SetStateAction<CourseTypeEnum | undefined>>;
  setDisplayType: React.Dispatch<React.SetStateAction<DisplayTypeEnum | undefined>>;
  setDisableStatus: React.Dispatch<React.SetStateAction<StatusEnum | undefined>>;

  // NEW SETTERS
  setPositionCode: React.Dispatch<React.SetStateAction<string | undefined>>;
  setPositionStateCode: React.Dispatch<React.SetStateAction<string | undefined>>;
  setDepartmentTypeCode: React.Dispatch<React.SetStateAction<string | undefined>>;
  setIsFixedCourse: React.Dispatch<React.SetStateAction<boolean | undefined>>;

  // CURRENT FILTERS
  searchText: string;
  courseType: CourseTypeEnum | undefined;
  displayType: DisplayTypeEnum | undefined;
  disableStatus: StatusEnum | undefined;

  // NEW FILTER VALUES
  positionCode?: string;
  positionStateCode?: string;
  departmentTypeCode?: string;
  isFixedCourse?: boolean;

  loadCourses: (page: number, reset?: boolean) => Promise<void>;
}

export function useCourseSelectLoader({
  courseUsecase,
  isOpen,
  disableStatus: initialDisableStatus,
  courseType: initialCourseType,
  displayType: initialDisplayType,
  searchText: initialSearchText = '',

  positionCode: initialPositionCode,
  positionStateCode: initialPositionStateCode,
  departmentTypeCode: initialDepartmentTypeCode,
  isFixedCourse: initialIsFixedCourse,
}: UseCourseSelectLoaderProps): CourseSelectLoaderState {
  const [courses, setCourses] = useState<CourseDetailResponse[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const [searchText, setSearchText] = useState(initialSearchText);
  const [courseType, setCourseType] = useState<CourseTypeEnum | undefined>(initialCourseType);
  const [displayType, setDisplayType] = useState<DisplayTypeEnum | undefined>(initialDisplayType);
  const [disableStatus, setDisableStatus] = useState<StatusEnum | undefined>(initialDisableStatus);

  // NEW FILTER STATES
  const [positionCode, setPositionCode] = useState<string | undefined>(initialPositionCode);
  const [positionStateCode, setPositionStateCode] = useState<string | undefined>(initialPositionStateCode);
  const [departmentTypeCode, setDepartmentTypeCode] = useState<string | undefined>(initialDepartmentTypeCode);
  const [isFixedCourse, setIsFixedCourse] = useState<boolean | undefined>(initialIsFixedCourse);

  const listRef = useRef<HTMLUListElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadCourses = async (page: number, reset = false) => {
    if (!courseUsecase || loadingCourses || !isOpen) return;

    setLoadingCourses(true);
    abortControllerRef.current = new AbortController();

    try {
      const request = new GetCourseRequest({
        name: searchText || undefined,
        disableStatus,
        courseType,
        displayType,

        // NEW FILTERS
        positionCode,
        positionStateCode,
        departmentTypeCode,
        isFixedCourse,

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
  }, [
    isOpen,
    searchText,
    disableStatus,
    courseType,
    displayType,

    // NEW FILTERS
    positionCode,
    positionStateCode,
    departmentTypeCode,
    isFixedCourse,
  ]);

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

    // NEW SETTERS
    setPositionCode,
    setPositionStateCode,
    setDepartmentTypeCode,
    setIsFixedCourse,

    searchText,
    courseType,
    displayType,
    disableStatus,

    // NEW VALUES
    positionCode,
    positionStateCode,
    departmentTypeCode,
    isFixedCourse,

    loadCourses,
  };
}
