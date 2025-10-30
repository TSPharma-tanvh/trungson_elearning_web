import React from 'react';
import { type UpdateUserQuizRequest } from '@/domain/models/user-quiz/request/update-quiz-progress-request';
import { type UserQuizProgressDetailResponse } from '@/domain/models/user-quiz/response/user-quiz-progress-detail-response';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { StatusEnum, UserQuizProgressEnum } from '@/utils/enum/core-enum';
import {
  CancelOutlined,
  Check,
  Close,
  DataUsage,
  DeleteOutline,
  MoreVert,
  ThumbDownOutlined,
  ThumbUpOutlined,
} from '@mui/icons-material';
import { Avatar, Box, IconButton, Stack, TableCell, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomTable } from '@/presentation/components/core/custom-table';
import { ConfirmDeleteDialog } from '@/presentation/components/core/dialog/confirm-delete-dialog';

import UserQuizProgressDetailForm from './user-quiz-progress-detail';
import { UpdateUserQuizProgressFormDialog } from './user-quiz-update-form';
import { UpdateUserQuizScoreFormDialog } from './user-quiz-update-score-form';

interface UserQuizProgressTableProps {
  rows: UserQuizProgressDetailResponse[];
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteUserQuizProgress: (id: string, quizId: string) => Promise<void>;
  onEditUserQuizProgress: (data: UpdateUserQuizRequest) => Promise<void>;
  onRefresh: () => Promise<void>;
}

