'use client';

import React from 'react';
import { type CreateCourseRequest } from '@/domain/models/courses/request/create-course-request';
import { GetCourseRequest } from '@/domain/models/courses/request/get-course-request';
import { type UpdateCourseRequest } from '@/domain/models/courses/request/update-course-request';
import { type CourseDetailResponse } from '@/domain/models/courses/response/course-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { Button, Stack, Typography } from '@mui/material';
import { Plus } from '@phosphor-icons/react';

import { CourseFilters } from '@/presentation/components/dashboard/courses/courses/course-filters';
import CourseTable from '@/presentation/components/dashboard/courses/courses/course-table';
import { CreateCourseDialog } from '@/presentation/components/dashboard/courses/courses/create-course-form';

export default function Page(): React.JSX.Element {
  const { courseUsecase } = useDI();

  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [filters, setFilters] = React.useState<GetCourseRequest>(new GetCourseRequest({ pageNumber: 1, pageSize: 10 }));
  const [courses, setCourses] = React.useState<CourseDetailResponse[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [_deleteLoading, setDeleteLoading] = React.useState(false);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const fetchCourses = React.useCallback(async () => {
    try {
      const request = new GetCourseRequest({
        ...filters,
        pageNumber: page + 1,
        pageSize: rowsPerPage,
      });
      const { courses: courseList, totalRecords } = await courseUsecase.getCourseListInfo(request);
      setCourses(courseList);
      setTotalCount(totalRecords);
    } catch (error) {
      setCourses([]);
    }
  }, [filters, page, rowsPerPage, courseUsecase]);

  React.useEffect(() => {
    void fetchCourses();
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

  const handleCreateCourse = async (request: CreateCourseRequest) => {
    try {
      await courseUsecase.createCourse(request);
      setShowCreateDialog(false);
      await fetchCourses();
    } catch (error) {
      return undefined;
    }
  };

  const handleEditCourse = async (request: UpdateCourseRequest) => {
    try {
      await courseUsecase.updateCourse(request);
      await fetchCourses();
    } catch (error) {
      return undefined;
    }
  };

  const handleDeleteCourses = async (ids: string[]) => {
    try {
      setDeleteLoading(true);
      for (const id of ids) {
        const response = await courseUsecase.deleteCourse(id);
        if (!response) {
          throw new Error(`Failed to delete course with ID: ${id}`);
        }
      }
      await fetchCourses();
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
            Courses
          </Typography>
        </Stack>
        <Button
          startIcon={<Plus fontSize="var(--icon-fontSize-md)" />}
          variant="contained"
          onClick={() => {
            setShowCreateDialog(true);
          }}
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
        onDeleteCourses={handleDeleteCourses}
        onEditCourse={handleEditCourse}
      />

      <CreateCourseDialog
        onSubmit={handleCreateCourse}
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
