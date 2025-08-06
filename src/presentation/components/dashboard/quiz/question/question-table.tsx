import React from 'react';
import { type UpdateQuestionRequest } from '@/domain/models/question/request/update-question-request';
import { type QuestionResponse } from '@/domain/models/question/response/question-response';
import { CancelOutlined, CheckCircleOutline, MoreVert } from '@mui/icons-material';
import { Avatar, Box, IconButton, Stack, TableCell, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
            label: t('viewDetails'),
            onClick: (row) => {
              setEditQuestionData(row);
              setViewOpen(true);
            },
          },
          {
            label: t('edit'),
            onClick: (row) => {
              setEditQuestionData(row);
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
            <TableCell>{t('type')}</TableCell>
            <TableCell>{t('canShuffle')}</TableCell>
            <TableCell>{t('point')}</TableCell>
            <TableCell>{t('status')}</TableCell>
            <TableCell>{t('totalAnswers')}</TableCell>
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
              <Typography variant="body2">
                {row.questionType ? t(row.questionType.charAt(0).toLowerCase() + t(row.questionType).slice(1)) : ''}
              </Typography>
            </TableCell>
            <TableCell>
              {row.canShuffle ? (
                <CheckCircleOutline sx={{ color: 'var(--mui-palette-primary-main)' }} />
              ) : (
                <CancelOutlined sx={{ color: 'var(--mui-palette-error-main)' }} />
              )}
            </TableCell>

            <TableCell>{row.point}</TableCell>

            <TableCell>{row.status ? t(row.status.charAt(0).toLowerCase() + t(row.status).slice(1)) : ''}</TableCell>

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