export default function UserQuizProgressTable({
  rows,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onDeleteUserQuizProgress,
  onEditUserQuizProgress,
  onRefresh,
}: UserQuizProgressTableProps) {
  const { t } = useTranslation();
  const [editOpen, setEditOpen] = React.useState(false);
  const [scoreOpen, setScoreOpen] = React.useState(false);

  const [editUserQuizProgressData, setEditUserQuizProgressData] = React.useState<UserQuizProgressDetailResponse | null>(
    null
  );
  const [viewOpen, setViewOpen] = React.useState(false);
  const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleRequestDelete = (id: string) => {
    setPendingDeleteId(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (pendingDeleteId) {
      const matchedRow = rows.find((row) => row.id === pendingDeleteId);
      if (matchedRow?.quizId) {
        await onDeleteUserQuizProgress(matchedRow.userId ?? '', matchedRow.quizId);
      }
      setPendingDeleteId(null);
    }
    setDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setPendingDeleteId(null);
    setDialogOpen(false);
  };

  const renderProgressStatus = (status: string) => {
    switch (status) {
      case UserQuizProgressEnum[UserQuizProgressEnum.NotStarted]:
        return (
          <Tooltip title={t('notStarted')}>
            <CancelOutlined sx={{ color: 'var(--mui-palette-error-main)' }} />
          </Tooltip>
        );
      case UserQuizProgressEnum[UserQuizProgressEnum.Doing]:
        return (
          <Tooltip title={t('inProgress')}>
            <DataUsage sx={{ color: 'var(--mui-palette-secondary-main)' }} />
          </Tooltip>
        );
      case UserQuizProgressEnum[UserQuizProgressEnum.Pass]:
        return (
          <Tooltip title={t('pass')}>
            <ThumbUpOutlined sx={{ color: 'var(--mui-palette-primary-main)' }} />
          </Tooltip>
        );
      case UserQuizProgressEnum[UserQuizProgressEnum.Fail]:
        return (
          <Tooltip title={t('fail')}>
            <ThumbDownOutlined sx={{ color: 'var(--mui-palette-error-main)' }} />
          </Tooltip>
        );
      default:
        return <span>{t('unknown')}</span>;
    }
  };

  const renderActiveStatus = (status: string) => {
    switch (status) {
      case StatusEnum[StatusEnum.Enable]:
        return (
          <Tooltip title={t('enable')}>
            <Check sx={{ color: 'var(--mui-palette-primary-main)' }} />
          </Tooltip>
        );
      case StatusEnum[StatusEnum.Disable]:
        return (
          <Tooltip title={t('disable')}>
            <Close sx={{ color: 'var(--mui-palette-secondary-main)' }} />
          </Tooltip>
        );
      case StatusEnum[StatusEnum.Deleted]:
        return (
          <Tooltip title={t('deleted')}>
            <DeleteOutline sx={{ color: 'var(--mui-palette-error-main)' }} />
          </Tooltip>
        );

      default:
        return <span>{t('unknown')}</span>;
    }
  };

  return (
    <>
      <CustomTable<UserQuizProgressDetailResponse>
        rows={rows}
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        getRowId={(row) => row.id!}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        onDelete={async (ids) => {
          for (const id of ids) {
            const matchedRow = rows.find((row) => row.id === id);
            if (matchedRow?.quizId) {
              await onDeleteUserQuizProgress(matchedRow.userId ?? '', matchedRow.quizId);
            }
          }
        }}
        deleteConfirmHeaderTitle="Delete"
        actionMenuItems={[
          {
            label: t('viewDetails'),
            onClick: (row) => {
              setEditUserQuizProgressData(row);
              setViewOpen(true);
            },
          },
          {
            label: t('edit'),
            onClick: (row) => {
              setEditUserQuizProgressData(row);
              setEditOpen(true);
            },
          },
          {
            label: t('gradeQuiz'),
            onClick: (row) => {
              setEditUserQuizProgressData(row);
              setScoreOpen(true);
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
            <TableCell>{t('quizName')}</TableCell>
            <TableCell>{t('lessonName')}</TableCell>
            <TableCell>{t('fullName')}</TableCell>
            <TableCell>{t('gender')}</TableCell>
            <TableCell>{t('progressStatus')}</TableCell>
            <TableCell>{t('score')}</TableCell>
            <TableCell>{t('totalScore')}</TableCell>
            <TableCell>{t('scoreToPass')}</TableCell>
            <TableCell>{t('totalQuestion')}</TableCell>
            <TableCell>{t('attempts')}</TableCell>
            <TableCell>{t('maxAttempts')}</TableCell>
            <TableCell>{t('startDate')}</TableCell>
            <TableCell>{t('endDate')}</TableCell>
            <TableCell>{t('startedAt')}</TableCell>
            <TableCell>{t('completedAt')}</TableCell>
            <TableCell>{t('lastAccess')}</TableCell>
            <TableCell>{t('activeStatus')}</TableCell>
            <TableCell
              sx={{
                minWidth: 100,
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                paddingY: 1,
              }}
            >
              {t('currentPositionName')}
            </TableCell>
            <TableCell
              sx={{
                minWidth: 100,
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                paddingY: 1,
              }}
            >
              {t('currentPositionStateName')}
            </TableCell>
            <TableCell
              sx={{
                minWidth: 100,
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                paddingY: 1,
              }}
            >
              {t('currentDepartmentName')}
            </TableCell>
            <TableCell>{t('cityName')}</TableCell>
          </>
        )}
        renderRow={(row, isSelected, onSelect, onActionClick) => {
          return (
            <>
              <TableCell
                sx={{
                  minWidth: 150,
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                }}
              >
                {row.quiz?.title}
              </TableCell>

              <TableCell
                sx={{
                  minWidth: 150,
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                }}
              >
                {row.quiz?.lesson?.name}
              </TableCell>

              <TableCell
                sx={{
                  minWidth: 150,
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    src={
                      row.user?.employee?.avatar !== undefined
                        ? row.user?.employee?.avatar
                        : row.user?.thumbnail?.resourceUrl
                    }
                  >
                    {row.user?.employee?.name?.[0] || row.user?.userName?.[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" noWrap>
                      {row.user?.employee?.name || row.user?.userName}
                    </Typography>
                    {row.user?.userName ? (
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {row.user?.userName}
                      </Typography>
                    ) : null}
                  </Box>
                </Stack>
              </TableCell>

              <TableCell>{row.user?.employee?.gender ?? ''}</TableCell>
              <TableCell align="center">
                {row.progressStatus !== undefined ? renderProgressStatus(row.progressStatus) : ''}
              </TableCell>
              <TableCell>{row.score}</TableCell>
              <TableCell>{row.quiz?.totalScore}</TableCell>
              <TableCell>{row.quiz?.scoreToPass}</TableCell>
              <TableCell>{row.quiz?.totalQuestion}</TableCell>
              <TableCell sx={{ width: '15%' }}>{row.attempts}</TableCell>
              <TableCell>{row.quiz?.maxAttempts}</TableCell>
              <TableCell>{row.startTime ? DateTimeUtils.formatDateTimeToDateString(row.startTime) : ''}</TableCell>
              <TableCell>{row.endTime ? DateTimeUtils.formatDateTimeToDateString(row.endTime) : ''}</TableCell>
              <TableCell>{row.startedAt ? DateTimeUtils.formatDateTimeToDateString(row.startedAt) : ''}</TableCell>
              <TableCell>{row.completedAt ? DateTimeUtils.formatDateTimeToDateString(row.completedAt) : ''}</TableCell>
              <TableCell>{row.lastAccess ? DateTimeUtils.formatDateTimeToDateString(row.lastAccess) : ''}</TableCell>

              <TableCell align="center">
                {row.activeStatus !== undefined ? renderActiveStatus(row.activeStatus) : ''}
              </TableCell>
              <TableCell sx={{ width: '15%' }}>{row.user?.employee?.currentPositionName ?? ''}</TableCell>
              <TableCell sx={{ width: '15%' }}>{row.user?.employee?.currentPositionStateName ?? ''}</TableCell>
              <TableCell sx={{ width: '15%' }}>{row.user?.employee?.currentDepartmentName ?? ''}</TableCell>
              <TableCell sx={{ width: '6%' }}>{row.user?.employee?.cityName}</TableCell>

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
          );
        }}
      />

      {editUserQuizProgressData ? (
        <UpdateUserQuizProgressFormDialog
          open={editOpen}
          data={editUserQuizProgressData}
          onClose={async () => {
            setEditOpen(false);
            await onRefresh();
          }}
          onSubmit={async (updatedData) => {
            await onEditUserQuizProgress(updatedData);
            setEditOpen(false);
            await onRefresh();
          }}
        />
      ) : null}

      {editUserQuizProgressData ? (
        <UserQuizProgressDetailForm
          open={viewOpen}
          userQuizProgressId={editUserQuizProgressData.id ?? null}
          onClose={() => {
            setViewOpen(false);
          }}
        />
      ) : null}

      {editUserQuizProgressData ? (
        <UpdateUserQuizScoreFormDialog
          open={scoreOpen}
          data={editUserQuizProgressData}
          onClose={async () => {
            setScoreOpen(false);
            await onRefresh();
          }}
          onSubmit={async (updatedData) => {
            await onEditUserQuizProgress(updatedData);
            setScoreOpen(false);
            await onRefresh();
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
