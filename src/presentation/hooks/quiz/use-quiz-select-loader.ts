'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { GetQuizRequest } from '@/domain/models/quiz/request/get-quiz-request';
import type { QuizResponse } from '@/domain/models/quiz/response/quiz-response';
import type { QuizListResult } from '@/domain/models/quiz/response/quiz-result';
import type { QuizUsecase } from '@/domain/usecases/quiz/quiz-usecase';

import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';

interface UseQuizSelectLoaderProps {
  quizUsecase: QuizUsecase | null;
  isOpen: boolean;
  searchText?: string;
  filters?: Partial<GetQuizRequest>;
}

export function useQuizSelectLoader({
  quizUsecase,
  isOpen,
  searchText: initialSearchText = '',
  filters = {},
}: UseQuizSelectLoaderProps) {
  const [quizzes, setQuizzes] = useState<QuizResponse[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
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
          pageNumber: page,
          pageSize: 10,
          searchText: searchText || undefined,
          ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== null)),
        });

        const result: QuizListResult = await quizUsecase.getQuizListInfo(request);

        if (isOpen) {
          setQuizzes((prev) => {
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
    }

    return () => {
      abortControllerRef.current?.abort();
      setQuizzes([]);
      setPageNumber(1);
      setTotalPages(1);
      setHasMore(true);
    };
  }, [isOpen, filters, loadQuizzes]);

  return {
    quizzes,
    loadingQuizzes,
    hasMore,
    pageNumber,
    totalPages,
    listRef,
    setSearchText,
    searchText,
    loadQuizzes,
  };
}
