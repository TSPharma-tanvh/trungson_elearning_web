'use client';

import React from 'react';
import { GetUserQuizLiveStatusRequest } from '@/domain/models/user-quiz/request/get-user-quiz-live-status-request';
import { type UserQuizProgressDetailResponse } from '@/domain/models/user-quiz/response/user-quiz-progress-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { UserQuizLiveFilters } from '@/presentation/components/dashboard/progress/quiz-live/user-quiz-live-filter';
import UserQuizLiveTable from '@/presentation/components/dashboard/progress/quiz-live/user-quiz-live-table';

export default function Page(): React.JSX.Element {
  const { t } = useTranslation();
  const { userQuizProgressUsecase, enrollUsecase, quizUsecase } = useDI();

  const [filters, setFilters] = React.useState<GetUserQuizLiveStatusRequest>(
    new GetUserQuizLiveStatusRequest({
      pageNumber: 1,
      pageSize: 10,
    })
  );
  const [userQuizProgress, setUserQuizProgress] = React.useState<UserQuizProgressDetailResponse[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [intervalId, setIntervalId] = React.useState<NodeJS.Timeout | null>(null);

  const fetchUserQuizProgress = React.useCallback(async () => {
    try {
      const request = new GetUserQuizLiveStatusRequest({
        ...filters,
        pageNumber: page + 1,
        pageSize: rowsPerPage,
      });

      const { progress, totalRecords } = await userQuizProgressUsecase.getUserQuizLiveStatus(request);

      if (!progress || progress.length === 0 || totalRecords === 0) {
        resetAll();
        CustomSnackBar.showSnackbar(t('noDataFound') ?? '', 'warning');
        return;
      }

      setUserQuizProgress(progress);
      setTotalCount(totalRecords);
    } catch (error) {
      resetAll();

      CustomSnackBar.showSnackbar(t('fetchError') ?? '', 'error');
    }
  }, [filters, page, rowsPerPage, userQuizProgressUsecase, intervalId, t]);

  const resetAll = React.useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    setFilters(new GetUserQuizLiveStatusRequest({ pageNumber: 1, pageSize: 10 }));
    setUserQuizProgress([]);
    setTotalCount(0);
    setPage(0);
    setRowsPerPage(10);

    setTimeout(() => {
      window.location.reload();
    }, 10 * 1000);
  }, [intervalId]);

  const handleFilter = (newFilters: GetUserQuizLiveStatusRequest, intervalSeconds?: number) => {
    setFilters(newFilters);
    setPage(0);

    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    if (!intervalSeconds) {
      setUserQuizProgress([]);
      setTotalCount(0);
      return;
    }

    void fetchUserQuizProgress();

    const id = setInterval(() => {
      void fetchUserQuizProgress();
    }, intervalSeconds * 1000);
    setIntervalId(id);
  };

  const handleChange = (field: string, value: string) => {
    setFilters(
      (prev) =>
        new GetUserQuizLiveStatusRequest({
          ...prev,
          [field]: value,
        })
    );
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
    handleFilter(filters);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(event.target.value, 10);
    setRowsPerPage(newSize);
    setPage(0);
    handleFilter(filters);
  };

  const handleDeleteUserQuizProgress = async (id: string, quizId: string) => {
    try {
      const response = await userQuizProgressUsecase.deleteUserQuizProgress(id, quizId);
      if (!response) {
        throw new Error(`Failed to delete lesson with ID: ${id}`);
      }
      await fetchUserQuizProgress();
    } catch {
      
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4" sx={{ color: 'var(--mui-palette-secondary-main)' }}>
            {t('liveQuizTracking')}
          </Typography>
        </Stack>
      </Stack>

      <UserQuizLiveFilters
        onFilter={handleFilter}
        enrollUsecase={enrollUsecase}
        quizUsecase={quizUsecase}
        form={filters}
        handleChange={handleChange}
      />

      <UserQuizLiveTable
        rows={userQuizProgress}
        count={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onDeleteUserQuizProgress={handleDeleteUserQuizProgress}
      />
    </Stack>
  );
}
