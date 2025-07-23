import React from 'react';
import { UpdateUserQuizRequest } from '@/domain/models/user-quiz/request/update-quiz-progress-request';
import { UserQuizProgressDetailResponse } from '@/domain/models/user-quiz/response/user-quiz-progress-detail-response';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { UserProgressEnum, UserQuizProgressEnum } from '@/utils/enum/core-enum';
import {
  Autorenew,
  CancelOutlined,
  CheckBox,
  CheckCircleOutline,
  DataUsage,
  HourglassEmpty,
  IndeterminateCheckBox,
  MoreVert,
  NotStarted,
  NotStartedOutlined,
  ThumbDown,
  ThumbDownOutlined,
  ThumbUp,
  ThumbUpOutlined,
} from '@mui/icons-material';
import { Avatar, Box, Checkbox, IconButton, Stack, TableCell, Tooltip, Typography } from '@mui/material';
import { CheckCircle, XCircle } from '@phosphor-icons/react';

import { CustomTable } from '@/presentation/components/core/custom-table';
import { ConfirmDeleteDialog } from '@/presentation/components/core/dialog/confirm-delete-dialog';

import { UpdateUserQuizProgressFormDialog } from './user-quiz-update-form';

interface UserQuizProgressTableProps {
  rows: UserQuizProgressDetailResponse[];
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteUserQuizProgresss: (ids: string[]) => Promise<void>;
  onEditUserQuizProgress: (data: UpdateUserQuizRequest) => Promise<void>;
}

export default function UserQuizProgressTable({
  rows,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onDeleteUserQuizProgresss,
  onEditUserQuizProgress,
}: UserQuizProgressTableProps) {
  const [editOpen, setEditOpen] = React.useState(false);
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
      await onDeleteUserQuizProgresss([pendingDeleteId]);
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
      case UserQuizProgressEnum[UserQuizProgressEnum.NotStarted]:
        return (
          <Tooltip title="Not Started">
            <CancelOutlined sx={{ color: 'var(--mui-palette-error-main)' }} />
          </Tooltip>
        );
      case UserQuizProgressEnum[UserQuizProgressEnum.Doing]:
        return (
          <Tooltip title="In Progress">
            <DataUsage sx={{ color: 'var(--mui-palette-secondary-main)' }} />
          </Tooltip>
        );
      case UserQuizProgressEnum[UserQuizProgressEnum.Pass]:
        return (
          <Tooltip title="Pass">
            <ThumbUpOutlined sx={{ color: 'var(--mui-palette-primary-main)' }} />
          </Tooltip>
        );
      case UserQuizProgressEnum[UserQuizProgressEnum.Fail]:
        return (
          <Tooltip title="Fail">
            <ThumbDownOutlined sx={{ color: 'var(--mui-palette-error-main)' }} />
          </Tooltip>
        );
      default:
        return <span>Unknown</span>;
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
        onDelete={onDeleteUserQuizProgresss}
        deleteConfirmHeaderTitle="Mark done"
        actionMenuItems={[
          {
            label: 'View Details',
            onClick: (row) => {
              setEditUserQuizProgressData(row);
              setViewOpen(true);
            },
          },
          {
            label: 'Edit',
            onClick: (row) => {
              setEditUserQuizProgressData(row);
              setEditOpen(true);
            },
          },
          {
            label: 'Mark done',
            onClick: (row) => {
              if (row.id) handleRequestDelete(row.id);
            },
          },
        ]}
        renderHeader={() => (
          <>
            <TableCell>ID</TableCell>
            <TableCell>Quiz Name</TableCell>
            <TableCell>User Name</TableCell>
            <TableCell>Full Name</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Score</TableCell>
            <TableCell>startDate</TableCell>
            <TableCell>endDate</TableCell>
            <TableCell>Status</TableCell>
            <TableCell
              sx={{
                minWidth: 100,
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                paddingY: 1,
              }}
            >
              current Position Name
            </TableCell>
            <TableCell
              sx={{
                minWidth: 100,
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                paddingY: 1,
              }}
            >
              current Position State Name
            </TableCell>
            <TableCell
              sx={{
                minWidth: 100,
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                paddingY: 1,
              }}
            >
              current Department Name
            </TableCell>
            <TableCell
              sx={{
                minWidth: 100,
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                paddingY: 1,
              }}
            >
              current Position State Name
            </TableCell>

            <TableCell>cityName</TableCell>
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
                {row.user?.userName}
              </TableCell>

              <TableCell sx={{ width: '10%' }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    src={
                      row.user?.employee?.avatar != null ? row.user?.employee?.avatar : row.user?.thumbnail?.resourceUrl
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

              <TableCell>{row.score}</TableCell>
              <TableCell>{row.startedAt ? DateTimeUtils.formatISODateFromDate(row.startedAt) : ''}</TableCell>
              <TableCell>{row.completedAt ? DateTimeUtils.formatISODateFromDate(row.completedAt) : ''}</TableCell>

              <TableCell align="center">
                {row.progressStatus != null ? renderStatus(row.progressStatus.toString()) : ''}
              </TableCell>
              <TableCell sx={{ width: '15%' }}>{row.user?.employee?.currentPositionName ?? ''}</TableCell>
              <TableCell sx={{ width: '15%' }}>{row.user?.employee?.currentPositionStateName ?? ''}</TableCell>
              <TableCell sx={{ width: '15%' }}>{row.user?.employee?.currentDepartmentName ?? ''}</TableCell>
              <TableCell sx={{ width: '15%' }}>{row.user?.employee?.currentPositionStateName ?? ''}</TableCell>
              <TableCell sx={{ width: '6%' }}>{row.user?.employee?.cityName}</TableCell>

              <TableCell align="right">
                <IconButton onClick={(e) => onActionClick(e as React.MouseEvent<HTMLElement>)}>
                  <MoreVert />
                </IconButton>
              </TableCell>
            </>
          );
        }}
      />

      {editUserQuizProgressData && (
        <UpdateUserQuizProgressFormDialog
          open={editOpen}
          data={editUserQuizProgressData}
          onClose={() => setEditOpen(false)}
          onSubmit={async (updatedData) => {
            await onEditUserQuizProgress(updatedData);
            setEditOpen(false);
          }}
        />
      )}

      {/* {editUserQuizProgressData && (
        <UserQuizProgressDetailForm
          open={viewOpen}
          userQuizProgressId={editUserQuizProgressData.id ?? null}
          onClose={() => setViewOpen(false)}
        />
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
