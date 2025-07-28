import React from 'react';
import { type UpdateUserPathProgressRequest } from '@/domain/models/user-path/request/update-user-path-progress-request';
import { type UserPathProgressDetailResponse } from '@/domain/models/user-path/response/user-path-progress-detail-response';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { UserProgressEnum } from '@/utils/enum/core-enum';
import { CancelOutlined, CheckCircleOutline, DataUsage, MoreVert } from '@mui/icons-material';
import { Avatar, Box, IconButton, Stack, TableCell, Tooltip, Typography } from '@mui/material';

import { CustomTable } from '@/presentation/components/core/custom-table';
import { ConfirmDeleteDialog } from '@/presentation/components/core/dialog/confirm-delete-dialog';

import UserPathProgressDetailForm from './user-path-progress-detail-form';
import { UpdateUserPathProgressFormDialog } from './user-path-progress-update-form';

interface UserPathProgressTableProps {
  rows: UserPathProgressDetailResponse[];
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteUserPathProgresss: (ids: string[]) => Promise<void>;
  onEditUserPathProgress: (data: UpdateUserPathProgressRequest) => Promise<void>;
}

export default function UserPathProgressTable({
  rows,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onDeleteUserPathProgresss,
  onEditUserPathProgress,
}: UserPathProgressTableProps) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [editUserPathProgressData, setEditUserPathProgressData] = React.useState<UserPathProgressDetailResponse | null>(
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
      await onDeleteUserPathProgresss([pendingDeleteId]);
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
      <CustomTable<UserPathProgressDetailResponse>
        rows={rows}
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        getRowId={(row) => row.id!}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        onDelete={onDeleteUserPathProgresss}
        deleteConfirmHeaderTitle="Mark done"
        actionMenuItems={[
          {
            label: 'View Details',
            onClick: (row) => {
              setEditUserPathProgressData(row);
              setViewOpen(true);
            },
          },
          {
            label: 'Edit',
            onClick: (row) => {
              setEditUserPathProgressData(row);
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
            <TableCell>Path Name</TableCell>
            <TableCell>User Name</TableCell>
            <TableCell>Full Name</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>progress</TableCell>
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

              <TableCell sx={{ width: '15%' }}>{row.coursePath?.name}</TableCell>

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
              <TableCell>{DateTimeUtils.formatISODateFromString(row.startDate ?? '')}</TableCell>
              <TableCell>{DateTimeUtils.formatISODateFromString(row.endDate ?? '')}</TableCell>
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

      {editUserPathProgressData ? (
        <UpdateUserPathProgressFormDialog
          open={editOpen}
          data={editUserPathProgressData}
          onClose={() => {
            setEditOpen(false);
          }}
          onSubmit={async (updatedData) => {
            await onEditUserPathProgress(updatedData);
            setEditOpen(false);
          }}
        />
      ) : null}

      {editUserPathProgressData ? (
        <UserPathProgressDetailForm
          open={viewOpen}
          userPathProgressId={editUserPathProgressData.id ?? null}
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
