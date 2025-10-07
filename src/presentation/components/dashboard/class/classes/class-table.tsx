import React, { useState } from 'react';
import { type UpdateClassRequest } from '@/domain/models/class/request/update-class-request';
import { type ClassResponse } from '@/domain/models/class/response/class-response';
import { MoreVert } from '@mui/icons-material';
import { Avatar, Box, IconButton, Stack, TableCell, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomTable } from '@/presentation/components/core/custom-table';
import ImagePreviewDialog from '@/presentation/components/shared/file/image-preview-dialog';

import { ConfirmDeleteDialog } from '../../../core/dialog/confirm-delete-dialog';
import ClassDetailForm from './class-detail-form';
import { UpdateClassFormDialog } from './update-class-form';

interface ClassTableProps {
  rows: ClassResponse[];
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteClass: (ids: string[]) => Promise<void>;
  onEditClass: (data: UpdateClassRequest) => Promise<void>;
}

export default function ClassTable({
  rows,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onDeleteClass,
  onEditClass,
}: ClassTableProps) {
  const { t } = useTranslation();
  const [selectedRow, setSelectedRow] = React.useState<ClassResponse | null>(null);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [editClassData, setEditClassData] = React.useState<ClassResponse | null>(null);
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
      await onDeleteClass([pendingDeleteId]);
      setPendingDeleteId(null);
    }
    setDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setPendingDeleteId(null);
    setDialogOpen(false);
  };
  const handleView = (row: ClassResponse) => {
    setSelectedRow(row);
    setViewOpen(true);
  };

  const handleEdit = (row: ClassResponse) => {
    setEditClassData(row);
    setEditOpen(true);
  };

  return (
    <>
      <CustomTable<ClassResponse>
        rows={rows}
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        getRowId={(row) => row.id}
        renderHeader={() => (
          <>
            <TableCell>{t('name')}</TableCell>
            <TableCell>{t('detail')}</TableCell>
            <TableCell>{t('duration')}</TableCell>
            <TableCell>{t('attendanceRecordsCount')}</TableCell>
            <TableCell>{t('enrollmentCriteriaCount')}</TableCell>
            <TableCell>{t('teacher')}</TableCell>
            <TableCell>{t('classType')}</TableCell>
            <TableCell>{t('scheduleStatus')}</TableCell>
            <TableCell>{t('category')}</TableCell>
          </>
        )}
        renderRow={(row, isSelected, onSelect, onActionClick) => (
          <>
            <TableCell>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar src={row.thumbnail?.resourceUrl}>{row.className?.[0]}</Avatar>
                <Box>
                  <Typography variant="subtitle2" noWrap>
                    {row.className}
                  </Typography>
                </Box>
              </Stack>
            </TableCell>
            <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word', minWidth: 300 }}>
              <Typography variant="body2">{row.classDetail}</Typography>
            </TableCell>
            <TableCell>{row.duration}</TableCell>

            <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word', minWidth: 30, maxWidth: 80 }}>
              <Typography variant="body2">
                {row.attendanceRecords !== undefined ? row.attendanceRecords.length : ''}
              </Typography>
            </TableCell>
            <TableCell>{row.enrollmentCriteria !== undefined ? row.enrollmentCriteria.length : ''}</TableCell>
            <TableCell>{row.classTeacher?.user?.employee?.name}</TableCell>

            <TableCell>
              {row.classType ? t(row.classType.charAt(0).toLowerCase() + t(row.classType).slice(1)) : ''}
            </TableCell>
            <TableCell>
              {row.scheduleStatus ? t(row.scheduleStatus.charAt(0).toLowerCase() + t(row.scheduleStatus).slice(1)) : ''}
            </TableCell>
            <TableCell>{row.category?.categoryName}</TableCell>
            <TableCell align="right">
              <IconButton onClick={onActionClick}>
                <MoreVert />
              </IconButton>
            </TableCell>
          </>
        )}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        onDelete={onDeleteClass}
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

      {editClassData ? (
        <UpdateClassFormDialog
          open={editOpen}
          classes={editClassData}
          onClose={() => {
            setEditOpen(false);
          }}
          onSubmit={async (updatedData) => {
            await onEditClass(updatedData);
            setEditOpen(false);
          }}
        />
      ) : null}

      {selectedRow ? (
        <ClassDetailForm
          open={viewOpen}
          classId={selectedRow.id}
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
