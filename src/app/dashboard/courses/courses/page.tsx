'use client';

import React from 'react';
import { GetCourseRequest } from '@/domain/models/courses/request/get-course-request';
import { UpdateCourseRequest } from '@/domain/models/courses/request/update-course-request';
import { CourseDetailResponse } from '@/domain/models/courses/response/course-detail-response';
import { CourseDetailListResult } from '@/domain/models/courses/response/course-detail-result';
import { CourseResponse } from '@/domain/models/courses/response/course-response';
import { useDI } from '@/presentation/hooks/useDependencyContainer';
import { Button, Stack, Typography } from '@mui/material';
import { Plus } from '@phosphor-icons/react';

import { CourseFilters } from '@/presentation/components/dashboard/courses/course-filters';
import CourseTable from '@/presentation/components/dashboard/courses/course-table';

// import { CourseFilters } from '@/presentation/components/dashboard/courses/course-filters';

export default function Page(): React.JSX.Element {
  const { courseUsecase } = useDI();

  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = React.useState(false);
  const [filters, setFilters] = React.useState<GetCourseRequest>(new GetCourseRequest({ pageNumber: 1, pageSize: 10 }));
  const [courses, setCourses] = React.useState<CourseDetailResponse[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const fetchCourses = React.useCallback(async () => {
    try {
      const request = new GetCourseRequest({
        ...filters,
        pageNumber: page + 1,
        pageSize: rowsPerPage,
      });
      const { courses, totalRecords } = await courseUsecase.getCourseListInfo(request);
      setCourses(courses);
      setTotalCount(totalRecords);
    } catch (error) {
      console.error('Failed to fetch course paths:', error);
    }
  }, [filters, page, rowsPerPage, courseUsecase]);

  React.useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleFilter = (newFilters: GetCourseRequest) => {
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

  const handleEditCoursePath = async (request: UpdateCourseRequest) => {};

  const handleDeleteCourses = async (ids: string[]) => {};

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Courses</Typography>
        </Stack>
        <Button
          startIcon={<Plus fontSize="var(--icon-fontSize-md)" />}
          variant="contained"
          onClick={() => setShowCreateDialog(true)}
        >
          Add
        </Button>
      </Stack>
      <CourseFilters onFilter={handleFilter} />
      <CourseTable
        rows={courses}
        count={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onDeleteCoursePaths={handleDeleteCourses}
        onEditCoursePath={handleEditCoursePath}
      ></CourseTable>
    </Stack>
  );
}
