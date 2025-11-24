import React from 'react';
import { type UpdateQuizRequest } from '@/domain/models/quiz/request/update-quiz-request';
import { type QuizResponse } from '@/domain/models/quiz/response/quiz-response';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { MoreVert } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  IconButton,
  MenuItem,
  MenuList,
  Popover,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { ConfirmDeleteDialog } from '../../../core/dialog/confirm-delete-dialog';
import QuizDetailForm from './exam-detail-form';
import { UpdateExamFormDialog } from './exam-update-form';

interface ExamTableProps {
  rows: QuizResponse[];
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  // onDeleteQuizzes: (ids: string[]) => Promise<void>;
  onDeleteQuizPermanent: (ids: string[]) => Promise<void>;
  onEditQuiz: (data: UpdateQuizRequest) => Promise<void>;
}

export default function ExamTable({
  rows,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  // onDeleteQuizzes,
  onDeleteQuizPermanent,
  onEditQuiz,
}: ExamTableProps) {
  const { t } = useTranslation();

  const rowIds = React.useMemo(() => rows.map((r) => r.id!), [rows]);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = React.useState<QuizResponse | null>(null);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [editQuizData, setEditPathData] = React.useState<QuizResponse | null>(null);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deletePermanentDialogOpen, setDeletePermanentDialogOpen] = React.useState(false);
  const [idsToDelete, setIdsToDelete] = React.useState<string[]>([]);

  const isSelected = (id: string) => selected.has(id);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(event.target.checked ? new Set(rowIds) : new Set());
  };

  const handleSelectOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, row: QuizResponse) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDeleteDialog = (ids: string[]) => {
    setIdsToDelete(ids);
    setDeleteDialogOpen(true);
  };

  const handleOpenDeletePermanentDialog = (ids: string[]) => {
    setIdsToDelete(ids);
    setDeletePermanentDialogOpen(true);
  };

  // const handleConfirmDelete = async () => {
  //   await onDeleteQuizzes(idsToDelete);
  //   setSelected((prev) => {
  //     const next = new Set(prev);
  //     idsToDelete.forEach((id) => next.delete(id));
  //     return next;
  //   });
  //   setDeleteDialogOpen(false);
  //   setIdsToDelete([]);
  // };

  const handleConfirmDeletePermanent = async () => {
    await onDeleteQuizPermanent(idsToDelete);
    setSelected((prev) => {
      const next = new Set(prev);
      idsToDelete.forEach((id) => next.delete(id));
      return next;
    });
    setDeletePermanentDialogOpen(false);
    setIdsToDelete([]);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setDeletePermanentDialogOpen(false);
    setIdsToDelete([]);
  };

  return (
    <>
      <Card
        sx={{
          p: 0,
          backgroundColor: 'var(--mui-palette-common-white)',
          color: 'var(--mui-palette-primary-main)',
          border: '1px solid var(--mui-palette-primary-main)',
          borderRadius: '16px',
        }}
      >
        {selected.size > 0 && (
          <Box
            display="flex"
            justifyContent="flex-end"
            p={2}
            sx={{ backgroundColor: 'var(--mui-palette-primary-main)' }}
          >
            <Button
              sx={{
                backgroundColor: 'var(--mui-palette-secondary-main)',
                color: 'var(--mui-palette-common-white)',
                '&:hover': { backgroundColor: 'var(--mui-palette-secondary-dark)' },
              }}
              variant="outlined"
              onClick={() => {
                handleOpenDeletePermanentDialog(Array.from(selected));
              }}
            >
              {t('deleteSelectedItems')} ({selected.size}){' '}
            </Button>
          </Box>
        )}

        <TableContainer>
          <Table>
            <TableHead
              sx={{
                '& .MuiTableCell-head': {
                  backgroundColor: 'var(--mui-palette-primary-main)',
                  color: 'var(--mui-palette-common-white)',
                },
                '& .MuiTableCell-body': {
                  borderBottom: '1px solid var(--mui-palette-primary-main)',
                },
              }}
            >
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.size === rows.length && rows.length > 0}
                    indeterminate={selected.size > 0 && selected.size < rows.length}
                    onChange={handleSelectAll}
                    sx={{
                      color: 'var(--mui-palette-common-white)',
                      '&.Mui-checked': {
                        color: 'var(--mui-palette-common-white)',
                      },
                      '&.MuiCheckbox-indeterminate': {
                        color: 'var(--mui-palette-common-white)',
                      },
                    }}
                  />
                </TableCell>
                <TableCell>{t('title')}</TableCell>
                <TableCell>{t('detail')}</TableCell>
                <TableCell>{t('time')}</TableCell>
                <TableCell>{t('lessonName')}</TableCell>
                {/* <TableCell>{t('type')}</TableCell> */}
                <TableCell>{t('totalQuestion')}</TableCell>
                <TableCell>{t('totalScore')}</TableCell>
                <TableCell>{t('scoreToPass')}</TableCell>
                <TableCell>{t('displayedQuestionCount')}</TableCell>
                {/* <TableCell>{t('canStartOver')}</TableCell> */}
                <TableCell>{t('canShuffle')}</TableCell>
                <TableCell>{t('isRequired')}</TableCell>
                <TableCell>{t('isFixedQuiz')}</TableCell>
                <TableCell>{t('duration')}</TableCell>
                <TableCell>{t('category')}</TableCell>
                <TableCell>{t('positionName')}</TableCell>
                <TableCell>{t('positionStateName')}</TableCell>
                <TableCell>{t('departmentTypeName')}</TableCell>
                <TableCell>{t('status')}</TableCell>
                {/* <TableCell>{t('isAutoSubmitted')}</TableCell> */}
                <TableCell align="right">{t('actions')}</TableCell>
              </TableRow>
            </TableHead>

            <TableBody
              sx={{
                '& .MuiTableCell-body': {
                  borderBottom: '1px solid var(--mui-palette-primary-main)',
                },
              }}
            >
              {rows.map((row) => {
                const isItemSelected = isSelected(row.id!);
                return (
                  <TableRow key={row.id} selected={isItemSelected} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onChange={() => {
                          handleSelectOne(row.id!);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar src={row.thumbnail?.resourceUrl}>{row.title?.[0]}</Avatar>
                        <Box>
                          <Typography variant="subtitle2" noWrap>
                            {row.title}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word', minWidth: 100 }}>
                      <Typography variant="body2">{row.description}</Typography>
                    </TableCell>
                    <TableCell>{row.time}</TableCell>
                    <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word', minWidth: 120 }}>
                      <Typography variant="body2">{row.lesson?.name}</Typography>
                    </TableCell>
                    {/* <TableCell>
                      {' '}
                      {row.type ? t(row.type.toString().charAt(0).toLowerCase() + t(row.type.toString()).slice(1)) : ''}
                    </TableCell> */}
                    <TableCell>{row.totalQuestion}</TableCell>
                    <TableCell>{row.totalScore}</TableCell>
                    <TableCell>{row.scoreToPass}</TableCell>
                    <TableCell>{row.displayedQuestionCount}</TableCell>
                    {/* <TableCell>{row.canStartOver ? t('yes') : t('no')}</TableCell> */}
                    <TableCell>{row.canShuffle ? t('yes') : t('no')}</TableCell>
                    <TableCell>{row.isRequired ? t('yes') : t('no')}</TableCell>{' '}
                    <TableCell>{row.isFixedQuiz ? t('yes') : t('no')}</TableCell>
                    <TableCell>
                      {row.isFixedQuiz
                        ? `${row.fixedQuizDayDuration} ${t('days')}`
                        : `${DateTimeUtils.formatDateTimeToDateString(row.startDate)} - ${DateTimeUtils.formatDateTimeToDateString(row.endDate)}`}
                    </TableCell>
                    <TableCell>{row.category?.categoryName}</TableCell>
                    <TableCell>{row.positionName}</TableCell>
                    <TableCell>{row.positionStateName}</TableCell>
                    <TableCell>{row.departmentTypeName}</TableCell>
                    <TableCell>
                      {' '}
                      {row.status ? t(row.status.charAt(0).toLowerCase() + t(row.status).slice(1)) : ''}
                    </TableCell>
                    {/* <TableCell>{row.isAutoSubmitted ? t('yes') : t('no')}</TableCell> */}
                    <TableCell align="right">
                      <IconButton
                        onClick={(event) => {
                          handleMenuClick(event, row);
                        }}
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={count}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          labelRowsPerPage={t('rowsPerPage')}
          labelDisplayedRows={() => {
            const totalPages = Math.ceil(count / rowsPerPage);
            return t('paginationInfo', { currentPage: page + 1, totalPages });
          }}
          sx={{
            '& .MuiTablePagination-actions button': {
              color: 'var(--mui-palette-primary-main)',
              '&.Mui-disabled': {
                color: 'var(--mui-palette-action-disabled)',
              },
            },

            // '& .MuiTablePagination-select': {
            //   color: 'var(--mui-palette-primary-main)',
            // },
            // '& .MuiTablePagination-displayedRows': {
            //   color: 'var(--mui-palette-primary-main)',
            // },
          }}
        />
      </Card>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              if (selectedRow) {
                setViewOpen(true);
              }
              handleMenuClose();
            }}
          >
            {t('viewDetails')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (selectedRow) {
                setEditPathData(selectedRow);
                setEditOpen(true);
              }
              handleMenuClose();
            }}
          >
            {t('edit')}
          </MenuItem>
          {/* <MenuItem
            onClick={() => {
              if (selectedRow?.id) handleOpenDeleteDialog([selectedRow.id]);
              handleMenuClose();
            }}
          >
            {t('delete')}
          </MenuItem> */}

          <MenuItem
            onClick={() => {
              if (selectedRow?.id) handleOpenDeletePermanentDialog([selectedRow.id]);
              handleMenuClose();
            }}
          >
            {t('deletePermanent')}
          </MenuItem>
        </MenuList>
      </Popover>

      {editQuizData ? (
        <UpdateExamFormDialog
          open={editOpen}
          data={editQuizData}
          onClose={() => {
            setEditOpen(false);
          }}
          onSubmit={async (updatedData) => {
            await onEditQuiz(updatedData);
            setEditOpen(false);
          }}
        />
      ) : null}

      {selectedRow ? (
        <QuizDetailForm
          open={viewOpen}
          quizId={selectedRow?.id ?? null}
          onClose={() => {
            setViewOpen(false);
          }}
        />
      ) : null}
      {/* 
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        selectedCount={idsToDelete.length}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="confirmDeleteTemporary"
        content="confirmDeleteItemTemporary"
      /> */}

      <ConfirmDeleteDialog
        open={deletePermanentDialogOpen}
        selectedCount={idsToDelete.length}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDeletePermanent}
        title="confirmDeletePermanent"
        content="confirmDeleteItemPermanent"
      />
    </>
  );
}
