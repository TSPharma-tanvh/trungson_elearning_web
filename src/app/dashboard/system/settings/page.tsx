'use client';

import * as React from 'react';
import { type CreateAppSettingsRequest } from '@/domain/models/settings/request/create-app-setting-request';
import { GetAppSettingsRequest } from '@/domain/models/settings/request/get-app-settings-request';
import { type UpdateAppSettingsRequest } from '@/domain/models/settings/request/update-app-setting-request';
import { type GetAppSettingsResponse } from '@/domain/models/settings/response/get-app-settings-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { Button, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import { Plus } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

import { CreateAppSettingDialog } from '@/presentation/components/dashboard/settings/settings/create-setting-form';
import AppSettingsTable from '@/presentation/components/dashboard/settings/settings/settings-table';

export default function Page(): React.JSX.Element {
  const { t } = useTranslation();
  const { settingUsecase } = useDI();

  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [settings, setSettings] = React.useState<GetAppSettingsResponse[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [filters, _setFilters] = React.useState<GetAppSettingsRequest>(
    new GetAppSettingsRequest({ pageNumber: 1, pageSize: 10 })
  );

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [_deleteLoading, setDeleteLoading] = React.useState(false);

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const fetchSettings = React.useCallback(async () => {
    try {
      const request = new GetAppSettingsRequest({
        ...filters,
        pageNumber: page + 1,
        pageSize: rowsPerPage,
      });
      const { settings: quiz, totalRecords } = await settingUsecase.getAppSettingListInfo(request);
      setSettings(quiz);
      setTotalCount(totalRecords);
    } catch (error) {
      setSettings([]);
    }
  }, [filters, page, rowsPerPage, settingUsecase]);

  React.useEffect(() => {
    void fetchSettings();
  }, [fetchSettings]);

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(event.target.value, 10);
    setRowsPerPage(newSize);
    setPage(0);
  };

  const handleCreateSetting = async (request: CreateAppSettingsRequest) => {
    try {
      await settingUsecase.createAppSetting(request);
      await fetchSettings();
    } catch (error) {
      return undefined;
    } finally {
      setShowCreateDialog(false);
    }
  };

  const handleEditSettings = async (request: UpdateAppSettingsRequest) => {
    try {
      await settingUsecase.updateAppSetting(request);
      await fetchSettings();
    } catch (error) {
      return undefined;
    }
  };

  const handleDeleteSettings = async (ids: string[]) => {
    try {
      setDeleteLoading(true);
      for (const id of ids) {
        const response = await settingUsecase.deleteAppSetting(id);
        if (!response) {
          throw new Error(`Failed to delete path with ID: ${id}`);
        }
      }
      await fetchSettings();
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
            {t('settings')}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }} />
        </Stack>
        <div>
          <Button
            startIcon={<Plus fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={() => {
              setShowCreateDialog(true);
            }}
          >
            {t('add')}
          </Button>
        </div>
      </Stack>
      <AppSettingsTable
        rows={settings}
        countData={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onEdit={handleEditSettings}
        onDelete={handleDeleteSettings}
      />

      <CreateAppSettingDialog
        onSubmit={handleCreateSetting}
        disabled={false}
        loading={false}
        open={showCreateDialog}
        onClose={() => {
          setShowCreateDialog(false);
        }}
      />
    </Stack>
  );
}
