import React from 'react';
import { UpdateAnswerRequest } from '@/domain/models/answer/request/update-answer-request';
import { AnswerDetailResponse } from '@/domain/models/answer/response/answer-detail-response';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { Cancel, CheckCircle, MoreVert } from '@mui/icons-material';
import { Avatar, Box, Checkbox, IconButton, Stack, TableCell, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

import { CustomTable } from '@/presentation/components/core/custom-table';
import { ConfirmDeleteDialog } from '@/presentation/components/core/dialog/confirm-delete-dialog';

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
            label: 'View Details',
            onClick: (row) => {
              setEditAnswerData(row);
              setViewOpen(true);
            },
          },
          {
            label: 'Edit',
            onClick: (row) => {
              setEditAnswerData(row);
              setEditOpen(true);
            },
          },
          {
            label: 'Delete',
            onClick: (row) => {
              if (row.id) handleRequestDelete(row.id);
            },
          },
        ]}
        renderHeader={() => (
          <>
            <TableCell>Name</TableCell>
            <TableCell>Is Correct</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Status</TableCell>
          </>
        )}
        renderRow={(row, isSelected, onSelect, onActionClick) => (
          <>
            <TableCell>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar src={row.thumbnail?.resourceUrl}>{row.answerText?.[0]}</Avatar>
                <Box sx={{ maxWidth: '80%' }}>
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

            <TableCell>{row.status}</TableCell>

            <TableCell align="right">
              <IconButton onClick={(e) => onActionClick(e as React.MouseEvent<HTMLElement>)}>
                <MoreVert />
              </IconButton>
            </TableCell>
          </>
        )}
      />

      {/* {editAnswerData && (
        <UpdateAnswerFormDialog
          open={editOpen}
          data={editAnswerData}
          onClose={() => setEditOpen(false)}
          onSubmit={async (updatedData) => {
            await onEditAnswer(updatedData);
            setEditOpen(false);
          }}
        />
      )}

      {editAnswerData && (
        <AnswerDetailForm open={viewOpen} questionId={editAnswerData.id ?? null} onClose={() => setViewOpen(false)} />
      )} */}

      <ConfirmDeleteDialog
        open={dialogOpen}
        selectedCount={1}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
