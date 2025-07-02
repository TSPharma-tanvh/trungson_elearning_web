import { useEffect, useRef, useState } from 'react';
import { GetCourseRequest } from '@/domain/models/courses/request/get-course-request';
import { CourseDetailResponse } from '@/domain/models/courses/response/course-detail-response';
import { CourseDetailListResult } from '@/domain/models/courses/response/course-detail-result';
import { CourseUsecase } from '@/domain/usecases/courses/course-usecase';
import { DisplayTypeEnum, LearningModeEnum, ScheduleStatusEnum, StatusEnum } from '@/utils/enum/core-enum';

interface UseCourseSelectLoaderProps {
  courseUsecase: CourseUsecase | null;
  isOpen: boolean;
  pathID?: string;
  disableStatus?: StatusEnum;
  courseType?: LearningModeEnum;
  displayType?: DisplayTypeEnum;
  scheduleStatus?: ScheduleStatusEnum;
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
  setScheduleStatus: React.Dispatch<React.SetStateAction<ScheduleStatusEnum | undefined>>;
  setDisableStatus: React.Dispatch<React.SetStateAction<StatusEnum | undefined>>;
  searchText: string;
  courseType: LearningModeEnum | undefined;
  displayType: DisplayTypeEnum | undefined;
  scheduleStatus: ScheduleStatusEnum | undefined;
  disableStatus: StatusEnum | undefined;
  loadCourses: (page: number, reset?: boolean) => Promise<void>;
}

export function useCourseSelectLoader({
  courseUsecase,
  isOpen,
  pathID,
  disableStatus: initialDisableStatus,
  courseType: initialCourseType,
  displayType: initialDisplayType,
  scheduleStatus: initialScheduleStatus,
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
  const [scheduleStatus, setScheduleStatus] = useState<ScheduleStatusEnum | undefined>(initialScheduleStatus);
  const [disableStatus, setDisableStatus] = useState<StatusEnum | undefined>(initialDisableStatus);
  const listRef = useRef<HTMLUListElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadCourses = async (page: number, reset: boolean = false) => {
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
        scheduleStatus,
        pageNumber: page,
        pageSize: 1,
      });

      const result: CourseDetailListResult = await courseUsecase.getCourseListInfo(request);
      if (isOpen) {
        setCourses((prev) => (reset || page === 1 ? result.courses : [...prev, ...result.courses]));
        setHasMore(result.courses.length > 0 && result.totalRecords > courses.length + result.courses.length);
        setTotalPages(Math.ceil(result.totalRecords / 1));
        setPageNumber(page);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
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
      loadCourses(1, true);
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
  }, [isOpen, pathID, searchText, disableStatus, courseType, displayType, scheduleStatus]);

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
    setScheduleStatus,
    setDisableStatus,
    searchText,
    courseType,
    displayType,
    scheduleStatus,
    disableStatus,
    loadCourses,
  };
}
