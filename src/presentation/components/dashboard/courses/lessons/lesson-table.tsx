import React from 'react';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type UpdateLessonRequest } from '@/domain/models/lessons/request/update-lesson-request';
import { type LessonDetailResponse } from '@/domain/models/lessons/response/lesson-detail-response';
import { CancelOutlined, CheckCircleOutline, MoreVert, Visibility } from '@mui/icons-material';
import { Avatar, Box, IconButton, Stack, TableCell, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomTable } from '@/presentation/components/core/custom-table';
import { ConfirmDeleteDialog } from '@/presentation/components/core/dialog/confirm-delete-dialog';
import ImagePreviewDialog from '@/presentation/components/shared/file/image-preview-dialog';
import VideoPreviewDialog from '@/presentation/components/shared/file/video-preview-dialog';

import { UpdateLessonFormDialog } from './edit-lesson-form';
import LessonDetailForm from './lesson-detail-form';

interface LessonTableProps {
  rows: LessonDetailResponse[];
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteLessonPaths: (ids: string[]) => Promise<void>;
  onEditLesson: (data: UpdateLessonRequest, options?: { suppressSuccessMessage?: boolean }) => Promise<ApiResponse>;
  onEditSuccess: () => void;
}

export default function LessonTable({
  rows,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onDeleteLessonPaths: onDeleteLesson,
  onEditLesson,
  onEditSuccess,
}: LessonTableProps) {
  const { t } = useTranslation();
  const [editLessonData, setEditLessonData] = React.useState<LessonDetailResponse | null>(null);
  const [editOpen, setEditOpen] = React.useState(false);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null);

  const [previewImageOpen, setPreviewImageOpen] = React.useState(false);
  const [previewVideoOpen, setPreviewVideoOpen] = React.useState(false);
  const [previewFile, setPreviewFile] = React.useState<{ url: string; title?: string } | null>(null);
  const [fullscreen, setFullscreen] = React.useState(false);

  const handleRequestDelete = (id: string) => {
    setPendingDeleteId(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (pendingDeleteId) {
      await onDeleteLesson([pendingDeleteId]);
      setPendingDeleteId(null);
    }
    setDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setPendingDeleteId(null);
    setDialogOpen(false);
  };

  const handlePreviewImage = (url: string, title?: string) => {
    setPreviewFile({ url, title });
    setPreviewImageOpen(true);
  };

  const handlePreviewVideo = (url: string, title?: string) => {
    setPreviewFile({ url, title });
    setPreviewVideoOpen(true);
  };

  return (
    <>
      <CustomTable<LessonDetailResponse>
        rows={rows}
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        getRowId={(row) => row.id}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        onDelete={onDeleteLesson}
        actionMenuItems={[
          {
            label: t('viewDetails'),
            onClick: (row) => {
              setEditLessonData(row);
              setViewOpen(true);
            },
          },
          {
            label: t('edit'),
            onClick: (row) => {
              setEditLessonData(row);
              setEditOpen(true);
            },
          },
          {
            label: t('delete'),
            onClick: (row) => {
              if (row.id) handleRequestDelete(row.id);
            },
          },
        ]}
        renderHeader={() => (
          <>
            <TableCell>{t('name')}</TableCell>
            <TableCell>{t('detail')}</TableCell>
            <TableCell>{t('courseName')}</TableCell>
            <TableCell>{t('enableAutoPlay')}</TableCell>
            <TableCell>{t('required')}</TableCell>
            <TableCell>{t('status')}</TableCell>
            <TableCell>{t('lessonType')}</TableCell>
            <TableCell>{t('category')}</TableCell>
            <TableCell>{t('contentType')}</TableCell>
            <TableCell>{t('contentCount')}</TableCell>
            <TableCell>{t('video')}</TableCell>
            <TableCell>{t('quiz')}</TableCell>
          </>
        )}
        renderRow={(row, isSelected, onSelect, onActionClick) => (
          <>
            <TableCell>
              <Stack direction="row" alignItems="center" spacing={2}>
                <IconButton
                  onClick={() => {
                    if (row.thumbnail?.resourceUrl) {
                      handlePreviewImage(row.thumbnail.resourceUrl, row.name);
                    }
                  }}
                  sx={{ p: 0 }}
                >
                  <Avatar src={row.thumbnail?.resourceUrl}>{row.name?.[0]}</Avatar>
                </IconButton>
                <Box>
                  <Typography variant="subtitle2" noWrap>
                    {row.name}
                  </Typography>
                </Box>
              </Stack>
            </TableCell>

            <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word', minWidth: 200 }}>
              <Typography variant="body2">{row.detail}</Typography>
            </TableCell>
            <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word', minWidth: 120 }}>
              <Typography variant="body2">{row.course?.name}</Typography>
            </TableCell>

            <TableCell>
              {row.enablePlay ? (
                <CheckCircleOutline sx={{ color: 'var(--mui-palette-primary-main)' }} />
              ) : (
                <CancelOutlined sx={{ color: 'var(--mui-palette-error-main)' }} />
              )}
            </TableCell>
            <TableCell>
              {row.isRequired ? (
                <CheckCircleOutline sx={{ color: 'var(--mui-palette-primary-main)' }} />
              ) : (
                <CancelOutlined sx={{ color: 'var(--mui-palette-error-main)' }} />
              )}
            </TableCell>
            <TableCell>{row.status ? t(row.status.charAt(0).toLowerCase() + t(row.status).slice(1)) : ''}</TableCell>
            <TableCell>
              {row.lessonType ? t(row.lessonType.charAt(0).toLowerCase() + t(row.lessonType).slice(1)) : ''}
            </TableCell>

            <TableCell>{row.category?.categoryName}</TableCell>
            <TableCell>{row.contentType}</TableCell>
            <TableCell>{row.fileLessonRelation?.length}</TableCell>
            <TableCell>
              {row.video?.resourceUrl ? (
                <IconButton
                  onClick={() => {
                    handlePreviewVideo(row?.video?.resourceUrl ?? '', row.name);
                  }}
                >
                  <Visibility fontSize="small" />
                </IconButton>
              ) : (
                ''
              )}
            </TableCell>

            <TableCell>{row.quizzes?.length ?? 0}</TableCell>

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

      {editLessonData ? (
        <UpdateLessonFormDialog
          open={editOpen}
          data={editLessonData}
          onClose={() => {
            setEditOpen(false);
            setEditLessonData(null);
          }}
          onSubmit={onEditLesson}
          onSuccess={() => {
            onEditSuccess();
            setEditOpen(false);
            setEditLessonData(null);
          }}
        />
      ) : null}

      {editLessonData ? (
        <LessonDetailForm
          open={viewOpen}
          lessonId={editLessonData.id ?? null}
          onClose={() => {
            setViewOpen(false);
            setEditLessonData(null);
          }}
        />
      ) : null}

      {previewFile?.url ? (
        <ImagePreviewDialog
          open={previewImageOpen}
          onClose={() => {
            setPreviewImageOpen(false);
            setPreviewFile(null);
          }}
          imageUrl={previewFile.url}
          title={previewFile.title}
          fullscreen={fullscreen}
          onToggleFullscreen={() => {
            setFullscreen((prev) => !prev);
          }}
        />
      ) : null}

      {previewFile?.url ? (
        <VideoPreviewDialog
          open={previewVideoOpen}
          onClose={() => {
            setPreviewVideoOpen(false);
            setPreviewFile(null);
          }}
          videoUrl={previewFile.url}
          title={previewFile.title}
          fullscreen={fullscreen}
          onToggleFullscreen={() => {
            setFullscreen((prev) => !prev);
          }}
        />
      ) : null}

      <ConfirmDeleteDialog
        open={dialogOpen}
        selectedCount={1}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
