'use client';

import React from 'react';
import { GetUserDevicesRequest } from '@/domain/models/user-devices/request/get-user-devices-request';
import { type UpdateUserDevicesRequest } from '@/domain/models/user-devices/request/update-user-devices-request';
import { type UserDeviceResponse } from '@/domain/models/user-devices/response/user-devices-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { UserDevicesFilters } from '@/presentation/components/dashboard/management/devices/user-devices-filter';
import UserDevicesTable from '@/presentation/components/dashboard/management/devices/user-devices-table';

export default function Page(): React.JSX.Element {
  const { userDevicesUsecase } = useDI();
  const { t } = useTranslation();

  const [filters, setFilters] = React.useState<GetUserDevicesRequest>(
    new GetUserDevicesRequest({ pageNumber: 1, pageSize: 10 })
  );
  const [userDevices, setUserDevices] = React.useState<UserDeviceResponse[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [_deleteLoading, setDeleteLoading] = React.useState(false);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const fetchUserDevices = React.useCallback(async () => {
    try {
      const request = new GetUserDevicesRequest({
        ...filters,
        pageNumber: page + 1,
        pageSize: rowsPerPage,
      });
      const { devices, totalRecords } = await userDevicesUsecase.getUserDevicesListInfo(request);
      setUserDevices(devices);
      setTotalCount(totalRecords);
    } catch (error) {
      setUserDevices([]);
      return undefined;
    }
  }, [filters, page, rowsPerPage, userDevicesUsecase]);

  React.useEffect(() => {
    void fetchUserDevices();
  }, [fetchUserDevices]);

  const handleFilter = (newFilters: GetUserDevicesRequest) => {
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

  const handleEditUserDevice = async (request: UpdateUserDevicesRequest) => {
    try {
      await userDevicesUsecase.updateUserDevices(request);
      await fetchUserDevices();
    } catch (error) {
      return undefined;
    }
  };

  const handleDeleteUserDevices = async (ids: string[]) => {
    try {
      setDeleteLoading(true);
      for (const id of ids) {
        const response = await userDevicesUsecase.deleteUserDevices(id);
        if (!response) {
          throw new Error(`Failed to delete path with ID: ${id}`);
        }
      }
      await fetchUserDevices();
    } catch (error) {
      return undefined;
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4" sx={{ color: 'var(--mui-palette-secondary-main)' }}>
            {t('userDevice')}
          </Typography>
        </Stack>
      </Stack>
      <UserDevicesFilters onFilter={handleFilter} />
      <UserDevicesTable
        rows={userDevices}
        count={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onDeleteUserDevices={handleDeleteUserDevices}
        onEditUserDevices={handleEditUserDevice}
      />
    </Stack>
  );
}
