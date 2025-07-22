'use client';

import React from 'react';
import { CreateUserLessonRequest } from '@/domain/models/user-lesson/request/create-user-lesson-request';
import { GetUserLessonProgressRequest } from '@/domain/models/user-lesson/request/get-user-lesson-request';
import { UpdateUserLessonRequest } from '@/domain/models/user-lesson/request/update-user-lesson-request';
import { UserLessonProgressDetailResponse } from '@/domain/models/user-lesson/response/user-lesson-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { Button, Dialog, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import { Plus } from '@phosphor-icons/react';

import { UserLessonProgressFilters } from '@/presentation/components/dashboard/progress/lesson/user-lesson-progress-filter';
import UserLessonProgressTable from '@/presentation/components/dashboard/progress/lesson/user-lesson-progress-table';

export default function Page(): React.JSX.Element {
  const { userLessonProgressUsecase } = useDI();

  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = React.useState(false);
  const [filters, setFilters] = React.useState<GetUserLessonProgressRequest>(
    new GetUserLessonProgressRequest({ pageNumber: 1, pageSize: 10 })
  );
  const [userLessonProgress, setUserLessonProgress] = React.useState<UserLessonProgressDetailResponse[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const fetchUserLessonProgress = React.useCallback(async () => {
    try {
      const request = new GetUserLessonProgressRequest({
        ...filters,
        pageNumber: page + 1,
        pageSize: rowsPerPage,
      });
      const { progress, totalRecords } = await userLessonProgressUsecase.getUserLessonProgressListInfo(request);
      setUserLessonProgress(progress);
      setTotalCount(totalRecords);
    } catch (error) {
      setUserLessonProgress([]);
    }
  }, [filters, page, rowsPerPage, userLessonProgressUsecase]);

  React.useEffect(() => {
    fetchUserLessonProgress();
  }, [fetchUserLessonProgress]);

  const handleFilter = (newFilters: GetUserLessonProgressRequest) => {
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

  const handleCreateUserLessonProgress = async (request: CreateUserLessonRequest) => {
    try {
      await userLessonProgressUsecase.createUserLessonProgress(request);
      setShowCreateDialog(false);
      await fetchUserLessonProgress();
    } catch (error) {
      console.error('Failed to create userLessonProgress lesson:', error);
    }
  };

  const handleEditUserLessonProgress = async (request: UpdateUserLessonRequest) => {
    try {
      await userLessonProgressUsecase.updateUserLessonProgress(request);
      await fetchUserLessonProgress();
    } catch (error) {
      console.error('Failed to update userLessonProgress lesson:', error);
    }
  };

  const handleDeleteUserLessonProgresss = async (ids: string[]) => {
    try {
      setDeleteLoading(true);
      for (const id of ids) {
        const response = await userLessonProgressUsecase.deleteUserLessonProgress(id);
        if (!response) {
          throw new Error(`Failed to delete lesson with ID: ${id}`);
        }
      }
      await fetchUserLessonProgress();
    } catch (error) {
      console.error('Failed to delete userLessonProgress:', error);
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
            User Lesson Progress
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
      <UserLessonProgressFilters onFilter={handleFilter} />
      <UserLessonProgressTable
        rows={userLessonProgress}
        count={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onDeleteUserLessonProgresss={handleDeleteUserLessonProgresss}
        onEditUserLessonProgress={handleEditUserLessonProgress}
      ></UserLessonProgressTable>

      {/* <CreateUserLessonProgressDialog
        onSubmit={handleCreateUserLessonProgress}
        disabled={false}
        loading={false}
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      /> */}
    </Stack>
  );
}
