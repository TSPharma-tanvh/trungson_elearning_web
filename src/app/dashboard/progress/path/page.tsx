'use client';

import React from 'react';
import { type EnrollUserListToPathRequest } from '@/domain/models/user-path/request/enroll-user-list-to-path-request';
import { GetUserPathProgressRequest } from '@/domain/models/user-path/request/get-user-path-progress-request';
import { type UpdateUserPathProgressRequest } from '@/domain/models/user-path/request/update-user-path-progress-request';
import { type UserPathProgressDetailResponse } from '@/domain/models/user-path/response/user-path-progress-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { Button, Stack, Typography } from '@mui/material';
import { FileXls, Plus } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';

import { CreateUserPathProgressDialog } from '@/presentation/components/dashboard/progress/path/user-path-progress-create';
import { UserPathProgressFilters } from '@/presentation/components/dashboard/progress/path/user-path-progress-filter';
import UserPathProgressTable from '@/presentation/components/dashboard/progress/path/user-path-progress-table';

export default function Page(): React.JSX.Element {
  const { t } = useTranslation();
  const { userPathProgressUsecase, pathUseCase, enrollUsecase } = useDI();

  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [filters, setFilters] = React.useState<GetUserPathProgressRequest>(
    new GetUserPathProgressRequest({ pageNumber: 1, pageSize: 10 })
  );
  const [userPathProgress, setUserPathProgress] = React.useState<UserPathProgressDetailResponse[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [_deleteLoading, setDeleteLoading] = React.useState(false);
  const [createLoading, setCreateLoading] = React.useState(false);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const fetchUserPathProgress = React.useCallback(async () => {
    try {
      const request = new GetUserPathProgressRequest({
        ...filters,
        pageNumber: page + 1,
        pageSize: rowsPerPage,
      });
      const { progress, totalRecords } = await userPathProgressUsecase.getUserPathProgressListInfo(request);
      setUserPathProgress(progress);
      setTotalCount(totalRecords);
    } catch (error) {
      setUserPathProgress([]);
    }
  }, [filters, page, rowsPerPage, userPathProgressUsecase]);

  React.useEffect(() => {
    void fetchUserPathProgress();
  }, [fetchUserPathProgress]);

  const handleFilter = (newFilters: GetUserPathProgressRequest) => {
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

  const handleCreateUserPathProgress = async (request: EnrollUserListToPathRequest) => {
    try {
      setCreateLoading(true);
      await userPathProgressUsecase.enrollUserPathProgress(request);
      setShowCreateDialog(false);
      await fetchUserPathProgress();
    } catch (error) {
      return undefined;
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditUserPathProgress = async (request: UpdateUserPathProgressRequest) => {
    try {
      await userPathProgressUsecase.updateUserPathProgress(request);
      await fetchUserPathProgress();
    } catch (error) {
      return undefined;
    }
  };

  const handleDeleteUserPathProgresss = async (ids: string[]) => {
    try {
      setDeleteLoading(true);
      for (const id of ids) {
        const response = await userPathProgressUsecase.deleteUserPathProgress(id);
        if (!response) {
          throw new Error(`Failed to delete path with ID: ${id}`);
        }
      }
      await fetchUserPathProgress();
    } catch (error) {
      return undefined;
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleExportToExcel = () => {
    const exportData = userPathProgress.map((row) => ({
      [t('id')]: row.id ?? '',
      [t('pathName')]: row.coursePath?.name ?? '',
      [t('userName')]: row.user?.userName ?? '',
      [t('fullName')]: row.user?.employee?.name ?? '',
      [t('gender')]: row.user?.employee?.gender ?? '',
      [t('progress')]: row.progress ?? '',
      [t('startDate')]: row.startDate ? DateTimeUtils.formatISODateStringToString(row.startDate) : '',
      [t('endDate')]: row.endDate ? DateTimeUtils.formatISODateStringToString(row.endDate) : '',
      [t('actualStartDate')]: row.actualStartDate ? DateTimeUtils.formatISODateStringToString(row.actualStartDate) : '',
      [t('actualEndDate')]: row.actualEndDate ? DateTimeUtils.formatISODateStringToString(row.actualEndDate) : '',
      [t('lastAccess')]: row.lastAccess ? DateTimeUtils.formatISODateStringToString(row.lastAccess) : '',
      [t('status')]: row.status ? t(row.status.toLowerCase()) : '',
      [t('currentPositionName')]: row.user?.employee?.currentPositionName ?? '',
      [t('currentPositionStateName')]: row.user?.employee?.currentPositionStateName ?? '',
      [t('currentDepartmentName')]: row.user?.employee?.currentDepartmentName ?? '',
      [t('cityName')]: row.user?.employee?.cityName ?? '',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'UserPathProgress');
    const dateTimeString = DateTimeUtils.getTodayAsString();
    XLSX.writeFile(wb, `UserPathProgress_${dateTimeString}.xlsx`);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4" sx={{ color: 'var(--mui-palette-secondary-main)' }}>
            {t('userPathProgress')}
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
        <div>
          {' '}
          <Button
            startIcon={<Plus fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={() => {
              setShowCreateDialog(true);
            }}
          >
            {t('enrollUsers')}
          </Button>
        </div>
      </Stack>
      <UserPathProgressFilters onFilter={handleFilter} pathUsecase={pathUseCase} enrollUsecase={enrollUsecase} />
      <UserPathProgressTable
        rows={userPathProgress}
        count={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onDeleteUserPathProgresss={handleDeleteUserPathProgresss}
        onEditUserPathProgress={handleEditUserPathProgress}
      />

      <CreateUserPathProgressDialog
        onSubmit={handleCreateUserPathProgress}
        disabled={false}
        loading={createLoading}
        open={showCreateDialog}
        onClose={() => {
          setShowCreateDialog(false);
        }}
      />
    </Stack>
  );
}
