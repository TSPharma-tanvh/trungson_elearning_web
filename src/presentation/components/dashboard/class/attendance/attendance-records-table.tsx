import React from 'react';
import { type UpdateAttendanceRecordsRequest } from '@/domain/models/attendance/request/update-attendance-records-request';
import { type AttendanceRecordDetailResponse } from '@/domain/models/attendance/response/attendance-record-detail-response';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { MoreVert } from '@mui/icons-material';
import { Avatar, Box, IconButton, Stack, TableCell, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomTable } from '@/presentation/components/core/custom-table';
import { ConfirmDeleteDialog } from '@/presentation/components/core/dialog/confirm-delete-dialog';

import AttendanceRecordsDetailForm from './attendance-records-detail-form';
import { UpdateAttendanceRecordsFormDialog } from './attendance-records-update-form';

interface AttendanceRecordsTableProps {
  rows: AttendanceRecordDetailResponse[];
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteAttendanceRecords: (ids: string[]) => Promise<void>;
  onEditAttendanceRecords: (data: UpdateAttendanceRecordsRequest) => Promise<void>;
}

export default function AttendanceRecordsTable({
  rows,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onEditAttendanceRecords,
  onDeleteAttendanceRecords,
}: AttendanceRecordsTableProps) {
  const { t } = useTranslation();
  const [editOpen, setEditOpen] = React.useState(false);
  const [editAttendanceRecordsData, setEditAttendanceRecordsData] =
    React.useState<AttendanceRecordDetailResponse | null>(null);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleRequestDelete = (id: string) => {
    setPendingDeleteId(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (pendingDeleteId) {
      await onDeleteAttendanceRecords([pendingDeleteId]);
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
      <CustomTable<AttendanceRecordDetailResponse>
        rows={rows}
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        getRowId={(row) => row.id}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        onDelete={onDeleteAttendanceRecords}
        actionMenuItems={[
          {
            label: t('viewDetails'),
            onClick: (row) => {
              setEditAttendanceRecordsData(row);
              setViewOpen(true);
            },
          },
          {
            label: t('edit'),
            onClick: (row) => {
              setEditAttendanceRecordsData(row);
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
            <TableCell>{t('userName')}</TableCell>
            <TableCell>{t('classId')}</TableCell>
            <TableCell>{t('className')}</TableCell>
            <TableCell>{t('checkinTime')}</TableCell>
            <TableCell>{t('status')}</TableCell>
            <TableCell>{t('enrollmentDate')}</TableCell>
            <TableCell>{t('approvedAt')}</TableCell>
          </>
        )}
        renderRow={(row, isSelected, onSelect, onActionClick) => (
          <>
            <TableCell>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar src={row.user?.employee?.avatar}>{row.user?.employee?.name?.[0]}</Avatar>
                <Box>
                  <Typography variant="subtitle2" noWrap>
                    {row.user?.employee?.name}
                  </Typography>
                </Box>
              </Stack>
            </TableCell>
            <TableCell>{row.classID}</TableCell>
            <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word', minWidth: 300 }}>
              <Typography variant="body2">{row.class?.className}</Typography>
            </TableCell>
            <TableCell>{DateTimeUtils.formatISODateFromDate(row.checkinTime)}</TableCell>
            <TableCell>{row.status}</TableCell>
            <TableCell>{DateTimeUtils.formatISODateFromDate(row.enrollment?.enrollmentDate)}</TableCell>
            <TableCell>{DateTimeUtils.formatISODateFromDate(row.enrollment?.approvedAt)}</TableCell>

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

      {editAttendanceRecordsData ? (
        <UpdateAttendanceRecordsFormDialog
          open={editOpen}
          data={editAttendanceRecordsData}
          onClose={() => {
            setEditOpen(false);
          }}
          onSubmit={async (updatedData) => {
            await onEditAttendanceRecords(updatedData);
            setEditOpen(false);
          }}
        />
      ) : null}

      {editAttendanceRecordsData ? (
        <AttendanceRecordsDetailForm
          open={viewOpen}
          attendanceRecordId={editAttendanceRecordsData.id ?? null}
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
