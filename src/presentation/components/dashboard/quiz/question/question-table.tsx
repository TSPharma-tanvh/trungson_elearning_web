import React from 'react';
import { type UpdateQuestionRequest } from '@/domain/models/question/request/update-question-request';
import { type QuestionResponse } from '@/domain/models/question/response/question-response';
import { MoreVert } from '@mui/icons-material';
import { Avatar, Box, IconButton, Stack, TableCell, Typography } from '@mui/material';

import { CustomTable } from '@/presentation/components/core/custom-table';
import { ConfirmDeleteDialog } from '@/presentation/components/core/dialog/confirm-delete-dialog';

import QuestionDetailForm from './question-detail';
import { UpdateQuestionFormDialog } from './question-update-form';

interface QuestionTableProps {
  rows: QuestionResponse[];
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteQuestions: (ids: string[]) => Promise<void>;
  onEditQuestion: (data: UpdateQuestionRequest) => Promise<void>;
}

export default function QuestionTable({
  rows,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onDeleteQuestions,
  onEditQuestion,
}: QuestionTableProps) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [editQuestionData, setEditQuestionData] = React.useState<QuestionResponse | null>(null);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleRequestDelete = (id: string) => {
    setPendingDeleteId(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (pendingDeleteId) {
      await onDeleteQuestions([pendingDeleteId]);
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
      <CustomTable<QuestionResponse>
        rows={rows}
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        getRowId={(row) => row.id}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        onDelete={onDeleteQuestions}
        actionMenuItems={[
          {
            label: 'View Details',
            onClick: (row) => {
              setEditQuestionData(row);
              setViewOpen(true);
            },
          },
          {
            label: 'Edit',
            onClick: (row) => {
              setEditQuestionData(row);
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
            <TableCell>Type</TableCell>
            <TableCell>Can Shuffle</TableCell>
            <TableCell>Point</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Total Answers</TableCell>
          </>
        )}
        renderRow={(row, isSelected, onSelect, onActionClick) => (
          <>
            <TableCell>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar src={row.thumbnail?.resourceUrl}>{row.questionText?.[0]}</Avatar>
                <Box>
                  <Typography variant="subtitle2" noWrap>
                    {row.questionText}
                  </Typography>
                </Box>
              </Stack>
            </TableCell>
            <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word', minWidth: 300 }}>
              <Typography variant="body2">{row.questionType}</Typography>
            </TableCell>
            <TableCell>{row.canShuffle ? 'Yes' : 'No'}</TableCell>

            <TableCell>{row.point}</TableCell>

            <TableCell>{row.status}</TableCell>

            <TableCell>{row.totalAnswer}</TableCell>

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

      {editQuestionData ? (
        <UpdateQuestionFormDialog
          open={editOpen}
          data={editQuestionData}
          onClose={() => {
            setEditOpen(false);
          }}
          onSubmit={async (updatedData) => {
            await onEditQuestion(updatedData);
            setEditOpen(false);
          }}
        />
      ) : null}

      {editQuestionData ? (
        <QuestionDetailForm
          open={viewOpen}
          questionId={editQuestionData.id ?? null}
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
