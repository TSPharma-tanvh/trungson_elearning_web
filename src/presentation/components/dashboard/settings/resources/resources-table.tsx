'use client';

import React, { useState } from 'react';
import { type UpdateFileResourcesRequest } from '@/domain/models/file/request/update-file-resource-request';
import { type FileResourcesResponseForAdmin } from '@/domain/models/file/response/file-resources-for-admin-response';
import { MoreVert } from '@mui/icons-material';
import { Avatar, Box, IconButton, Stack, TableCell, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomTable } from '@/presentation/components/core/custom-table';
import { ConfirmDeleteDialog } from '@/presentation/components/core/dialog/confirm-delete-dialog';
import ImagePreviewDialog from '@/presentation/components/shared/file/image-preview-dialog';

import ResourceDetailForm from './resource-detail-form';
import { UpdateFileResourcesDialog } from './update-resource-form';

interface FileResourcesTableProps {
  rows: FileResourcesResponseForAdmin[];
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteFileResources: (ids: string[]) => Promise<void>;
  onEditFileResources: (data: UpdateFileResourcesRequest) => Promise<void>;
}

export default function FileResourcesTable({
  rows,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onDeleteFileResources,
  onEditFileResources,
}: FileResourcesTableProps) {
  const { t } = useTranslation();
  const [selectedRow, setSelectedRow] = React.useState<FileResourcesResponseForAdmin | null>(null);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [editFileResourcesData, setEditFileResourcesData] = React.useState<FileResourcesResponseForAdmin | null>(null);
  const [editOpen, setEditOpen] = React.useState(false);
  const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fullScreenQR, setFullScreenQR] = useState(false);

  const handleRequestDelete = (id: string) => {
    setPendingDeleteId(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (pendingDeleteId) {
      await onDeleteFileResources([pendingDeleteId]);
      setPendingDeleteId(null);
    }
    setDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setPendingDeleteId(null);
    setDialogOpen(false);
  };
  const handleView = (row: FileResourcesResponseForAdmin) => {
    setSelectedRow(row);
    setViewOpen(true);
  };

  const handleEdit = (row: FileResourcesResponseForAdmin) => {
    setEditFileResourcesData(row);
    setEditOpen(true);
  };

  return (
    <>
      <CustomTable<FileResourcesResponseForAdmin>
        rows={rows}
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        getRowId={(row) => row.id ?? ''}
        renderHeader={() => (
          <>
            <TableCell>{t('name')}</TableCell>
            <TableCell>{t('type')}</TableCell>
            <TableCell>{t('size')} (MB)</TableCell>
            <TableCell>{t('category')}</TableCell>
            <TableCell>{t('fileClassQRRelation')}</TableCell>
            <TableCell>{t('fileClassRelation')}</TableCell>
            <TableCell>{t('fileCourseRelation')}</TableCell>
            <TableCell>{t('fileLessonRelation')}</TableCell>
            <TableCell>{t('fileQuestionRelation')}</TableCell>
            <TableCell>{t('fileQuizRelation')}</TableCell>
            <TableCell>{t('createdByUser')}</TableCell>
            <TableCell>{t('updatedByUser')}</TableCell>
          </>
        )}
        renderRow={(row, isSelected, onSelect, onActionClick) => (
          <>
            <TableCell>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box>
                  <Typography variant="subtitle2" noWrap>
                    {row.name}
                  </Typography>
                </Box>
              </Stack>
            </TableCell>
            <TableCell>{row.type}</TableCell>
            <TableCell>{row.size ? (row.size / (1024 * 1024)).toFixed(3) : 0}</TableCell>
            <TableCell>{row.category?.categoryName}</TableCell>
            <TableCell>{row.fileClassQRRelation?.length}</TableCell>
            <TableCell>{row.fileClassRelation?.length}</TableCell>
            <TableCell>{row.fileCourseRelation?.length}</TableCell>
            <TableCell>{row.fileLessonRelation?.length}</TableCell>
            <TableCell>{row.fileQuestionRelation?.length}</TableCell>
            <TableCell>{row.fileQuizRelation?.length}</TableCell>
            <TableCell sx={{ width: '25%' }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar src={row?.createdByUser?.employee?.avatar}>{row?.createdByUser?.employee?.name}</Avatar>
                <Box>
                  <Typography variant="subtitle2" noWrap>
                    {row?.createdByUser?.employee?.name}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" noWrap>
                    {row?.createdByUser?.userName}
                  </Typography>
                </Box>
              </Stack>
            </TableCell>{' '}
            <TableCell sx={{ width: '25%' }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar src={row?.updatedByUser?.employee?.avatar}>{row?.updatedByUser?.employee?.name}</Avatar>
                <Box>
                  <Typography variant="subtitle2" noWrap>
                    {row?.updatedByUser?.employee?.name}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" noWrap>
                    {row?.updatedByUser?.userName}
                  </Typography>
                </Box>
              </Stack>
            </TableCell>{' '}
            <TableCell align="right">
              <IconButton onClick={onActionClick}>
                <MoreVert />
              </IconButton>
            </TableCell>
          </>
        )}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        onDelete={onDeleteFileResources}
        actionMenuItems={[
          { label: t('viewDetails'), onClick: handleView },
          { label: t('edit'), onClick: handleEdit },
          {
            label: t('delete'),
            onClick: (row) => {
              if (row.id) handleRequestDelete(row.id);
            },
          },
        ]}
      />

      {editFileResourcesData ? (
        <UpdateFileResourcesDialog
          open={editOpen}
          data={editFileResourcesData}
          onClose={() => {
            setEditOpen(false);
          }}
          onSubmit={async (updatedData) => {
            await onEditFileResources(updatedData);
            setEditOpen(false);
          }}
        />
      ) : null}

      {selectedRow ? (
        <ResourceDetailForm
          open={viewOpen}
          resourceId={selectedRow.id ?? ''}
          onClose={() => {
            setViewOpen(false);
          }}
        />
      ) : null}

      <ConfirmDeleteDialog
        open={dialogOpen}
        selectedCount={1}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />

      {previewUrl ? (
        <ImagePreviewDialog
          open={Boolean(previewUrl)}
          onClose={() => {
            setPreviewUrl(null);
          }}
          imageUrl={previewUrl}
          title={t('imagePreview')}
          fullscreen={fullScreenQR}
          onToggleFullscreen={() => {
            setFullScreenQR((prev) => !prev);
          }}
        />
      ) : null}
    </>
  );
}
