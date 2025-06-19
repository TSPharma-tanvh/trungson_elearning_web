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
  type: FileResourceEnum;
  searchText?: string;
}

interface FileResourceSelectLoaderState {
  files: FileResourcesResponse[];
  loadingFiles: boolean;
  hasMore: boolean;
  isSelectOpen: boolean;
  pageNumber: number;
  totalPages: number;
  listRef: React.RefObject<HTMLUListElement>;
  setIsSelectOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  setStatus: React.Dispatch<React.SetStateAction<StatusEnum | undefined>>;
  searchText: string;
  status: StatusEnum | undefined;
  type: FileResourceEnum | undefined;
  loadFileResources: (page: number, reset?: boolean) => Promise<void>;
}

export function useResourceSelectLoader({
  fileUsecase,
  isOpen,
  status: initialStatus,
  searchText: initialSearchText = '',
  type: initialType,
}: FileResourceSelectLoaderProps): FileResourceSelectLoaderState {
  const [files, setFiles] = useState<FileResourcesResponse[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [searchText, setSearchText] = useState(initialSearchText);
  const [status, setStatus] = useState<StatusEnum | undefined>(initialStatus);
  const [type, setType] = useState<FileResourceEnum | undefined>(initialType);
  const listRef = useRef<HTMLUListElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadFileResources = async (page: number, reset: boolean = false) => {
    if (!fileUsecase || loadingFiles || !isOpen) return;

    setLoadingFiles(true);
    abortControllerRef.current = new AbortController();

    try {
      const request = new GetFileResourcesRequest({
        type: type != null ? FileResourceEnumUtils.getContentTypeByEnum(type) : undefined,
        status: status,
        searchText: searchText,
        pageNumber: page,
        pageSize: 10,
      });

      const result: FileResourceListResult = await fileUsecase.getFileResourceList(request);
      if (isOpen) {
        setFiles((prev) => (reset || page === 1 ? result.files : [...prev, ...result.files]));
        setHasMore(result.files.length > 0 && result.totalRecords > files.length + result.files.length);
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
    if (isOpen) {
      setFiles([]);
      setPageNumber(1);
      setTotalPages(1);
      setHasMore(true);
      loadFileResources(1, true);
    }

    return () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
      setFiles([]);
      setPageNumber(1);
      setTotalPages(1);
      setHasMore(true);
      setIsSelectOpen(false);
    };
  }, [isOpen, searchText, status, type]);

  return {
    files,
    loadingFiles,
    hasMore,
    isSelectOpen,
    pageNumber,
    totalPages,
    listRef,
    setIsSelectOpen,
    setSearchText,
    setStatus,
    searchText,
    status,
    type,
    loadFileResources,
  };
}
