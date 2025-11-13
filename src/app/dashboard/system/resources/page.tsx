'use client';

import * as React from 'react';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type FileResourcesResponseForAdmin } from '@/domain/models/file/response/file-resources-for-admin-response';
import { type CreateFileResourcesRequest } from '@/domain/models/file/resquest/create-file-resource-request';
import { GetFileResourcesRequest } from '@/domain/models/file/resquest/get-file-resource-request';
import { type UpdateFileResourcesRequest } from '@/domain/models/file/resquest/update-file-resource-request';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { Button, Typography } from '@mui/material';
import { Stack, useMediaQuery, useTheme } from '@mui/system';
import { Plus } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CreateFileResourcesDialog } from '@/presentation/components/dashboard/settings/resources/create-resource-form';
import { ResourceFilters } from '@/presentation/components/dashboard/settings/resources/resource-filter';
import FileResourcesTable from '@/presentation/components/dashboard/settings/resources/resources-table';

export default function Page(): React.JSX.Element {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();
  const { fileUsecase } = useDI();

  //value
  const [filters, setFilters] = React.useState<GetFileResourcesRequest>(
    new GetFileResourcesRequest({ pageNumber: 1, pageSize: 10 })
  );
  const [resources, setResources] = React.useState<FileResourcesResponseForAdmin[]>([]);
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalCount, setTotalCount] = React.useState(0);
  const [_deleteLoading, setDeleteLoading] = React.useState(false);

  //function
  const handleFilter = (newFilters: GetFileResourcesRequest) => {
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

  const fetchResources = React.useCallback(async () => {
    try {
      const request = new GetFileResourcesRequest({
        ...filters,
        pageNumber: page + 1,
        pageSize: rowsPerPage,
      });
      const { files: resourcesData, totalRecords } = await fileUsecase.getFileResourceList(request);
      setResources(resourcesData);
      setTotalCount(totalRecords);
    } catch (error) {
      return undefined;
    }
  }, [filters, page, rowsPerPage, fileUsecase]);

  React.useEffect(() => {
    void fetchResources();
  }, [fetchResources]);

  const handleCreateResources = async (request: CreateFileResourcesRequest): Promise<ApiResponse> => {
    try {
      const response = await fileUsecase.createResource(request);
      return response;
    } catch (error) {
      CustomSnackBar.showSnackbar(error instanceof Error ? error.message : 'Failed to update lesson', 'error');
      throw error;
    }
  };

  const handleEditResources = async (request: UpdateFileResourcesRequest) => {
    try {
      await fileUsecase.updateResource(request);
      await fetchResources();
    } catch (error) {
      return undefined;
    }
  };

  const handleDeleteResources = async (ids: string[]) => {
    try {
      setDeleteLoading(true);
      for (const id of ids) {
        const response = await fileUsecase.deleteResource(id);
        if (!response) {
          throw new Error(`Failed to delete path with ID: ${id}`);
        }
      }
      await fetchResources();
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
            {t('resources')}
          </Typography>
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

      <ResourceFilters onFilter={handleFilter} />
      <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
        <FileResourcesTable
          rows={resources}
          count={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onDeleteFileResources={handleDeleteResources}
          onEditFileResources={handleEditResources}
        />
      </Stack>

      <CreateFileResourcesDialog
        onSubmit={handleCreateResources}
        onSuccess={async () => {
          await fetchResources();
          setShowCreateDialog(false);
        }}
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
