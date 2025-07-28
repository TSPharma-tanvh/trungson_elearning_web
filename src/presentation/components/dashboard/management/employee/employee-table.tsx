import React from 'react';
import { type EmployeeResponse } from '@/domain/models/employee/response/employee-response';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { MoreVert } from '@mui/icons-material';
import { Avatar, Box, IconButton, Stack, TableCell, Typography } from '@mui/material';
import { CheckCircle, XCircle } from '@phosphor-icons/react';

import { CustomTable } from '@/presentation/components/core/custom-table';
import { ConfirmDeleteDialog } from '@/presentation/components/core/dialog/confirm-delete-dialog';

import EmployeeDetailForm from './employee-detail-form';

interface EmployeeTableProps {
  rows: EmployeeResponse[];
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteEmployees: (ids: string[]) => Promise<void>;
}

export default function EmployeeTable({
  rows,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onDeleteEmployees,
}: EmployeeTableProps) {
  const [editEmployeeData, setEditEmployeeData] = React.useState<EmployeeResponse | null>(null);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleRequestDelete = (id: string) => {
    setPendingDeleteId(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (pendingDeleteId) {
      await onDeleteEmployees([pendingDeleteId]);
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
      <CustomTable<EmployeeResponse>
        rows={rows}
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        getRowId={(row) => row.id!}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        onDelete={onDeleteEmployees}
        actionMenuItems={[
          {
            label: 'View Details',
            onClick: (row) => {
              setEditEmployeeData(row);
              setViewOpen(true);
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
            <TableCell>Code</TableCell>
            <TableCell>User ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Birthday</TableCell>
            <TableCell>Hired day</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Department Type</TableCell>
            <TableCell>Position</TableCell>
            <TableCell>Position State</TableCell>
            <TableCell>ASM</TableCell>
            <TableCell>City</TableCell>
            <TableCell>District</TableCell>
            <TableCell>Ward</TableCell>
            <TableCell>Status</TableCell>
          </>
        )}
        renderRow={(row, isSelected, onSelect, onActionClick) => (
          <>
            <TableCell>{row.code}</TableCell>
            <TableCell>{row.userId}</TableCell>
            <TableCell sx={{ width: '10%' }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar src={row.avatar}>{row.name?.[0]}</Avatar>
                <Box>
                  <Typography variant="subtitle2" noWrap>
                    {row.name}
                  </Typography>
                </Box>
              </Stack>
            </TableCell>

            <TableCell>{row.gender}</TableCell>
            <TableCell>
              {row.birthDate !== undefined ? DateTimeUtils.formatISODateFromString(row.birthDate) : ''}
            </TableCell>
            <TableCell>
              {row.hireDate !== undefined ? DateTimeUtils.formatISODateFromString(row.hireDate) : ''}
            </TableCell>
            <TableCell>{row.currentDepartmentName}</TableCell>
            <TableCell>{row.currentDepartmentTypeName}</TableCell>
            <TableCell sx={{ width: '6%' }}>{row.currentPositionName}</TableCell>
            <TableCell>{row.currentPositionStateName}</TableCell>
            <TableCell sx={{ width: '10%' }}>{row.asm}</TableCell>
            <TableCell sx={{ width: '6%' }}>{row.cityName}</TableCell>
            <TableCell sx={{ width: '6%' }}>{row.districtName}</TableCell>
            <TableCell sx={{ width: '6%' }}>{row.wardName}</TableCell>
            <TableCell sx={{ width: '1%' }}>
              {row.status === 'Hoạt Động' ? (
                <CheckCircle fontSize="24px" color="var(--mui-palette-primary-main)" />
              ) : (
                <XCircle fontSize="24px" color="var(--mui-palette-error-main)" />
              )}
            </TableCell>

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

      {editEmployeeData ? (
        <EmployeeDetailForm
          open={viewOpen}
          employeeId={editEmployeeData.id ?? null}
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
