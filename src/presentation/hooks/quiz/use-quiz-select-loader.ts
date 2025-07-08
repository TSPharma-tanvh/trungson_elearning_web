import { useEffect, useRef, useState } from 'react';
import { GetQuizRequest } from '@/domain/models/quiz/request/get-quiz-request';
import { QuizResponse } from '@/domain/models/quiz/response/quiz-response';
import { QuizListResult } from '@/domain/models/quiz/response/quiz-result';
import { QuizUsecase } from '@/domain/usecases/quiz/quiz-usecase';
import { DisplayTypeEnum, LearningModeEnum, ScheduleStatusEnum, StatusEnum } from '@/utils/enum/core-enum';

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
  listRef: React.RefObject<HTMLUListElement>;
  setIsSelectOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  searchText: string;
  loadQuizzes: (page: number, reset?: boolean) => Promise<void>;
}

export function useQuizSelectLoader({
  quizUsecase,
  isOpen,
  pathID,
  searchText: initialSearchText = '',
}: UseQuizSelectLoaderProps): QuizSelectLoaderState {
  const [courses, setQuizs] = useState<QuizResponse[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingQuizs, setLoadingQuizs] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchText, setSearchText] = useState(initialSearchText);

  const listRef = useRef<HTMLUListElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadQuizzes = async (page: number, reset: boolean = false) => {
    if (!quizUsecase || loadingQuizs || !isOpen) return;

    setLoadingQuizs(true);
    abortControllerRef.current = new AbortController();

    try {
      const request = new GetQuizRequest({
        searchText: searchText || undefined,
        pageNumber: page,
        pageSize: 10,
      });

      const result: QuizListResult = await quizUsecase.getQuizListInfo(request);
      if (isOpen) {
        setQuizs((prev) => (reset || page === 1 ? result.quizzes : [...prev, ...result.quizzes]));
        setHasMore(result.quizzes.length > 0 && result.totalRecords > courses.length + result.quizzes.length);
        setTotalPages(Math.ceil(result.totalRecords / 10));
        setPageNumber(page);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      if (isOpen) setLoadingQuizs(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setQuizs([]);
      setPageNumber(1);
      setTotalPages(1);
      setHasMore(true);
      loadQuizzes(1, true);
    }

    return () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
      setQuizs([]);
      setPageNumber(1);
      setTotalPages(1);
      setHasMore(true);
      setIsSelectOpen(false);
    };
  }, [isOpen, pathID, searchText]);

  return {
    quizzes: courses,
    loadingQuizzes: loadingQuizs,
    hasMore,
    isSelectOpen,
    pageNumber,
    totalPages,
    listRef,
    setIsSelectOpen,
    setSearchText,
    searchText,
    loadQuizzes: loadQuizzes,
  };
}
