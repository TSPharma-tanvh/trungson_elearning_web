import React from 'react';
import { UpdateUserCourseProgressRequest } from '@/domain/models/user-course/request/update-user-course-progress-request';
import { UserCourseProgressResponse } from '@/domain/models/user-course/response/user-course-progress-response';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { UserProgressEnum } from '@/utils/enum/core-enum';
import {
  Autorenew,
  CancelOutlined,
  CheckCircleOutline,
  DataUsage,
  HourglassEmpty,
  MoreVert,
  NotStarted,
  NotStartedOutlined,
} from '@mui/icons-material';
import { Avatar, Box, Checkbox, IconButton, Stack, TableCell, Tooltip, Typography } from '@mui/material';
import { CheckCircle, XCircle } from '@phosphor-icons/react';

import { CustomTable } from '@/presentation/components/core/custom-table';
import { ConfirmDeleteDialog } from '@/presentation/components/core/dialog/confirm-delete-dialog';

import UserCourseProgressDetailForm from './user-course-progress-detail-form';
import { UpdateUserCourseProgressFormDialog } from './user-course-progress-update-form';

interface UserCourseProgressTableProps {
  rows: UserCourseProgressResponse[];
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteUserCourseProgresss: (ids: string[]) => Promise<void>;
  onEditUserCourseProgress: (data: UpdateUserCourseProgressRequest) => Promise<void>;
}

export default function UserCourseProgressTable({
  rows,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onDeleteUserCourseProgresss,
  onEditUserCourseProgress,
}: UserCourseProgressTableProps) {
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
          <Tooltip title="Not Started">
            <CancelOutlined sx={{ color: 'var(--mui-palette-error-main)' }} />
          </Tooltip>
        );
      case UserProgressEnum[UserProgressEnum.Ongoing]:
        return (
          <Tooltip title="In Progress">
            <DataUsage sx={{ color: 'var(--mui-palette-secondary-main)' }} />
          </Tooltip>
        );
      case UserProgressEnum[UserProgressEnum.Done]:
        return (
          <Tooltip title="Completed">
            <CheckCircleOutline sx={{ color: 'var(--mui-palette-primary-main)' }} />
          </Tooltip>
        );
      default:
        return <span>Unknown</span>;
    }
  };

  return (
    <>
      <CustomTable<UserCourseProgressResponse>
        rows={rows}
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        getRowId={(row) => row.id!}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        onDelete={onDeleteUserCourseProgresss}
        deleteConfirmHeaderTitle="Mark done"
        actionMenuItems={[
          {
            label: 'View Details',
            onClick: (row) => {
              setEditUserCourseProgressData(row);
              setViewOpen(true);
            },
          },
          {
            label: 'Edit',
            onClick: (row) => {
              setEditUserCourseProgressData(row);
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
            <TableCell>Course Name</TableCell>
            <TableCell
              sx={{
                minWidth: 100,
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                paddingY: 1,
              }}
            >
              Path Id
            </TableCell>
            <TableCell>User Name</TableCell>
            <TableCell>Full Name</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Progress</TableCell>
            <TableCell>startDate</TableCell>
            <TableCell>endDate</TableCell>
            <TableCell>Progress Status</TableCell>
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

              <TableCell sx={{ width: '15%' }}>{row.courses?.name}</TableCell>
              <TableCell
                sx={{
                  minWidth: 150,
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                }}
              >
                {row.courses?.coursePath?.name}
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

              <TableCell>{row.progress}</TableCell>
              <TableCell>{DateTimeUtils.formatISODateFromString(row.startDate ?? '')}</TableCell>
              <TableCell>{DateTimeUtils.formatISODateFromString(row.endDate ?? '')}</TableCell>
              <TableCell align="center">{renderStatus(row.status)}</TableCell>
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

      {editUserCourseProgressData && (
        <UpdateUserCourseProgressFormDialog
          open={editOpen}
          data={editUserCourseProgressData}
          onClose={() => setEditOpen(false)}
          onSubmit={async (updatedData) => {
            await onEditUserCourseProgress(updatedData);
            setEditOpen(false);
          }}
        />
      )}

      {editUserCourseProgressData && (
        <UserCourseProgressDetailForm
          open={viewOpen}
          userCourseProgressId={editUserCourseProgressData.id ?? null}
          onClose={() => setViewOpen(false)}
        />
      )}

      <ConfirmDeleteDialog
        open={dialogOpen}
        selectedCount={1}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
