'use client';

import React from 'react';
import { CreateUserCourseProgressRequest } from '@/domain/models/user-course/request/create-user-course-progress-request';
import { EnrollUserListToCourseRequest } from '@/domain/models/user-course/request/enroll-user-list-to-course';
import { GetUserCourseProgressRequest } from '@/domain/models/user-course/request/get-user-course-progress-request';
import { UpdateUserCourseProgressRequest } from '@/domain/models/user-course/request/update-user-course-progress-request';
import { UserCourseProgressResponse } from '@/domain/models/user-course/response/user-course-progress-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { Button, Dialog, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import { Plus } from '@phosphor-icons/react';

export default function Page(): React.JSX.Element {
  const { userCourseProgressUsecase } = useDI();

  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = React.useState(false);
  const [filters, setFilters] = React.useState<GetUserCourseProgressRequest>(
    new GetUserCourseProgressRequest({ pageNumber: 1, pageSize: 10 })
  );
  const [userCourseProgress, setUserCourseProgress] = React.useState<UserCourseProgressResponse[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const fetchUserCourseProgresss = React.useCallback(async () => {
    try {
      const request = new GetUserCourseProgressRequest({
        ...filters,
        pageNumber: page + 1,
        pageSize: rowsPerPage,
      });
      const { courses, totalRecords } = await userCourseProgressUsecase.getUserCourseProgressListInfo(request);
      setUserCourseProgress(courses);
      setTotalCount(totalRecords);
    } catch (error) {
      setUserCourseProgress([]);
    }
  }, [filters, page, rowsPerPage, userCourseProgressUsecase]);

  React.useEffect(() => {
    fetchUserCourseProgresss();
  }, [fetchUserCourseProgresss]);

  const handleFilter = (newFilters: GetUserCourseProgressRequest) => {
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

  const handleCreateUserCourseProgress = async (request: EnrollUserListToCourseRequest) => {
    try {
      await userCourseProgressUsecase.enrollUserCourseProgress(request);
      setShowCreateDialog(false);
      await fetchUserCourseProgresss();
    } catch (error) {
      console.error('Failed to create userCourseProgress course:', error);
    }
  };

  const handleEditUserCourseProgress = async (request: UpdateUserCourseProgressRequest) => {
    try {
      await userCourseProgressUsecase.updateUserCourseProgress(request);
      await fetchUserCourseProgresss();
    } catch (error) {
      console.error('Failed to update userCourseProgress course:', error);
    }
  };

  const handleDeleteUserCourseProgresss = async (ids: string[]) => {
    try {
      setDeleteLoading(true);
      for (const id of ids) {
        const response = await userCourseProgressUsecase.deleteUserCourseProgress(id);
        if (!response) {
          throw new Error(`Failed to delete course with ID: ${id}`);
        }
      }
      await fetchUserCourseProgresss();
    } catch (error) {
      console.error('Failed to delete userCourseProgress:', error);
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
            User Course Progress
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
      {/* <UserCourseProgressFilters onFilter={handleFilter} />
      <UserCourseProgressTable
        rows={userCourseProgress}
        count={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onDeleteUserCourseProgresss={handleDeleteUserCourseProgresss}
        onEditUserCourseProgress={handleEditUserCourseProgress}
      ></UserCourseProgressTable>

      <CreateUserCourseProgressDialog
        onSubmit={handleCreateUserCourseProgress}
        disabled={false}
        loading={false}
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      /> */}
    </Stack>
  );
}
