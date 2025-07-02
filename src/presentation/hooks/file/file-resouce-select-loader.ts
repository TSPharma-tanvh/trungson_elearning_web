import { useEffect, useRef, useState } from 'react';
import { FileResourceListResult } from '@/domain/models/file/response/file-resource-result';
import { FileResourcesResponse } from '@/domain/models/file/response/file-resources-response';
import { GetFileResourcesRequest } from '@/domain/models/file/resquest/get-file-resource-request';
import { FileResourcesUsecase } from '@/domain/usecases/file/file-usecase';
import { StatusEnum } from '@/utils/enum/core-enum';
import { FileResourceEnum, FileResourceEnumUtils } from '@/utils/enum/file-resource-enum';

interface FileResourceSelectLoaderProps {
  fileUsecase: FileResourcesUsecase;
  isOpen: boolean;
  status?: StatusEnum;
  type?: FileResourceEnum;
  searchText?: string;
}

interface FileResourceSelectLoaderState {
  files: FileResourcesResponse[];
  loadingFiles: boolean;
  hasMore: boolean;
  pageNumber: number;
  totalPages: number;
  listRef: React.RefObject<HTMLUListElement>;
  loadFileResources: (page: number, reset?: boolean) => Promise<void>;
  searchText: string;
  setSearchText: (text: string) => void;
}

export function useResourceSelectLoader({
  fileUsecase,
  isOpen,
  status,
  searchText = '',
  type,
}: FileResourceSelectLoaderProps): FileResourceSelectLoaderState {
  const [files, setFiles] = useState<FileResourcesResponse[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const listRef = useRef<HTMLUListElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [searchTextState, setSearchText] = useState(searchText); // Khởi tạo từ prop

  const loadFileResources = async (page: number, reset: boolean = false) => {
    if (!fileUsecase || loadingFiles || !isOpen) return;

    setLoadingFiles(true);
    abortControllerRef.current = new AbortController();

    try {
      const request = new GetFileResourcesRequest({
        type: type != null ? FileResourceEnumUtils.getContentTypeByEnum(type) : undefined,
        status,
        searchText: searchTextState,
        pageNumber: page,
        pageSize: 10,
      });

      const result: FileResourceListResult = await fileUsecase.getFileResourceList(request);

      if (isOpen) {
        setFiles((prev) => (reset || page === 1 ? result.files : [...prev, ...result.files]));
        setHasMore(result.files.length > 0 && result.totalRecords > (reset ? 0 : files.length + result.files.length));
        setTotalPages(Math.ceil(result.totalRecords / 10));
        setPageNumber(page);
      }
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      if (isOpen) setLoadingFiles(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchData = async () => {
      setFiles([]);
      setPageNumber(1);
      setTotalPages(1);
      setHasMore(true);
      await loadFileResources(1, true);
    };

    fetchData();

    return () => {
      controller.abort();
      abortControllerRef.current = null;
    };
  }, [isOpen, searchText, status, type]);

  return {
    files,
    loadingFiles,
    hasMore,
    pageNumber,
    totalPages,
    listRef,
    loadFileResources,
    searchText: searchTextState,
    setSearchText,
  };
}
