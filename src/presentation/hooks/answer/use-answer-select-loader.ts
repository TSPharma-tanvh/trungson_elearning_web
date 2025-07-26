import type * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { GetAnswerRequest } from '@/domain/models/answer/request/get-answer-request';
import { type AnswerResponse } from '@/domain/models/answer/response/answer-response';
import { type AnswerDetailListResult } from '@/domain/models/answer/response/course-detail-result';
import { type AnswerUsecase } from '@/domain/usecases/answer/answer-usecase';
import {
  type DisplayTypeEnum,
  type LearningModeEnum,
  type ScheduleStatusEnum,
  type StatusEnum,
} from '@/utils/enum/core-enum';

import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';

interface UseAnswerSelectLoaderProps {
  answerUsecase: AnswerUsecase | null;
  isOpen: boolean;
  disableStatus?: StatusEnum;
  courseType?: LearningModeEnum;
  displayType?: DisplayTypeEnum;
  scheduleStatus?: ScheduleStatusEnum;
  searchText?: string;
}

interface AnswerSelectLoaderState {
  answers: AnswerResponse[];
  loadingAnswers: boolean;
  hasMore: boolean;
  isSelectOpen: boolean;
  pageNumber: number;
  totalPages: number;
  listRef: React.RefObject<HTMLUListElement>;
  setIsSelectOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  searchText: string;
  loadAnswers: (page: number, reset?: boolean) => Promise<void>;
}

export function useAnswerSelectLoader({
  answerUsecase,
  isOpen,
  searchText: initialSearchText = '',
}: UseAnswerSelectLoaderProps): AnswerSelectLoaderState {
  const [answers, setAnswers] = useState<AnswerResponse[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingAnswers, setLoadingAnswers] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchText, setSearchText] = useState(initialSearchText);

  const listRef = useRef<HTMLUListElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadAnswers = async (page: number, reset = false) => {
    if (!answerUsecase || loadingAnswers || !isOpen) return;

    setLoadingAnswers(true);
    abortControllerRef.current = new AbortController();

    try {
      const request = new GetAnswerRequest({
        searchText: searchText || undefined,
        pageNumber: page,
        pageSize: 10,
      });

      const result: AnswerDetailListResult = await answerUsecase.getAnswerListInfo(request);
      if (isOpen) {
        setAnswers((prev) => (reset || page === 1 ? result.answers : [...prev, ...result.answers]));
        setHasMore(result.answers.length > 0 && result.totalRecords > answers.length + result.answers.length);
        setTotalPages(Math.ceil(result.totalRecords / 10));
        setPageNumber(page);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load courses.';
      CustomSnackBar.showSnackbar(message, 'error');
    } finally {
      if (isOpen) setLoadingAnswers(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setAnswers([]);
      setPageNumber(1);
      setTotalPages(1);
      setHasMore(true);
      void loadAnswers(1, true);
    }

    return () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
      setAnswers([]);
      setPageNumber(1);
      setTotalPages(1);
      setHasMore(true);
      setIsSelectOpen(false);
    };
  }, [isOpen, searchText]);

  return {
    answers,
    loadingAnswers,
    hasMore,
    isSelectOpen,
    pageNumber,
    totalPages,
    listRef,
    setIsSelectOpen,
    setSearchText,
    searchText,
    loadAnswers,
  };
}
