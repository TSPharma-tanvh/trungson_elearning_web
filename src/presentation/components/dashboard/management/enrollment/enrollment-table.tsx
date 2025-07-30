import React from 'react';
import { type UpdateEnrollmentCriteriaRequest } from '@/domain/models/enrollment/request/update-enrollment-criteria-request';
import { type EnrollmentCriteriaDetailResponse } from '@/domain/models/enrollment/response/enrollment-criteria-detail-response';
import { MoreVert } from '@mui/icons-material';
import { Box, IconButton, Stack, TableCell, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomTable } from '@/presentation/components/core/custom-table';
import { ConfirmDeleteDialog } from '@/presentation/components/core/dialog/confirm-delete-dialog';

import EnrollmentDetailForm from './enrollment-detail-form';
import { UpdateEnrollmentFormDialog } from './enrollment-update-form';

interface EnrollmentTableProps {
  rows: EnrollmentCriteriaDetailResponse[];
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteEnrollments: (ids: string[]) => Promise<void>;
  onEditEnrollment: (data: UpdateEnrollmentCriteriaRequest) => Promise<void>;
}

export default function EnrollmentTable({
  rows,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onDeleteEnrollments,
  onEditEnrollment,
}: EnrollmentTableProps) {
  const { t } = useTranslation();
  const [editOpen, setEditOpen] = React.useState(false);
  const [editEnrollmentData, setEditEnrollmentData] = React.useState<EnrollmentCriteriaDetailResponse | null>(null);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleRequestDelete = (id: string) => {
    setPendingDeleteId(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (pendingDeleteId) {
      await onDeleteEnrollments([pendingDeleteId]);
      setPendingDeleteId(null);
    }
    setDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setPendingDeleteId(null);
    setDialogOpen(false);
  };

  return (
    <>
      <CustomTable<EnrollmentCriteriaDetailResponse>
        rows={rows}
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        getRowId={(row) => row.id}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        onDelete={onDeleteEnrollments}
        actionMenuItems={[
          {
            label: t('viewDetails'),
            onClick: (row) => {
              setEditEnrollmentData(row);
              setViewOpen(true);
            },
          },
          {
            label: t('edit'),
            onClick: (row) => {
              setEditEnrollmentData(row);
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
            <TableCell>{t('targetType')}</TableCell>
            <TableCell>{t('maxCapacity')}</TableCell>
            <TableCell>{t('disableStatus')}</TableCell>
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
            <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word', minWidth: 300 }}>
              <Typography variant="body2">{row.desc}</Typography>
            </TableCell>
            <TableCell>{row.enrollmentCriteriaType}</TableCell>
            <TableCell>{row.maxCapacity}</TableCell>
            <TableCell>{row.enrollmentStatus}</TableCell>
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

      {editEnrollmentData ? (
        <UpdateEnrollmentFormDialog
          open={editOpen}
          data={editEnrollmentData}
          onClose={() => {
            setEditOpen(false);
          }}
          onSubmit={async (updatedData) => {
            await onEditEnrollment(updatedData);
            setEditOpen(false);
          }}
        />
      ) : null}

      {editEnrollmentData ? (
        <EnrollmentDetailForm
          open={viewOpen}
          enrollmentId={editEnrollmentData.id ?? null}
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
    </>
  );
}
