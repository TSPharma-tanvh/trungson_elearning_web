'use client';

import React from 'react';
import { type CreateCourseRequest } from '@/domain/models/courses/request/create-course-request';
import { GetCourseRequest } from '@/domain/models/courses/request/get-course-request';
import { type UpdateCourseRequest } from '@/domain/models/courses/request/update-course-request';
import { type CourseDetailResponse } from '@/domain/models/courses/response/course-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { CourseTypeEnum } from '@/utils/enum/core-enum';
import { Button, Stack, Typography } from '@mui/material';
import { FileXls, Plus } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';

import { CourseFilters } from '@/presentation/components/dashboard/courses/courses/course-filters';
import CourseTable from '@/presentation/components/dashboard/courses/courses/course-table';
import { CreateCourseDialog } from '@/presentation/components/dashboard/courses/courses/create-course-form';
import { LinearCourseFilters } from '@/presentation/components/dashboard/courses/linear-courses/linear-course-filters';
import LinearCourseTable from '@/presentation/components/dashboard/courses/linear-courses/linear-course-table';
import { LinearCreateCourseDialog } from '@/presentation/components/dashboard/courses/linear-courses/linear-create-course-form';

export default function Page(): React.JSX.Element {
  const { t } = useTranslation();
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
        courseType: CourseTypeEnum.Linear,
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

  const handleDeleteCoursesPermanently = async (ids: string[]) => {
    try {
      setDeleteLoading(true);
      for (const id of ids) {
        const response = await courseUsecase.deleteCoursePermanently(id);
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

  //export table data to Excel
  const handleExportToExcel = () => {
    const exportData = courses.map((row) => ({
      [t('id')]: row.id ?? '',
      [t('name')]: row.name ?? '',
      [t('detail')]: row.detail ?? '',
      [t('pathName')]: row.coursePath?.name ?? '',
      [t('required')]: row.isRequired ? t('yes') : t('no'),
      [t('disableStatus')]: row.disableStatus ? t(row.disableStatus.toLowerCase()) : '',
      [t('courseType')]: row.courseType ? t(row.courseType.toLowerCase()) : '',
      [t('scheduleStatus')]: row.scheduleStatus ? t(row.scheduleStatus.toLowerCase()) : '',
      [t('displayType')]: row.displayType ? t(row.displayType.toLowerCase()) : '',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Courses');

    const today = DateTimeUtils.getTodayAsString();

    XLSX.writeFile(wb, `Courses_${today}.xlsx`);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ display: 'flex', flex: '1 1 auto' }}>
          <Typography variant="h4" sx={{ color: 'var(--mui-palette-secondary-main)' }}>
            {t('allCourses')}
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

        <div>
          <Button
            startIcon={<Plus fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={() => {
              setShowCreateDialog(true);
            }}
            sx={{
              backgroundColor: 'var(--mui-palette-primary-main)',
              color: 'var(--mui-palette-common-white)',
              '&:hover': { backgroundColor: 'var(--mui-palette-primary-dark)' },
            }}
          >
            {t('add')}
          </Button>
        </div>
      </Stack>

      <LinearCourseFilters onFilter={handleFilter} />
      <LinearCourseTable
        rows={courses}
        count={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onDeleteCourses={handleDeleteCourses}
        onEditCourse={handleEditCourse}
        onDeleteCoursePermanently={handleDeleteCoursesPermanently}
      />

      <LinearCreateCourseDialog
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
