import React from 'react';
import { type UpdateUserLessonRequest } from '@/domain/models/user-lesson/request/update-user-lesson-request';
import { type UserLessonProgressDetailResponse } from '@/domain/models/user-lesson/response/user-lesson-detail-response';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { UserProgressEnum } from '@/utils/enum/core-enum';
import { CancelOutlined, CheckCircleOutline, DataUsage, MoreVert } from '@mui/icons-material';
import { Avatar, Box, IconButton, Stack, TableCell, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomTable } from '@/presentation/components/core/custom-table';
import { ConfirmDeleteDialog } from '@/presentation/components/core/dialog/confirm-delete-dialog';

import UserLessonProgressDetailForm from './user-lesson-progress-detail-form';
import { UpdateUserLessonProgressFormDialog } from './user-lesson-progress-update-form';

interface UserLessonProgressTableProps {
  rows: UserLessonProgressDetailResponse[];
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteUserLessonProgresss: (ids: string[]) => Promise<void>;
  onEditUserLessonProgress: (data: UpdateUserLessonRequest) => Promise<void>;
}

export default function UserLessonProgressTable({
  rows,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onDeleteUserLessonProgresss,
  onEditUserLessonProgress,
}: UserLessonProgressTableProps) {
  const { t } = useTranslation();
  const [editOpen, setEditOpen] = React.useState(false);
  const [editUserLessonProgressData, setEditUserLessonProgressData] =
    React.useState<UserLessonProgressDetailResponse | null>(null);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleRequestDelete = (id: string) => {
    setPendingDeleteId(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (pendingDeleteId) {
      await onDeleteUserLessonProgresss([pendingDeleteId]);
      setPendingDeleteId(null);
    }
    setDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setPendingDeleteId(null);
    setDialogOpen(false);
  };
  const renderStatus = (status: string) => {
    switch (status) {
      case UserProgressEnum[UserProgressEnum.NotStarted]:
        return (
          <Tooltip title={t('notStarted')}>
            <CancelOutlined sx={{ color: 'var(--mui-palette-error-main)' }} />
          </Tooltip>
        );
      case UserProgressEnum[UserProgressEnum.Ongoing]:
        return (
          <Tooltip title={t('inProgress')}>
            <DataUsage sx={{ color: 'var(--mui-palette-secondary-main)' }} />
          </Tooltip>
        );
      case UserProgressEnum[UserProgressEnum.Done]:
        return (
          <Tooltip title={t('completed')}>
            <CheckCircleOutline sx={{ color: 'var(--mui-palette-primary-main)' }} />
          </Tooltip>
        );
      default:
        return <span>{t('unknown')}</span>;
    }
  };

  return (
    <>
      <CustomTable<UserLessonProgressDetailResponse>
        rows={rows}
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        getRowId={(row) => row.id!}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        onDelete={onDeleteUserLessonProgresss}
        deleteConfirmHeaderTitle={t('markDone')}
        actionMenuItems={[
          {
            label: t('viewDetails'),
            onClick: (row) => {
              setEditUserLessonProgressData(row);
              setViewOpen(true);
            },
          },
          {
            label: t('edit'),
            onClick: (row) => {
              setEditUserLessonProgressData(row);
              setEditOpen(true);
            },
          },
          {
            label: t('markDone'),
            onClick: (row) => {
              if (row.id) handleRequestDelete(row.id);
            },
          },
        ]}
        renderHeader={() => (
          <>
            <TableCell>{t('id')}</TableCell>
            <TableCell>{t('lessonName')}</TableCell>
            <TableCell>{t('userName')}</TableCell>
            <TableCell>{t('fullName')}</TableCell>
            <TableCell>{t('gender')}</TableCell>
            <TableCell>{t('progress')}</TableCell>
            <TableCell>{t('startDate')}</TableCell>
            <TableCell>{t('endDate')}</TableCell>
            <TableCell>{t('actualStartDate')}</TableCell>
            <TableCell>{t('actualEndDate')}</TableCell>
            <TableCell>{t('lastAccess')}</TableCell>
            <TableCell>{t('status')}</TableCell>
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
                {row.id}
              </TableCell>

              <TableCell sx={{ width: '15%' }}>{row.lessons?.name}</TableCell>

              <TableCell
                sx={{
                  minWidth: 150,
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                }}
              >
                {row.user?.userName}
              </TableCell>

              <TableCell sx={{ width: '10%' }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    src={
                      row.user?.employee?.avatar !== undefined
                        ? row.user?.employee?.avatar
                        : row.user?.thumbnail?.resourceUrl
                    }
                  >
                    {row.user?.employee?.name?.[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" noWrap>
                      {row.user?.employee?.name}
                    </Typography>
                  </Box>
                </Stack>
              </TableCell>

              <TableCell>{row.user?.employee?.gender ?? ''}</TableCell>

              <TableCell>{row.progress}</TableCell>
              <TableCell>{row.startDate ? DateTimeUtils.formatISODateFromDate(row.startDate) : ''}</TableCell>
              <TableCell>{row.endDate ? DateTimeUtils.formatISODateFromDate(row.endDate) : ''}</TableCell>
              <TableCell>{DateTimeUtils.formatISODateFromString(row.actualStartDate ?? '')}</TableCell>
              <TableCell>{DateTimeUtils.formatISODateFromString(row.actualEndDate ?? '')}</TableCell>
              <TableCell>{DateTimeUtils.formatISODateFromString(row.lastAccess ?? '')}</TableCell>

              <TableCell align="center">{renderStatus(row.status)}</TableCell>
              <TableCell sx={{ width: '15%' }}>{row.user?.employee?.currentPositionName ?? ''}</TableCell>
              <TableCell sx={{ width: '15%' }}>{row.user?.employee?.currentPositionStateName ?? ''}</TableCell>
              <TableCell sx={{ width: '15%' }}>{row.user?.employee?.currentDepartmentName ?? ''}</TableCell>
              <TableCell sx={{ width: '15%' }}>{row.user?.employee?.currentPositionStateName ?? ''}</TableCell>
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

      {editUserLessonProgressData ? (
        <UpdateUserLessonProgressFormDialog
          open={editOpen}
          data={editUserLessonProgressData}
          onClose={() => {
            setEditOpen(false);
          }}
          onSubmit={async (updatedData) => {
            await onEditUserLessonProgress(updatedData);
            setEditOpen(false);
          }}
        />
      ) : null}

      {editUserLessonProgressData ? (
        <UserLessonProgressDetailForm
          open={viewOpen}
          userLessonProgressId={editUserLessonProgressData.id ?? null}
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
