'use client';

import React from 'react';
import { type CreateUserQuizRequest } from '@/domain/models/user-quiz/request/create-user-quiz-request';
import { GetUserQuizProgressRequest } from '@/domain/models/user-quiz/request/get-user-quiz-progress-request';
import { type UpdateUserQuizRequest } from '@/domain/models/user-quiz/request/update-quiz-progress-request';
import { type UserQuizProgressDetailResponse } from '@/domain/models/user-quiz/response/user-quiz-progress-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { QuizTypeEnum } from '@/utils/enum/core-enum';
import { Button, Stack, Typography } from '@mui/material';
import { FileXls, Plus } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';

import { UserExamProgressFilters } from '@/presentation/components/dashboard/progress/exam/user-exam-progress-filter';
import UserExamProgressTable from '@/presentation/components/dashboard/progress/exam/user-exam-progress-table';
import { CreateUserQuizProgressDialog } from '@/presentation/components/dashboard/progress/quiz/user-quiz-progress-create';
import { UserQuizProgressFilters } from '@/presentation/components/dashboard/progress/quiz/user-quiz-progress-filter';
import UserQuizProgressTable from '@/presentation/components/dashboard/progress/quiz/user-quiz-progress-table';

export default function Page(): React.JSX.Element {
  const { t } = useTranslation();
  const { userQuizProgressUsecase, quizUsecase } = useDI();

  // const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [filters, setFilters] = React.useState<GetUserQuizProgressRequest>(
    new GetUserQuizProgressRequest({ pageNumber: 1, pageSize: 10 })
  );
  const [userQuizProgress, setUserQuizProgress] = React.useState<UserQuizProgressDetailResponse[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [_deleteLoading, setDeleteLoading] = React.useState(false);
  // const [createLoading, setCreateLoading] = React.useState(false);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const fetchUserQuizProgress = React.useCallback(async () => {
    try {
      const request = new GetUserQuizProgressRequest({
        ...filters,
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        quizType: QuizTypeEnum[QuizTypeEnum.ExamQuiz],
      });
      const { progress, totalRecords } = await userQuizProgressUsecase.getUserQuizProgressListInfo(request);
      setUserQuizProgress(progress);
      setTotalCount(totalRecords);
    } catch (error) {
      setUserQuizProgress([]);
      return undefined;
    }
  }, [filters, page, rowsPerPage, userQuizProgressUsecase]);

  React.useEffect(() => {
    void fetchUserQuizProgress();
  }, [fetchUserQuizProgress]);

  const handleFilter = (newFilters: GetUserQuizProgressRequest) => {
    setFilters(newFilters);
    setPage(0);
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(event.target.value, 10);
    setRowsPerPage(newSize);
    setPage(0);
  };

  // const handleCreateUserQuizProgress = async (request: CreateUserQuizRequest) => {
  //   try {
  //     setCreateLoading(true);

  //     await userQuizProgressUsecase.createUserQuizProgress(request);
  //     setShowCreateDialog(false);
  //     await fetchUserQuizProgress();
  //   } catch (error) {
  //     return undefined;
  //   } finally {
  //     setCreateLoading(false);
  //   }
  // };

  const handleEditUserQuizProgress = async (request: UpdateUserQuizRequest) => {
    try {
      await userQuizProgressUsecase.updateUserQuizProgress(request);
      await fetchUserQuizProgress();
    } catch (error) {
      return undefined;
    }
  };

  const handleDeleteUserQuizProgress = async (id: string, quizId: string) => {
    try {
      setDeleteLoading(true);

      const response = await userQuizProgressUsecase.deleteUserQuizProgress(id, quizId);
      if (!response) {
        throw new Error(`Failed to delete lesson with ID: ${id}`);
      }

      await fetchUserQuizProgress();
    } catch (error) {
      return undefined;
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleExportToExcel = () => {
    const exportData = userQuizProgress.map((row) => ({
      [t('id')]: row.id ?? '',
      [t('quizId')]: row.quizId ?? '',
      [t('quizName')]: row.quiz?.title ?? '',
      [t('fullName')]: row.user?.employee?.name || row.user?.userName || '',
      [t('userName')]: row.user?.userName ?? '',
      [t('gender')]: row.user?.employee?.gender ?? '',
      [t('progressStatus')]: row.progressStatus ? t(row.progressStatus.toLowerCase()) : '',
      [t('score')]: row.score ?? '',
      [t('totalScore')]: row.quiz?.totalScore ?? '',
      [t('scoreToPass')]: row.quiz?.scoreToPass ?? '',
      [t('totalQuestion')]: row.quiz?.totalQuestion ?? '',
      [t('attempts')]: row.attempts ?? '',
      [t('maxAttempts')]: row.quiz?.maxAttempts ?? '',
      [t('startDate')]: row.startTime ? DateTimeUtils.formatDateTimeToDateString(row.startTime) : '',
      [t('endDate')]: row.endTime ? DateTimeUtils.formatDateTimeToDateString(row.endTime) : '',
      [t('startedAt')]: row.startedAt ? DateTimeUtils.formatDateTimeToDateString(row.startedAt) : '',
      [t('completedAt')]: row.completedAt ? DateTimeUtils.formatDateTimeToDateString(row.completedAt) : '',
      [t('lastAccess')]: row.lastAccess ? DateTimeUtils.formatDateTimeToDateString(row.lastAccess) : '',
      [t('activeStatus')]: row.activeStatus ? t(row.activeStatus.toLowerCase()) : '',
      // [t('currentPositionName')]: row.user?.employee?.currentPositionName ?? '',
      // [t('currentPositionStateName')]: row.user?.employee?.currentPositionStateName ?? '',
      // [t('currentDepartmentName')]: row.user?.employee?.currentDepartmentName ?? '',
      // [t('cityName')]: row.user?.employee?.cityName ?? '',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'UserQuizProgress');
    const dateTimeString = DateTimeUtils.getTodayAsString();
    XLSX.writeFile(wb, `UserQuizProgress_${dateTimeString}.xlsx`);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4" sx={{ color: 'var(--mui-palette-secondary-main)' }}>
            {t('userExamProgress')}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button
              color="inherit"
              startIcon={<FileXls fontSize="var(--icon-fontSize-md)" />}
              onClick={() => {
                handleExportToExcel();
              }}
            >
              {t('exportToExcel')}
            </Button>
          </Stack>
        </Stack>
        {/* <div>
          <Button
            startIcon={<Plus fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={() => {
              setShowCreateDialog(true);
            }}
          >
            {t('enrollUsers')}
          </Button>
        </div> */}
      </Stack>
      <UserExamProgressFilters onFilter={handleFilter} quizUsecase={quizUsecase} />
      <UserExamProgressTable
        rows={userQuizProgress}
        count={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onDeleteUserQuizProgress={handleDeleteUserQuizProgress}
        onEditUserQuizProgress={handleEditUserQuizProgress}
        onRefresh={fetchUserQuizProgress}
      />

      {/* <CreateUserQuizProgressDialog
        onSubmit={handleCreateUserQuizProgress}
        disabled={false}
        loading={createLoading}
        open={showCreateDialog}
        onClose={() => {
          setShowCreateDialog(false);
        }}
      /> */}
    </Stack>
  );
}
