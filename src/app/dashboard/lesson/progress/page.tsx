'use client';

import React from 'react';
import { GetUserLessonProgressRequest } from '@/domain/models/user-lesson/request/get-user-lesson-request';
import { type UpdateUserLessonRequest } from '@/domain/models/user-lesson/request/update-user-lesson-request';
import { type UserLessonProgressDetailResponse } from '@/domain/models/user-lesson/response/user-lesson-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { LessonTypeEnum } from '@/utils/enum/core-enum';
import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { UserLessonProgressIndependentFilters } from '@/presentation/components/dashboard/progress/lesson-independent/user-lesson-independent-progress-filter';
import UserLessonProgressIndependentTable from '@/presentation/components/dashboard/progress/lesson-independent/user-lesson-independent-progress-table';

export default function Page(): React.JSX.Element {
  const { t } = useTranslation();
  const { userLessonProgressUsecase, lessonUsecase } = useDI();

  const [filters, setFilters] = React.useState<GetUserLessonProgressRequest>(
    new GetUserLessonProgressRequest({ pageNumber: 1, pageSize: 10 })
  );
  const [userLessonProgress, setUserLessonProgress] = React.useState<UserLessonProgressDetailResponse[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [_deleteLoading, setDeleteLoading] = React.useState(false);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const fetchUserLessonProgress = React.useCallback(async () => {
    try {
      const request = new GetUserLessonProgressRequest({
        ...filters,
        lessonType: LessonTypeEnum.Independent,
        pageNumber: page + 1,
        pageSize: rowsPerPage,
      });
      const { progress, totalRecords } = await userLessonProgressUsecase.getUserLessonProgressListInfo(request);
      setUserLessonProgress(progress);
      setTotalCount(totalRecords);
    } catch (error) {
      setUserLessonProgress([]);
      return undefined;
    }
  }, [filters, page, rowsPerPage, userLessonProgressUsecase]);

  React.useEffect(() => {
    void fetchUserLessonProgress();
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

  const handleEditUserLessonProgress = async (request: UpdateUserLessonRequest) => {
    try {
      await userLessonProgressUsecase.updateUserLessonProgress(request);
      await fetchUserLessonProgress();
    } catch (error) {
      return undefined;
    }
  };

  const handleDeleteUserLessonProgresses = async (ids: string[]) => {
    try {
      setDeleteLoading(true);
      for (const id of ids) {
        const response = await userLessonProgressUsecase.deleteUserLessonPermanently(id);
        if (!response) {
          throw new Error(`Failed to delete lesson with ID: ${id}`);
        }
      }
      await fetchUserLessonProgress();
    } catch (error) {
      return undefined;
    } finally {
      setDeleteLoading(false);
    }
  };

  // const handleExportToExcel = () => {
  //   // Prepare data for export
  //   const exportData = userLessonProgress.map((row) => ({
  //     [t('id')]: row.id ?? '',
  //     [t('lessonName')]: row.lessons?.name ?? '',
  //     [t('userName')]: row.user?.userName ?? '',
  //     [t('fullName')]: row.user?.employee?.name ?? '',
  //     [t('gender')]: row.user?.employee?.gender ?? '',
  //     [t('progress')]: row.progress ?? '',
  //     [t('startDate')]: row.startDate ? DateTimeUtils.formatDateTimeToDateString(row.startDate) : '',
  //     [t('endDate')]: row.endDate ? DateTimeUtils.formatDateTimeToDateString(row.endDate) : '',
  //     [t('actualStartDate')]: row.actualStartDate ? DateTimeUtils.formatISODateStringToString(row.actualStartDate) : '',
  //     [t('actualEndDate')]: row.actualEndDate ? DateTimeUtils.formatISODateStringToString(row.actualEndDate) : '',
  //     [t('lastAccess')]: row.lastAccess ? DateTimeUtils.formatISODateStringToString(row.lastAccess) : '',
  //     [t('status')]: row.status ? t(row.status.toLowerCase()) : '',
  //   }));

  //   const ws = XLSX.utils.json_to_sheet(exportData);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'UserLessonProgress');
  //   const dateTimeString = DateTimeUtils.getTodayAsString();
  //   XLSX.writeFile(wb, `UserLessonProgress_${dateTimeString}.xlsx`);
  // };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4" sx={{ color: 'var(--mui-palette-secondary-main)' }}>
            {t('userLessonProgress')}
          </Typography>
          {/* <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button
              color="inherit"
              startIcon={<FileXls fontSize="var(--icon-fontSize-md)" />}
              onClick={() => {
                handleExportToExcel();
              }}
            >
              {t('exportToExcel')}
            </Button>
          </Stack> */}
        </Stack>
        {/* <Button
          startIcon={<Plus fontSize="var(--icon-fontSize-md)" />}
          variant="contained"
          onClick={() => {
            setShowCreateDialog(true);
          }}
        >
          {t('enrollUsers')}
        </Button> */}
      </Stack>
      <UserLessonProgressIndependentFilters onFilter={handleFilter} lessonUsecase={lessonUsecase} />
      <UserLessonProgressIndependentTable
        rows={userLessonProgress}
        count={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onDeleteUserLessonProgresss={handleDeleteUserLessonProgresses}
        onEditUserLessonProgress={handleEditUserLessonProgress}
      />

      {/* <CreateUserLessonProgressDialog
        onSubmit={handleCreateUserLessonProgress}
        disabled={false}
        loading={false}
        open={showCreateDialog}
        onClose={() => {
          setShowCreateDialog(false);
        }}
      /> */}
    </Stack>
  );
}
