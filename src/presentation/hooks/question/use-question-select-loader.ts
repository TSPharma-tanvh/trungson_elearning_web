import { useEffect, useRef, useState } from 'react';
import { GetQuestionRequest } from '@/domain/models/question/request/get-question-request';
import { QuestionResponse } from '@/domain/models/question/response/question-response';
import { QuestionListResult } from '@/domain/models/question/response/question-result';
import { QuestionUsecase } from '@/domain/usecases/question/question-usecase';
import { DisplayTypeEnum, LearningModeEnum, ScheduleStatusEnum, StatusEnum } from '@/utils/enum/core-enum';

interface UseQuestionSelectLoaderProps {
  questionUsecase: QuestionUsecase | null;
  isOpen: boolean;
  disableStatus?: StatusEnum;
  courseType?: LearningModeEnum;
  displayType?: DisplayTypeEnum;
  scheduleStatus?: ScheduleStatusEnum;
  searchText?: string;
}

interface QuestionSelectLoaderState {
  questions: QuestionResponse[];
  loadingQuestions: boolean;
  hasMore: boolean;
  isSelectOpen: boolean;
  pageNumber: number;
  totalPages: number;
  listRef: React.RefObject<HTMLUListElement>;
  setIsSelectOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  searchText: string;
  loadQuestions: (page: number, reset?: boolean) => Promise<void>;
}

export function useQuestionSelectLoader({
  questionUsecase,
  isOpen,
  searchText: initialSearchText = '',
}: UseQuestionSelectLoaderProps): QuestionSelectLoaderState {
  const [questions, setQuestions] = useState<QuestionResponse[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchText, setSearchText] = useState(initialSearchText);

  const listRef = useRef<HTMLUListElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadQuestions = async (page: number, reset: boolean = false) => {
    if (!questionUsecase || loadingQuestions || !isOpen) return;

    setLoadingQuestions(true);
    abortControllerRef.current = new AbortController();

    try {
      const request = new GetQuestionRequest({
        searchText: searchText || undefined,
        pageNumber: page,
        pageSize: 10,
      });

      const result: QuestionListResult = await questionUsecase.getQuestionListInfo(request);
      if (isOpen) {
        setQuestions((prev) => (reset || page === 1 ? result.questions : [...prev, ...result.questions]));
        setHasMore(result.questions.length > 0 && result.totalRecords > questions.length + result.questions.length);
        setTotalPages(Math.ceil(result.totalRecords / 10));
        setPageNumber(page);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      if (isOpen) setLoadingQuestions(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setQuestions([]);
      setPageNumber(1);
      setTotalPages(1);
      setHasMore(true);
      loadQuestions(1, true);
    }

    return () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
      setQuestions([]);
      setPageNumber(1);
      setTotalPages(1);
      setHasMore(true);
      setIsSelectOpen(false);
    };
  }, [isOpen, searchText]);

  return {
    questions,
    loadingQuestions,
    hasMore,
    isSelectOpen,
    pageNumber,
    totalPages,
    listRef,
    setIsSelectOpen,
    setSearchText,
    searchText,
    loadQuestions,
  };
}
