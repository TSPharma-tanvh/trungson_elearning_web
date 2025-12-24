import React from 'react';
import { type UpdateUserCourseProgressRequest } from '@/domain/models/user-course/request/update-user-course-progress-request';
import { type UserCourseProgressResponse } from '@/domain/models/user-course/response/user-course-progress-response';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { UserProgressEnum } from '@/utils/enum/core-enum';
import { CancelOutlined, CheckCircleOutline, DataUsage, MoreVert } from '@mui/icons-material';
import { Avatar, Box, IconButton, Stack, TableCell, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomTable } from '@/presentation/components/core/custom-table';
import { ConfirmDeleteDialog } from '@/presentation/components/core/dialog/confirm-delete-dialog';

import UserCourseProgressDetailForm from './user-linear-course-progress-detail-form';
import { UpdateUserCourseProgressFormDialog } from './user-linear-course-progress-update-form';

interface UserLinearCourseProgressTableProps {
  rows: UserCourseProgressResponse[];
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteUserCourseProgress: (ids: string[]) => Promise<void>;
  onEditUserCourseProgress: (data: UpdateUserCourseProgressRequest) => Promise<void>;
}

export default function UserLinearCourseProgressTable({
  rows,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onDeleteUserCourseProgress: onDeleteUserCourseProgresss,
  onEditUserCourseProgress,
}: UserLinearCourseProgressTableProps) {
  const { t } = useTranslation();
  const [editOpen, setEditOpen] = React.useState(false);
  const [editUserCourseProgressData, setEditUserCourseProgressData] = React.useState<UserCourseProgressResponse | null>(
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
      await onDeleteUserCourseProgresss([pendingDeleteId]);
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
      <CustomTable<UserCourseProgressResponse>
        rows={rows}
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        getRowId={(row) => row.id}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        onDelete={onDeleteUserCourseProgresss}
        actionMenuItems={[
          {
            label: t('viewDetails'),
            onClick: (row) => {
              setEditUserCourseProgressData(row);
              setViewOpen(true);
            },
          },
          {
            label: t('edit'),
            onClick: (row) => {
              setEditUserCourseProgressData(row);
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
            {/* <TableCell>{t('id')}</TableCell> */}
            <TableCell>{t('courseName')}</TableCell>
            <TableCell>{t('fullName')}</TableCell>
            {/* <TableCell>{t('gender')}</TableCell> */}
            <TableCell>{t('progressStatus')}</TableCell>
            <TableCell>{t('progress')}</TableCell>
            <TableCell>{t('startDate')}</TableCell>
            <TableCell>{t('endDate')}</TableCell>
            <TableCell>{t('actualStartDate')}</TableCell>
            <TableCell>{t('actualEndDate')}</TableCell>
            <TableCell>{t('lastAccess')}</TableCell>

            <TableCell
              sx={{
                minWidth: 100,
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                paddingY: 1,
              }}
            >
              {t('departmentName')}
            </TableCell>
            <TableCell
              sx={{
                minWidth: 100,
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                paddingY: 1,
              }}
            >
              {t('positionName')}
            </TableCell>

            <TableCell
              sx={{
                minWidth: 100,
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                paddingY: 1,
              }}
            >
              {t('positionStateName')}
            </TableCell>
          </>
        )}
        renderRow={(row, isSelected, onSelect, onActionClick) => {
          return (
            <>
              {/* <TableCell
                sx={{
                  minWidth: 150,
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                }}
              >
                {row.id}
              </TableCell> */}

              <TableCell sx={{ minWidth: 150 }}>{row.courses?.name}</TableCell>

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

              {/* <TableCell>{row.user?.employee?.gender ?? ''}</TableCell> */}
              <TableCell align="center">{renderStatus(row.status)}</TableCell>
              <TableCell>{row.progress}</TableCell>
              <TableCell>{DateTimeUtils.formatISODateStringToString(row.startDate ?? '')}</TableCell>
              <TableCell>{DateTimeUtils.formatISODateStringToString(row.endDate ?? '')}</TableCell>
              <TableCell>{DateTimeUtils.formatISODateStringToString(row.actualStartDate ?? '')}</TableCell>
              <TableCell>{DateTimeUtils.formatISODateStringToString(row.actualEndDate ?? '')}</TableCell>
              <TableCell>{DateTimeUtils.formatISODateStringToString(row.lastAccess ?? '')}</TableCell>
              <TableCell sx={{ width: '15%' }}>{row.user?.employee?.departmentName ?? ''}</TableCell>
              <TableCell sx={{ width: '15%' }}>{row.user?.employee?.positionName ?? ''}</TableCell>
              <TableCell sx={{ width: '15%' }}>{row.user?.employee?.positionStateName ?? ''}</TableCell>

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

      {editUserCourseProgressData ? (
        <UpdateUserCourseProgressFormDialog
          open={editOpen}
          data={editUserCourseProgressData}
          onClose={() => {
            setEditOpen(false);
          }}
          onSubmit={async (updatedData) => {
            await onEditUserCourseProgress(updatedData);
            setEditOpen(false);
          }}
        />
      ) : null}

      {editUserCourseProgressData ? (
        <UserCourseProgressDetailForm
          open={viewOpen}
          userCourseProgressId={editUserCourseProgressData.id ?? null}
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
