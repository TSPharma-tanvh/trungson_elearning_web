'use client';

import React from 'react';
import { CreateUserQuizRequest } from '@/domain/models/user-quiz/request/create-user-quiz-request';
import { GetUserQuizProgressRequest } from '@/domain/models/user-quiz/request/get-user-quiz-progress-request';
import { UpdateUserQuizRequest } from '@/domain/models/user-quiz/request/update-quiz-progress-request';
import { UserQuizProgressDetailResponse } from '@/domain/models/user-quiz/response/user-quiz-progress-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { Button, Dialog, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import { Plus } from '@phosphor-icons/react';

import { CreateUserQuizProgressDialog } from '@/presentation/components/dashboard/progress/quiz/user-quiz-progress-create';
import { UserQuizProgressFilters } from '@/presentation/components/dashboard/progress/quiz/user-quiz-progress-filter';
import UserQuizProgressTable from '@/presentation/components/dashboard/progress/quiz/user-quiz-progress-table';

export default function Page(): React.JSX.Element {
  const { userQuizProgressUsecase } = useDI();

  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = React.useState(false);
  const [filters, setFilters] = React.useState<GetUserQuizProgressRequest>(
    new GetUserQuizProgressRequest({ pageNumber: 1, pageSize: 10 })
  );
  const [userQuizProgress, setUserQuizProgress] = React.useState<UserQuizProgressDetailResponse[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const fetchUserQuizProgress = React.useCallback(async () => {
    try {
      const request = new GetUserQuizProgressRequest({
        ...filters,
        pageNumber: page + 1,
        pageSize: rowsPerPage,
      });
      const { progress, totalRecords } = await userQuizProgressUsecase.getUserQuizProgressListInfo(request);
      setUserQuizProgress(progress);
      setTotalCount(totalRecords);
    } catch (error) {
      setUserQuizProgress([]);
    }
  }, [filters, page, rowsPerPage, userQuizProgressUsecase]);

  React.useEffect(() => {
    fetchUserQuizProgress();
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

  const handleCreateUserQuizProgress = async (request: CreateUserQuizRequest) => {
    try {
      await userQuizProgressUsecase.createUserQuizProgress(request);
      setShowCreateDialog(false);
      await fetchUserQuizProgress();
    } catch (error) {
      console.error('Failed to create userQuizProgress lesson:', error);
    }
  };

  const handleEditUserQuizProgress = async (request: UpdateUserQuizRequest) => {
    try {
      await userQuizProgressUsecase.updateUserQuizProgress(request);
      await fetchUserQuizProgress();
    } catch (error) {
      console.error('Failed to update userQuizProgress lesson:', error);
    }
  };

  const handleDeleteUserQuizProgresss = async (ids: string[]) => {
    try {
      setDeleteLoading(true);

      const response = await userQuizProgressUsecase.deleteUserQuizProgress(ids);
      if (!response) {
        throw new Error(`Failed to delete lesson with ID: ${ids}`);
      }

      await fetchUserQuizProgress();
    } catch (error) {
      console.error('Failed to delete userQuizProgress:', error);
      throw error;
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4" sx={{ color: 'var(--mui-palette-secondary-main)' }}>
            User Quiz Progress
          </Typography>
        </Stack>
        <Button
          startIcon={<Plus fontSize="var(--icon-fontSize-md)" />}
          variant="contained"
          onClick={() => setShowCreateDialog(true)}
        >
          Enroll Users
        </Button>
      </Stack>
      <UserQuizProgressFilters onFilter={handleFilter} />
      <UserQuizProgressTable
        rows={userQuizProgress}
        count={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onDeleteUserQuizProgresss={handleDeleteUserQuizProgresss}
        onEditUserQuizProgress={handleEditUserQuizProgress}
      ></UserQuizProgressTable>

      <CreateUserQuizProgressDialog
        onSubmit={handleCreateUserQuizProgress}
        disabled={false}
        loading={false}
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      />
    </Stack>
  );
}
