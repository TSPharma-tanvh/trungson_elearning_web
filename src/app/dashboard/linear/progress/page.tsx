'use client';

import React from 'react';
import { GetUserCourseProgressRequest } from '@/domain/models/user-course/request/get-user-course-progress-request';
import { type UpdateUserCourseProgressRequest } from '@/domain/models/user-course/request/update-user-course-progress-request';
import { type UserCourseProgressResponse } from '@/domain/models/user-course/response/user-course-progress-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { CourseTypeEnum } from '@/utils/enum/core-enum';
import { Button, Stack, Typography } from '@mui/material';
import { FileXls } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';

import { UserCourseProgressFilters } from '@/presentation/components/dashboard/progress/course/user-course-progress-filter';
import UserCourseProgressTable from '@/presentation/components/dashboard/progress/course/user-course-progress-table';
import { UserLinearCourseProgressFilters } from '@/presentation/components/dashboard/progress/linear-course/user-linear-course-progress-filter';
import UserLinearCourseProgressTable from '@/presentation/components/dashboard/progress/linear-course/user-linear-course-progress-table';

export default function Page(): React.JSX.Element {
  const { t } = useTranslation();
  const { userCourseProgressUsecase, courseUsecase } = useDI();

  // const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [filters, setFilters] = React.useState<GetUserCourseProgressRequest>(
    new GetUserCourseProgressRequest({ pageNumber: 1, pageSize: 10 })
  );
  const [userCourseProgress, setUserCourseProgress] = React.useState<UserCourseProgressResponse[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [_deleteLoading, setDeleteLoading] = React.useState(false);
  // const [createLoading, setCreateLoading] = React.useState(false);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const fetchUserCourseProgress = React.useCallback(async () => {
    try {
      const request = new GetUserCourseProgressRequest({
        ...filters,
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        courseType: CourseTypeEnum[CourseTypeEnum.Linear],
      });
      const { courses, totalRecords } = await userCourseProgressUsecase.getUserCourseProgressListInfo(request);
      setUserCourseProgress(courses);
      setTotalCount(totalRecords);
    } catch (error) {
      setUserCourseProgress([]);
    }
  }, [filters, page, rowsPerPage, userCourseProgressUsecase]);

  React.useEffect(() => {
    void fetchUserCourseProgress();
  }, [fetchUserCourseProgress]);

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

  // const handleCreateUserCourseProgress = async (request: EnrollUserListToCourseRequest) => {
  //   try {
  //     setCreateLoading(true);

  //     await userCourseProgressUsecase.enrollUserCourseProgress(request);
  //     setShowCreateDialog(false);
  //     await fetchUserCourseProgress();
  //   } catch (error) {
  //     return undefined;
  //   } finally {
  //     setCreateLoading(false);
  //   }
  // };

  const handleEditUserCourseProgress = async (request: UpdateUserCourseProgressRequest) => {
    try {
      await userCourseProgressUsecase.updateUserCourseProgress(request);
      await fetchUserCourseProgress();
    } catch (error) {
      return undefined;
    }
  };

  const handleDeleteUserCourseProgress = async (ids: string[]) => {
    try {
      setDeleteLoading(true);
      for (const id of ids) {
        const response = await userCourseProgressUsecase.deleteUserCourseProgress(id);
        if (!response) {
          throw new Error(`Failed to delete course with ID: ${id}`);
        }
      }
      await fetchUserCourseProgress();
    } catch (error) {
      return undefined;
    } finally {
      setDeleteLoading(false);
    }
  };

  // const handleExportToExcel = () => {
  //   const exportData = userCourseProgress.map((row) => ({
  //     [t('id')]: row.id ?? '',
  //     [t('courseName')]: row.courses?.name ?? '',
  //     [t('pathId')]: row.courses?.coursePath?.name ?? '',
  //     [t('userName')]: row.user?.userName ?? '',
  //     [t('fullName')]: row.user?.employee?.name ?? '',
  //     [t('gender')]: row.user?.employee?.gender ?? '',
  //     [t('progress')]: row.progress ?? '',
  //     [t('startDate')]: row.startDate ? DateTimeUtils.formatISODateStringToString(row.startDate) : '',
  //     [t('endDate')]: row.endDate ? DateTimeUtils.formatISODateStringToString(row.endDate) : '',
  //     [t('actualStartDate')]: row.actualStartDate ? DateTimeUtils.formatISODateStringToString(row.actualStartDate) : '',
  //     [t('actualEndDate')]: row.actualEndDate ? DateTimeUtils.formatISODateStringToString(row.actualEndDate) : '',
  //     [t('lastAccess')]: row.lastAccess ? DateTimeUtils.formatISODateStringToString(row.lastAccess) : '',
  //     [t('progressStatus')]: row.status ? t(row.status.toLowerCase()) : '',
  //   }));

  //   const ws = XLSX.utils.json_to_sheet(exportData);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'UserCourseProgress');

  //   // Use DateTimeUtils to get the date and time string in YYYYMMDD_hhmmss format
  //   const dateTimeString = DateTimeUtils.getTodayAsString();
  //   XLSX.writeFile(wb, `UserCourseProgress_${dateTimeString}.xlsx`);
  // };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4" sx={{ color: 'var(--mui-palette-secondary-main)' }}>
            {t('userCourseProgress')}
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
      <UserLinearCourseProgressFilters onFilter={handleFilter} courseUsecase={courseUsecase} />
      <UserLinearCourseProgressTable
        rows={userCourseProgress}
        count={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onDeleteUserCourseProgress={handleDeleteUserCourseProgress}
        onEditUserCourseProgress={handleEditUserCourseProgress}
      />

      {/* <CreateUserCourseProgressDialog
        onSubmit={handleCreateUserCourseProgress}
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
