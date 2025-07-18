import React from 'react';
import { UpdateUserPathProgressRequest } from '@/domain/models/user-path/request/update-user-path-progress-request';
import { UserPathProgressDetailResponse } from '@/domain/models/user-path/response/user-path-progress-detail-response';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { MoreVert } from '@mui/icons-material';
import { Avatar, Box, Checkbox, IconButton, Stack, TableCell, Typography } from '@mui/material';

import { CustomTable } from '@/presentation/components/core/custom-table';
import { ConfirmDeleteDialog } from '@/presentation/components/core/dialog/confirm-delete-dialog';

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
            label: 'Delete',
            onClick: (row) => {
              if (row.id) handleRequestDelete(row.id);
            },
          },
        ]}
        renderHeader={() => (
          <>
            <TableCell>Path Name</TableCell>
            <TableCell>User Name</TableCell>
            <TableCell>Progress</TableCell>
            <TableCell>Start Time</TableCell>
            <TableCell>End Time</TableCell>
            <TableCell>Status</TableCell>
          </>
        )}
        renderRow={(row, isSelected, onSelect, onActionClick) => (
          <>
            <TableCell>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box>
                  <Typography variant="subtitle2" noWrap>
                    {row.id}
                  </Typography>
                </Box>
              </Stack>
            </TableCell>
            <TableCell>{row.coursePath?.name}</TableCell>
            <TableCell>{row.user?.userName}</TableCell>
            <TableCell>{row.progress}</TableCell>
            <TableCell>{DateTimeUtils.formatISODateFromString(row.startDate ?? '')}</TableCell>
            <TableCell>{DateTimeUtils.formatISODateFromString(row.endDate ?? '')}</TableCell>
            <TableCell>{row.status}</TableCell>

            <TableCell align="right">
              <IconButton onClick={(e) => onActionClick(e as React.MouseEvent<HTMLElement>)}>
                <MoreVert />
              </IconButton>
            </TableCell>
          </>
        )}
      />

      {/* {editUserPathProgressData && (
        <UpdateUserPathProgressFormDialog
          open={editOpen}
          data={editUserPathProgressData}
          onClose={() => setEditOpen(false)}
          onSubmit={async (updatedData) => {
            await onEditUserPathProgress(updatedData);
            setEditOpen(false);
          }}
        />
      )}

      {editUserPathProgressData && (
        <UserPathProgressDetailForm
          open={viewOpen}
          courseId={editUserPathProgressData.id ?? null}
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
