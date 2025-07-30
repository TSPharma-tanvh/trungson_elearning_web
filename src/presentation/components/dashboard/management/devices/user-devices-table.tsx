import React from 'react';
import { type UpdateUserDevicesRequest } from '@/domain/models/user-devices/request/update-user-devices-request';
import { type UserDeviceResponse } from '@/domain/models/user-devices/response/user-devices-response';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { MoreVert } from '@mui/icons-material';
import { Avatar, Box, IconButton, Stack, TableCell, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomTable } from '@/presentation/components/core/custom-table';
import { ConfirmDeleteDialog } from '@/presentation/components/core/dialog/confirm-delete-dialog';

import UserDevicesDetailForm from './user-devices-detail-form';

interface UserDevicesTableProps {
  rows: UserDeviceResponse[];
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteUserDevices: (ids: string[]) => Promise<void>;
  onEditUserDevices: (data: UpdateUserDevicesRequest) => Promise<void>;
}

export default function UserDevicesTable({
  rows,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onDeleteUserDevices,
}: UserDevicesTableProps) {
  const { t } = useTranslation();
  const [editUserDevicesData, setEditUserDevicesData] = React.useState<UserDeviceResponse | null>(null);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleRequestDelete = (id: string) => {
    setPendingDeleteId(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (pendingDeleteId) {
      await onDeleteUserDevices([pendingDeleteId]);
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
      <CustomTable<UserDeviceResponse>
        rows={rows}
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        getRowId={(row) => row.id}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        onDelete={onDeleteUserDevices}
        actionMenuItems={[
          {
            label: t('viewDetails'),
            onClick: (row) => {
              setEditUserDevicesData(row);
              setViewOpen(true);
            },
          },
          //   {
          //     label: 'Edit',
          //     onClick: (row) => {
          //       setEditUserDevicesData(row);
          //       setEditOpen(true);
          //     },
          //   },
          {
            label: t('delete'),
            onClick: (row) => {
              if (row.id) handleRequestDelete(row.id);
            },
          },
        ]}
        renderHeader={() => (
          <>
            <TableCell>{t('userName')}</TableCell>
            <TableCell>{t('deviceName')}</TableCell>
            <TableCell>{t('deviceType')}</TableCell>
            <TableCell>{t('deviceID')}</TableCell>
            <TableCell>{t('deviceToken')}</TableCell>
            <TableCell>{t('ipAddress')}</TableCell>
            <TableCell>{t('signInAt')}</TableCell>
            <TableCell>{t('signOutAt')}</TableCell>
            <TableCell>{t('lastAccess')}</TableCell>
          </>
        )}
        renderRow={(row, isSelected, onSelect, onActionClick) => (
          <>
            <TableCell>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar src={row.user?.employee?.name}>{row.user?.employee?.name?.[0]}</Avatar>
                <Box>
                  <Typography variant="subtitle2" noWrap>
                    {row.user?.employee?.name}
                  </Typography>
                </Box>
              </Stack>
            </TableCell>
            <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word', minWidth: 300 }}>
              <Typography variant="body2">{row.deviceName}</Typography>
            </TableCell>{' '}
            <TableCell>{row.deviceType}</TableCell>
            <TableCell>{row.deviceID}</TableCell>
            <TableCell>{row.deviceToken}</TableCell>
            <TableCell>{row.ipAddress}</TableCell>
            <TableCell>{DateTimeUtils.formatISODateFromDate(row.signInAt)}</TableCell>
            <TableCell>{DateTimeUtils.formatISODateFromDate(row.signOutAt)}</TableCell>
            <TableCell>{DateTimeUtils.formatISODateFromDate(row.lastAccess)}</TableCell>
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

      {/* {editUserDevicesData ? (
        <UpdateUserDevicesFormDialog
          open={editOpen}
          data={editUserDevicesData}
          onClose={() => {
            setEditOpen(false);
          }}
          onSubmit={async (updatedData) => {
            await onEditUserDevices(updatedData);
            setEditOpen(false);
          }}
        />
      ) : null} */}

      {editUserDevicesData ? (
        <UserDevicesDetailForm
          open={viewOpen}
          userDevicesId={editUserDevicesData.id ?? null}
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
