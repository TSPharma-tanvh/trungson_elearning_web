import { useEffect, useRef, useState, type Dispatch, type RefObject, type SetStateAction } from 'react';
import { GetQuizRequest } from '@/domain/models/quiz/request/get-quiz-request';
import type { QuizResponse } from '@/domain/models/quiz/response/quiz-response';
import type { QuizListResult } from '@/domain/models/quiz/response/quiz-result';
import type { QuizUsecase } from '@/domain/usecases/quiz/quiz-usecase';
import type { DisplayTypeEnum, LearningModeEnum, ScheduleStatusEnum, StatusEnum } from '@/utils/enum/core-enum';

import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';

interface UseQuizSelectLoaderProps {
  quizUsecase: QuizUsecase | null;
  isOpen: boolean;
  pathID?: string;
  disableStatus?: StatusEnum;
  courseType?: LearningModeEnum;
  displayType?: DisplayTypeEnum;
  scheduleStatus?: ScheduleStatusEnum;
  searchText?: string;
}

interface QuizSelectLoaderState {
  quizzes: QuizResponse[];
  loadingQuizzes: boolean;
  hasMore: boolean;
  isSelectOpen: boolean;
  pageNumber: number;
  totalPages: number;
  listRef: RefObject<HTMLUListElement>;
  setIsSelectOpen: Dispatch<SetStateAction<boolean>>;
  setSearchText: Dispatch<SetStateAction<string>>;
  searchText: string;
  loadQuizzes: (page: number, reset?: boolean) => Promise<void>;
}

export function useQuizSelectLoader({
  quizUsecase,
  isOpen,
  pathID,
  searchText: initialSearchText = '',
}: UseQuizSelectLoaderProps): QuizSelectLoaderState {
  const [quizzes, setQuizzes] = useState<QuizResponse[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchText, setSearchText] = useState(initialSearchText);

  const listRef = useRef<HTMLUListElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadQuizzes = async (page: number, reset = false): Promise<void> => {
    if (!quizUsecase || loadingQuizzes || !isOpen) return;

    setLoadingQuizzes(true);
    abortControllerRef.current = new AbortController();

    try {
      const request = new GetQuizRequest({
        searchText: searchText || undefined,
        pageNumber: page,
        pageSize: 10,
      });

      const result: QuizListResult = await quizUsecase.getQuizListInfo(request);

      if (isOpen) {
        setQuizzes((prev) => (reset || page === 1 ? result.quizzes : [...prev, ...result.quizzes]));
        setHasMore(result.quizzes.length > 0 && result.totalRecords > quizzes.length + result.quizzes.length);
        setTotalPages(Math.ceil(result.totalRecords / 10));
        setPageNumber(page);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load quizzes.';
      CustomSnackBar.showSnackbar(message, 'error');
    } finally {
      if (isOpen) setLoadingQuizzes(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setQuizzes([]);
      setPageNumber(1);
      setTotalPages(1);
      setHasMore(true);
      void loadQuizzes(1, true);
    }

    return () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
      setQuizzes([]);
      setPageNumber(1);
      setTotalPages(1);
      setHasMore(true);
      setIsSelectOpen(false);
    };
  }, [isOpen, pathID, searchText, loadQuizzes]);

  return {
    quizzes,
    loadingQuizzes,
    hasMore,
    isSelectOpen,
    pageNumber,
    totalPages,
    listRef,
    setIsSelectOpen,
    setSearchText,
    searchText,
    loadQuizzes,
  };
}
