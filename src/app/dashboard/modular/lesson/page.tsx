'use client';

import React from 'react';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type CreateLessonRequest } from '@/domain/models/lessons/request/create-lesson-request';
import { GetLessonRequest } from '@/domain/models/lessons/request/get-lesson-request';
import { type UpdateLessonRequest } from '@/domain/models/lessons/request/update-lesson-request';
import { type LessonDetailResponse } from '@/domain/models/lessons/response/lesson-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { LessonTypeEnum } from '@/utils/enum/core-enum';
import { Button, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { FileXls, Plus } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CreateLessonDialog } from '@/presentation/components/dashboard/courses/lessons/create-lesson-form';
import LessonTable from '@/presentation/components/dashboard/courses/lessons/lesson-table';
import { LessonsFilters } from '@/presentation/components/dashboard/courses/lessons/lessons-filter';

export default function Page(): React.JSX.Element {
  const { t } = useTranslation();
  const { lessonUsecase } = useDI();
  const [filters, setFilters] = React.useState<GetLessonRequest>(new GetLessonRequest({ pageNumber: 1, pageSize: 10 }));
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [lessons, setLessons] = React.useState<LessonDetailResponse[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [_deleteLoading, setDeleteLoading] = React.useState(false);
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [_showEditDialog, setShowEditDialog] = React.useState(false);
  const [_selectedLesson, setSelectedLesson] = React.useState<LessonDetailResponse | null>(null);

  const fetchLessons = React.useCallback(async () => {
    try {
      const request = new GetLessonRequest({
        ...filters,
        lessonType: LessonTypeEnum.Course,
        pageNumber: page + 1,
        pageSize: rowsPerPage,
      });
      const { lessons: lessons, totalRecords } = await lessonUsecase.getLessonListInfo(request);
      setLessons(lessons);
      setTotalCount(totalRecords);
    } catch (error) {
      CustomSnackBar.showSnackbar(error instanceof Error ? error.message : 'Failed to fetch lessons', 'error');
    }
  }, [filters, page, rowsPerPage, lessonUsecase]);

  React.useEffect(() => {
    void fetchLessons();
  }, [fetchLessons]);

  const handleFilter = (newFilters: GetLessonRequest) => {
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

  const handleCreateLesson = async (request: CreateLessonRequest) => {
    try {
      await lessonUsecase.createLesson(request);
      setShowCreateDialog(false);
      await fetchLessons();
    } catch (error) {
      CustomSnackBar.showSnackbar(error instanceof Error ? error.message : 'Failed to create lesson', 'error');
    }
  };

  const handleEditLesson = async (request: UpdateLessonRequest): Promise<ApiResponse> => {
    try {
      const response = await lessonUsecase.updateLesson(request);

      return response;
    } catch (error) {
      CustomSnackBar.showSnackbar(error instanceof Error ? error.message : 'Failed to update lesson', 'error');
      throw error;
    }
  };

  //   const handleExportToExcel = () => {
  //     const exportData = lessons.map((row) => ({
  //       [t('id')]: row.id ?? '',
  //       [t('name')]: row.name ?? '',
  //       [t('detail')]: row.detail ?? '',
  //       [t('enableAutoPlay')]: row.enablePlay ? t('yes') : t('no'),
  //       [t('required')]: row.isRequired ? t('yes') : t('no'),
  //       [t('status')]: row.status ? t(row.status.toLowerCase()) : '',
  //       [t('lessonType')]: row.lessonType ? t(row.lessonType.toLowerCase()) : '',
  //       [t('category')]: row.category?.categoryName ?? '',
  //       [t('contentType')]: row.contentType ?? '',
  //       [t('contentCount')]: row.fileLessonRelation?.length ?? 0,
  //       [t('video')]: row.video?.resourceUrl ?? '',
  //       [t('quiz')]: row.quizzes?.length ?? 0,
  //     }));

  //     const ws = XLSX.utils.json_to_sheet(exportData);
  //     const wb = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(wb, ws, 'Lessons');

  //     const today = DateTimeUtils.getTodayAsString();

  //     XLSX.writeFile(wb, `Lessons_${today}.xlsx`);
  //   };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4" sx={{ color: 'var(--mui-palette-secondary-main)' }}>
            {t('courseLesson')}
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
          {' '}
          <Button
            startIcon={<Plus fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={() => {
              setShowCreateDialog(true);
            }}
          >
            {t('add')}
          </Button>
        </div> */}
      </Stack>
      <LessonsFilters onFilter={handleFilter} />
      <LessonTable
        rows={lessons}
        count={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onDeleteLessonPaths={handleDeleteLessons}
        onEditLesson={handleEditLesson}
        onEditSuccess={async () => {
          await fetchLessons();
          setShowEditDialog(false);
          setSelectedLesson(null);
        }}
      />
      {/* <CreateLessonDialog
        onSubmit={handleCreateLesson}
        disabled={false}
        loading={false}
        open={showCreateDialog}
        onClose={() => {
          setShowCreateDialog(false);
        }}
      /> */}
    </Stack>
  );

  async function handleDeleteLessons(ids: string[]) {
    try {
      setDeleteLoading(true);
      for (const id of ids) {
        const response = await lessonUsecase.deleteLesson(id);
        if (!response) {
          throw new Error(`Failed to delete lesson with ID: ${id}`);
        }
      }
      await fetchLessons();
    } catch (error) {
      CustomSnackBar.showSnackbar(error instanceof Error ? error.message : 'Failed to delete lessons', 'error');
    } finally {
      setDeleteLoading(false);
    }
  }
}
