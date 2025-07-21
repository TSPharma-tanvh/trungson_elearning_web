import { useEffect, useRef, useState } from 'react';
import { GetPathRequest } from '@/domain/models/path/request/get-path-request';
import { CoursePathResponse } from '@/domain/models/path/response/course-path-response';
import { CoursePathResult } from '@/domain/models/path/response/course-path-result';
import { PathUsecase } from '@/domain/usecases/path/path-usecase';
import { ActiveEnum, DisplayTypeEnum, StatusEnum } from '@/utils/enum/core-enum';

interface UsePathSelectLoaderProps {
  pathUsecase: PathUsecase | null;
  isOpen: boolean;
  status?: StatusEnum;
  displayType?: DisplayTypeEnum;
  searchText?: string;
}

interface PathSelectLoaderState {
  paths: CoursePathResponse[];
  loadingPaths: boolean;
  hasMore: boolean;
  isSelectOpen: boolean;
  pageNumber: number;
  totalPages: number;
  listRef: React.RefObject<HTMLUListElement>;
  setIsSelectOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  setStatus: React.Dispatch<React.SetStateAction<StatusEnum | undefined>>;
  setDisplayType: React.Dispatch<React.SetStateAction<DisplayTypeEnum | undefined>>;
  searchText: string;
  status: StatusEnum | undefined;
  displayType: DisplayTypeEnum | undefined;
  disableStatus: StatusEnum | undefined;
  loadPaths: (page: number, reset?: boolean) => Promise<void>;
}

export function usePathSelectLoader({
  pathUsecase,
  isOpen,
  status: initialPathType,
  displayType: initialScheduleStatus,
  searchText: initialSearchText = '',
}: UsePathSelectLoaderProps): PathSelectLoaderState {
  const [classes, setPathes] = useState<CoursePathResponse[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingPathes, setLoadingPathes] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchText, setSearchText] = useState(initialSearchText);
  const [status, setPathType] = useState<StatusEnum | undefined>(initialPathType);
  const [displayType, setDisplayType] = useState<DisplayTypeEnum | undefined>(initialScheduleStatus);
  const listRef = useRef<HTMLUListElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadPaths = async (page: number, reset: boolean = false) => {
    if (!pathUsecase || loadingPathes || !isOpen) return;

    setLoadingPathes(true);
    abortControllerRef.current = new AbortController();

    try {
      const request = new GetPathRequest({
        searchText: searchText || undefined,
        status: ActiveEnum.Active || undefined,
        displayType: DisplayTypeEnum.Public || undefined,
        pageNumber: page,
        pageSize: 10,
      });

      const result: CoursePathResult = await pathUsecase.getPathListInfo(request);
      if (isOpen) {
        setPathes((prev) => (reset || page === 1 ? result.path : [...prev, ...result.path]));
        setHasMore(result.path.length > 0 && result.totalRecords > classes.length + result.path.length);
        setTotalPages(Math.ceil(result.totalRecords / 10));
        setPageNumber(page);
      }
    } catch (error) {
      console.error('Error loading classes:', error);
    } finally {
      if (isOpen) setLoadingPathes(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setPathes([]);
      setPageNumber(1);
      setTotalPages(1);
      setHasMore(true);
      loadPaths(1, true);
    }

    return () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
      setPathes([]);
      setPageNumber(1);
      setTotalPages(1);
      setHasMore(true);
      setIsSelectOpen(false);
    };
  }, [isOpen, searchText, status, displayType]);

  return {
    paths: classes,
    loadingPaths: loadingPathes,
    hasMore,
    isSelectOpen,
    pageNumber,
    totalPages,
    listRef,
    setIsSelectOpen,
    setSearchText,
    setStatus: setPathType,
    setDisplayType,
    searchText,
    status,
    displayType,
    disableStatus: undefined,
    loadPaths,
  };
}
