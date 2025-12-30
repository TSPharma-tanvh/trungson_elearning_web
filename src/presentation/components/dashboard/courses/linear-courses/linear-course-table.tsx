import React from 'react';
import { type UpdateCourseRequest } from '@/domain/models/courses/request/update-course-request';
import { type CourseDetailResponse } from '@/domain/models/courses/response/course-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { MoreVert } from '@mui/icons-material';
import { Avatar, Box, CircularProgress, Dialog, IconButton, Stack, TableCell, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomTable } from '@/presentation/components/core/custom-table';
import { ConfirmDeleteDialog } from '@/presentation/components/core/dialog/confirm-delete-dialog';

import CourseDetailForm from './linear-course-detail-form';
import LinearCourseDetailForm from './linear-course-detail-form';
import { LinearUpdateCourseFormDialog } from './linear-update-course-form-dialog';

interface LinearCourseTableProps {
  rows: CourseDetailResponse[];
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteCourses: (ids: string[]) => Promise<void>;
  onEditCourse: (data: UpdateCourseRequest) => Promise<void>;
  onDeleteCoursePermanently: (id: string[]) => Promise<void>;
}

export default function LinearCourseTable({
  rows,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onDeleteCourses,
  onEditCourse,
  onDeleteCoursePermanently,
}: LinearCourseTableProps) {
  const { t } = useTranslation();
  const { courseUsecase } = useDI();

  const [viewOpen, setViewOpen] = React.useState(false);
  // const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null);
  const [pendingDeleteIdPermanently, setPendingDeleteIdPermanently] = React.useState<string | null>(null);

  //edit
  const [editOpen, setEditOpen] = React.useState(false);
  const [editCourseData, setEditCourseData] = React.useState<CourseDetailResponse | null>(null);
  const [loadingEdit, setLoadingEdit] = React.useState(false);

  // const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogDeletePermanentOpen, setDialogDeletePermanentOpen] = React.useState(false);

  // const handleRequestDelete = (id: string) => {
  //   setPendingDeleteId(id);
  //   setDialogOpen(true);
  // };

  const handleRequestDeletePermanently = (id: string) => {
    setPendingDeleteIdPermanently(id);
    setDialogDeletePermanentOpen(true);
  };

  const handleConfirmDeletePermanently = async () => {
    if (pendingDeleteIdPermanently) {
      await onDeleteCoursePermanently([pendingDeleteIdPermanently]);
      setPendingDeleteIdPermanently(null);
    }
    setDialogDeletePermanentOpen(false);
  };

  const handleCancelDeletePermanently = async () => {
    await onDeleteCoursePermanently([]);
    setDialogDeletePermanentOpen(false);
  };

  // const handleConfirmDelete = async () => {
  //   if (pendingDeleteId) {
  //     await onDeleteCourses([pendingDeleteId]);
  //     setPendingDeleteId(null);
  //   }
  //   setDialogOpen(false);
  // };

  // const handleCancelDelete = () => {
  //   setPendingDeleteId(null);
  //   setDialogOpen(false);
  // };

  return (
    <>
      <CustomTable<CourseDetailResponse>
        rows={rows}
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        getRowId={(row) => row.id}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        onDelete={onDeleteCourses}
        actionMenuItems={[
          {
            label: t('viewDetails'),
            onClick: (row) => {
              setEditCourseData(row);
              setViewOpen(true);
            },
          },
          {
            label: t('edit'),
            onClick: async (row) => {
              if (!row.id) return;

              setLoadingEdit(true);
              try {
                const detail = await courseUsecase.getCourseById(row.id);
                setEditCourseData(detail);
                setEditOpen(true);
              } finally {
                setLoadingEdit(false);
              }
            },
          },
          // {
          //   label: t('delete'),
          //   onClick: (row) => {
          //     if (row.id) handleRequestDelete(row.id);
          //   },
          // },
          {
            label: t('deletePermanently'),
            onClick: (row) => {
              if (row.id) handleRequestDeletePermanently(row.id);
            },
          },
        ]}
        renderHeader={() => (
          <>
            <TableCell>{t('name')}</TableCell>
            <TableCell>{t('detail')}</TableCell>
            <TableCell>{t('courseDurationType')}</TableCell>
            <TableCell>{t('required')}</TableCell>
            <TableCell>{t('status')}</TableCell>
            {/* <TableCell>{t('courseType')}</TableCell> */}
            {/* <TableCell>{t('teacher')}</TableCell> */}
            {/* <TableCell>{t('displayType')}</TableCell> */}
            {/* <TableCell>{t('parts')}</TableCell> */}
            {/* <TableCell>{t('lessons')}</TableCell> */}
            {/* <TableCell>{t('category')}</TableCell> */}
            <TableCell>{t('positionName')}</TableCell>
            <TableCell>{t('positionStateName')}</TableCell>
            <TableCell>{t('departmentTypeName')}</TableCell>
          </>
        )}
        renderRow={(row, isSelected, onSelect, onActionClick) => (
          <>
            <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word', minWidth: 120 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar src={row.thumbnail?.resourceUrl}>{row.name?.[0]}</Avatar>
                <Box>
                  <Typography variant="subtitle2" noWrap>
                    {row.name}
                  </Typography>
                </Box>
              </Stack>
            </TableCell>
            <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word', minWidth: 150 }}>
              <Typography variant="body2">{row.detail}</Typography>
            </TableCell>
            <TableCell>{row.isFixedCourse ? t('duration') : t('time')}</TableCell>
            <TableCell>{row.isRequired ? t('yes') : t('no')}</TableCell>

            {/* <TableCell>
              {row.isRequired ? (
                <CheckCircleOutline sx={{ color: 'var(--mui-palette-primary-main)' }} />
              ) : (
                <CancelOutlined sx={{ color: 'var(--mui-palette-error-main)' }} />
              )}
            </TableCell> */}
            <TableCell>
              {row.disableStatus ? t(row.disableStatus.charAt(0).toLowerCase() + row.disableStatus.slice(1)) : ''}
            </TableCell>
            {/* <TableCell>
              {row.courseType ? t(row.courseType.charAt(0).toLowerCase() + row.courseType.slice(1)) : ''}
            </TableCell> */}
            {/* <TableCell
              sx={{
                minWidth: 120,
                whiteSpace: 'normal',
                wordBreak: 'break-word',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                {row.classTeacher?.user?.employee !== undefined ? (
                  <Avatar
                    src={
                      row.classTeacher?.user?.employee?.avatar !== undefined
                        ? row.classTeacher?.user?.employee?.avatar
                        : row.classTeacher?.user?.thumbnail?.resourceUrl
                    }
                  >
                    {row.classTeacher?.user?.employee?.name?.[0] || row.classTeacher?.user?.userName?.[0]}
                  </Avatar>
                ) : (
                  <div />
                )}

                <Box>
                  <Typography variant="subtitle2" noWrap>
                    {row.classTeacher?.user?.employee?.name || row.classTeacher?.user?.userName}
                  </Typography>
                  {row.classTeacher?.user?.userName ? (
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {row.classTeacher?.user?.userName}
                    </Typography>
                  ) : null}
                </Box>
              </Stack>
            </TableCell> */}
            {/* <TableCell>
              {row.displayType ? t(row.displayType.charAt(0).toLowerCase() + row.displayType.slice(1)) : ''}
            </TableCell> */}
            {/* <TableCell>{row.collections ? row.collections.length : 0}</TableCell>
            <TableCell>{row.category?.categoryName}</TableCell> */}
            <TableCell>{row.positionName}</TableCell>
            <TableCell>{row.positionStateName}</TableCell>
            <TableCell>{row.departmentTypeName}</TableCell>

            <TableCell align="right">
              <IconButton
                onClick={(e) => {
                  onActionClick(e as React.MouseEvent<HTMLElement>);
                }}
              >
                <MoreVert />
              </IconButton>
            </TableCell>
          </>
        )}
      />

      {loadingEdit ? (
        <Dialog open>
          <Box p={4} display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        </Dialog>
      ) : null}

      {editCourseData ? (
        <LinearUpdateCourseFormDialog
          open={editOpen}
          data={editCourseData}
          onClose={() => {
            setEditOpen(false);
          }}
          onSubmit={async (updatedData) => {
            await onEditCourse(updatedData);
            setEditOpen(false);
          }}
        />
      ) : null}

      {editCourseData ? (
        <LinearCourseDetailForm
          open={viewOpen}
          courseId={editCourseData.id ?? null}
          onClose={() => {
            setViewOpen(false);
          }}
        />
      ) : null}

      {/* <ConfirmDeleteDialog
        open={dialogOpen}
        selectedCount={1}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      /> */}

      <ConfirmDeleteDialog
        open={dialogDeletePermanentOpen}
        selectedCount={1}
        title="confirmDeletePermanently"
        content="confirmDeleteItemPermanently"
        onCancel={handleCancelDeletePermanently}
        onConfirm={handleConfirmDeletePermanently}
      />
    </>
  );
}
