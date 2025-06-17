'use client';

import React from 'react';
import { GetPathRequest } from '@/domain/models/path/request/get-path-request';
import { UpdateCoursePathRequest } from '@/domain/models/path/request/update-path-request';
import { CoursePathResponse } from '@/domain/models/path/response/course-path-response';
import { useDI } from '@/presentation/hooks/useDependencyContainer';
import { Button, Stack, Typography } from '@mui/material';
import { Plus } from '@phosphor-icons/react';

import { CoursePathDetailForm } from '@/presentation/components/courses/path/course-path-detail-form';
import { PathFilters } from '@/presentation/components/courses/path/path-filter';
import CoursePathTable from '@/presentation/components/courses/path/path-table';

export default function Page(): React.JSX.Element {
  const { pathUseCase } = useDI();
  const [paths, setPaths] = React.useState<CoursePathResponse[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalCount, setTotalCount] = React.useState(0);
  const [filters, setFilters] = React.useState<GetPathRequest>(new GetPathRequest({ pageNumber: 1, pageSize: 10 }));
  const [selectedPath, setSelectedPath] = React.useState<CoursePathResponse | null>(null);

  const fetchPaths = React.useCallback(async () => {
    try {
      const request = new GetPathRequest({
        ...filters,
        pageNumber: page + 1,
        pageSize: rowsPerPage,
      });
      const { path, totalRecords } = await pathUseCase.getPathListInfo(request);
      setPaths(path);
      setTotalCount(totalRecords);
    } catch (error) {
      console.error('Failed to fetch course paths:', error);
    }
  }, [filters, page, rowsPerPage, pathUseCase]);

  React.useEffect(() => {
    fetchPaths();
  }, [fetchPaths]);

  const handleFilter = (newFilters: GetPathRequest) => {
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

  const viewCoursePath = async (item: CoursePathResponse) => {
    try {
      const detail = await pathUseCase.getPathDetailInfo(item.id ?? '');
      setSelectedPath(detail);
      setShowForm(true);
    } catch (error) {
      console.error('Failed to fetch course path detail:', error);
    }
  };

  const handleEditCoursePath = async (request: UpdateCoursePathRequest) => {
    try {
      await pathUseCase.updatePathInfo(request);
      await fetchPaths();
    } catch (error) {
      console.error('Failed to update course path:', error);
    }
  };

  const handleDeletePaths = async (ids: string[]) => {
    try {
      // Implement delete logic
      console.log('Deleting paths:', ids);
      await fetchPaths();
    } catch (error) {
      console.error('Failed to delete course paths:', error);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Path</Typography>
        </Stack>
        <Button
          startIcon={<Plus fontSize="var(--icon-fontSize-md)" />}
          variant="contained"
          onClick={() => setShowForm(true)}
        >
          Add
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

      {selectedPath && (
        <CoursePathDetailForm
          open={showForm}
          coursePathId={selectedPath?.id ?? null}
          onClose={() => {
            setShowForm(false);
            setSelectedPath(null);
          }}
        />
      )}
    </Stack>
  );
}
