import React from 'react';
import { type UpdateAnswerRequest } from '@/domain/models/answer/request/update-answer-request';
import { type AnswerDetailResponse } from '@/domain/models/answer/response/answer-detail-response';
import { Cancel, CheckCircle, MoreVert } from '@mui/icons-material';
import { Avatar, Box, IconButton, Stack, TableCell, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import { CustomTable } from '@/presentation/components/core/custom-table';
import { ConfirmDeleteDialog } from '@/presentation/components/core/dialog/confirm-delete-dialog';

import AnswerDetailForm from './answer-detail-form';
import { UpdateAnswerFormDialog } from './answer-update-form';

interface AnswerTableProps {
  rows: AnswerDetailResponse[];
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteAnswers: (ids: string[]) => Promise<void>;
  onEditAnswer: (data: UpdateAnswerRequest) => Promise<void>;
}

export default function AnswerTable({
  rows,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onDeleteAnswers,
  onEditAnswer,
}: AnswerTableProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  const [editOpen, setEditOpen] = React.useState(false);
  const [editAnswerData, setEditAnswerData] = React.useState<AnswerDetailResponse | null>(null);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleRequestDelete = (id: string) => {
    setPendingDeleteId(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (pendingDeleteId) {
      await onDeleteAnswers([pendingDeleteId]);
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
      <CustomTable<AnswerDetailResponse>
        rows={rows}
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        getRowId={(row) => row.id!}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        onDelete={onDeleteAnswers}
        actionMenuItems={[
          {
            label: t('viewDetails'),
            onClick: (row) => {
              setEditAnswerData(row);
              setViewOpen(true);
            },
          },
          {
            label: t('edit'),
            onClick: (row) => {
              setEditAnswerData(row);
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
            <TableCell>{t('isCorrect')}</TableCell>
            <TableCell>{t('category')}</TableCell>
            <TableCell>{t('status')}</TableCell>
          </>
        )}
        renderRow={(row, isSelected, onSelect, onActionClick) => (
          <>
            <TableCell sx={{ width: '65%' }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar src={row.thumbnail?.resourceUrl}>{row.answerText?.[0]}</Avatar>
                <Box>
                  <Typography variant="subtitle2" noWrap>
                    {row.answerText}
                  </Typography>
                </Box>
              </Stack>
            </TableCell>

            <TableCell>
              {row.isCorrect ? (
                <CheckCircle sx={{ color: theme.palette.primary.main }} titleAccess="Correct" />
              ) : (
                <Cancel sx={{ color: theme.palette.error.main }} titleAccess="Incorrect" />
              )}
            </TableCell>

            <TableCell>{row.category?.categoryName}</TableCell>

            <TableCell>{row.status ? t(row.status.charAt(0).toLowerCase() + t(row.status).slice(1)) : ''}</TableCell>

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

      {editAnswerData ? (
        <UpdateAnswerFormDialog
          open={editOpen}
          data={editAnswerData}
          onClose={() => {
            setEditOpen(false);
          }}
          onSubmit={async (updatedData) => {
            await onEditAnswer(updatedData);
            setEditOpen(false);
          }}
        />
      ) : null}

      {editAnswerData ? (
        <AnswerDetailForm
          open={viewOpen}
          answerId={editAnswerData.id ?? null}
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
