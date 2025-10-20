'use client';

import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { GetQuizRequest } from '@/domain/models/quiz/request/get-quiz-request';
import type { QuizResponse } from '@/domain/models/quiz/response/quiz-response';
import type { QuizListResult } from '@/domain/models/quiz/response/quiz-result';
import type { QuizUsecase } from '@/domain/usecases/quiz/quiz-usecase';
import { type QuizTypeEnum } from '@/utils/enum/core-enum';

import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';

interface QuizFilters {
  canStartOver?: boolean;
  isRequired?: boolean;
  hasLesson?: boolean;
  type?: QuizTypeEnum;
}

interface UseQuizSelectLoaderProps {
  quizUsecase: QuizUsecase | null;
  isOpen: boolean;
  searchText?: string;
  filters?: QuizFilters;
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
  searchText: initialSearchText = '',
  filters = {},
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

  const loadQuizzes = useCallback(
    async (page: number, reset = false): Promise<void> => {
      if (!quizUsecase || loadingQuizzes || !isOpen) return;

      setLoadingQuizzes(true);
      abortControllerRef.current = new AbortController();

      try {
        const request = new GetQuizRequest({
          searchText: searchText || undefined,
          pageNumber: page,
          pageSize: 10,
          ...filters,
        });

        const result: QuizListResult = await quizUsecase.getQuizListInfo(request);

        if (isOpen) {
          setQuizzes((prev: QuizResponse[]) => {
            const newQuizzes = reset || page === 1 ? result.quizzes : [...prev, ...result.quizzes];
            setHasMore(result.quizzes.length > 0 && result.totalRecords > newQuizzes.length);
            return newQuizzes;
          });
          setTotalPages(Math.ceil(result.totalRecords / 10));
          setPageNumber(page);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load quizzes.';
        CustomSnackBar.showSnackbar(message, 'error');
      } finally {
        if (isOpen) setLoadingQuizzes(false);
      }
    },
    [quizUsecase, isOpen, searchText, filters]
  );

  useEffect(() => {
    if (isOpen) {
      setQuizzes([]);
      setPageNumber(1);
      setTotalPages(1);
      setHasMore(true);
      void loadQuizzes(1, true);
      setIsSelectOpen(false);
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
  }, [isOpen, filters, loadQuizzes]);

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
