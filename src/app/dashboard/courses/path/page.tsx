'use client';

import React from 'react';
import { type CreateCoursePathRequest } from '@/domain/models/path/request/create-path-request';
import { GetPathRequest } from '@/domain/models/path/request/get-path-request';
import { type UpdateCoursePathRequest } from '@/domain/models/path/request/update-path-request';
import { type CoursePathResponse } from '@/domain/models/path/response/course-path-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { Button, Stack, Typography } from '@mui/material';
import { Plus } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

import CoursePathDetailForm from '@/presentation/components/dashboard/courses/path/course-path-detail-form';
import { CreateCoursePathDialog } from '@/presentation/components/dashboard/courses/path/create-path-form';
import { PathFilters } from '@/presentation/components/dashboard/courses/path/path-filter';
import CoursePathTable from '@/presentation/components/dashboard/courses/path/path-table';
import { UpdatePathFormDialog } from '@/presentation/components/dashboard/courses/path/update-path-form';

export default function Page(): React.JSX.Element {
  const { t } = useTranslation();
  const { pathUseCase } = useDI();
  const [paths, setPaths] = React.useState<CoursePathResponse[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalCount, setTotalCount] = React.useState(0);
  const [filters, setFilters] = React.useState<GetPathRequest>(new GetPathRequest({ pageNumber: 1, pageSize: 10 }));
  const [selectedPath, setSelectedPath] = React.useState<CoursePathResponse | null>(null);
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = React.useState(false);
  const [pathToEdit, setPathToEdit] = React.useState<CoursePathResponse | null>(null);
  const [_deleteLoading, setDeleteLoading] = React.useState(false);

  const fetchPaths = React.useCallback(async () => {
    try {
      const { path, totalRecords } = await pathUseCase.getPathListInfo(filters);
      setPaths(path);
      setTotalCount(totalRecords);
    } catch (error) {
      return undefined;
    }
  }, [filters, page, rowsPerPage, pathUseCase]);

  React.useEffect(() => {
    void fetchPaths();
  }, [fetchPaths]);

  const handleFilter = (newFilters: GetPathRequest) => {
    setPage(0);
    setFilters(newFilters);
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(event.target.value, 10);
    setRowsPerPage(newSize);
    setPage(0);
  };

  const handleEditCoursePath = async (request: UpdateCoursePathRequest) => {
    try {
      await pathUseCase.updatePathInfo(request);
      await fetchPaths();
    } catch (error) {
      return undefined;
    }
  };

  const handleDeletePaths = async (ids: string[]) => {
    try {
      setDeleteLoading(true);
      for (const id of ids) {
        const response = await pathUseCase.deletePath(id);
        if (!response) {
          throw new Error(`Failed to delete path with ID: ${id}`);
        }
      }
      await fetchPaths();
    } catch (error) {
      return undefined;
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCreateCoursePath = async (request: CreateCoursePathRequest) => {
    try {
      await pathUseCase.createPath(request);
      setShowCreateDialog(false);
      await fetchPaths();
    } catch (error) {
      return undefined;
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4" sx={{ color: 'var(--mui-palette-secondary-main)' }}>
            {t('path')}
          </Typography>
        </Stack>
        <Button
          startIcon={<Plus fontSize="var(--icon-fontSize-md)" />}
          variant="contained"
          onClick={() => {
            setShowCreateDialog(true);
          }}
        >
          {t('add')}
        </Button>
      </Stack>
      <PathFilters onFilter={handleFilter} />
      <CoursePathTable
        rows={paths}
        count={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onDeleteCoursePaths={handleDeletePaths}
        onEditCoursePath={handleEditCoursePath}
      />
      {selectedPath ? (
        <CoursePathDetailForm
          open={showForm}
          coursePathId={selectedPath?.id ?? null}
          onClose={() => {
            setShowForm(false);
            setSelectedPath(null);
          }}
        />
      ) : null}
      <UpdatePathFormDialog
        open={showUpdateDialog}
        path={pathToEdit}
        onClose={() => {
          setShowUpdateDialog(false);
          setPathToEdit(null);
        }}
        onSubmit={handleEditCoursePath}
      />
      <CreateCoursePathDialog
        onSubmit={handleCreateCoursePath}
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
