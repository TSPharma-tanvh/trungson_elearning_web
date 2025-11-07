'use client';

import * as React from 'react';
import { type UpdateUserInfoRequest } from '@/domain/models/user/request/user-update-request';
import { type UserResponse } from '@/domain/models/user/response/user-response';
import { CancelOutlined, CheckCircleOutline, MoreVert } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  IconButton,
  MenuItem,
  Popover,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { ConfirmDeleteDialog } from '../../../core/dialog/confirm-delete-dialog';
import { EditUserDialog } from './edit-user-dialog';
import { ViewUserDialog } from './view-user-detail-dialog';

interface UserTableProps {
  rows: UserResponse[];
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteUsers: (userIds: string[]) => void;
  onUpdateUser: (userId: string, data: UpdateUserInfoRequest) => Promise<void>;
}

export default function UsersTable({
  rows,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onDeleteUsers,
  onUpdateUser,
}: UserTableProps) {
  const { t } = useTranslation();

  const rowIds = React.useMemo(() => rows.map((row) => row.id), [rows]);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = React.useState<UserResponse | null>(null);
  const [editUserData, setEditUserData] = React.useState<UserResponse | null>(null);
  const [editOpen, setEditOpen] = React.useState(false);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);

  const isSelected = (id: string) => selected.has(id);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(new Set(rowIds));
    } else {
      setSelected(new Set());
    }
  };

  const handleSelectOne = (id: string) => {
    setSelected((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, row: UserResponse) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    if (selectedUser) {
      setEditUserData(selectedUser);
      setEditOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    onDeleteUsers(Array.from(selected));
    setSelected(new Set());
    setDeleteConfirmOpen(false);
  };

  const handleDeleteCancel = () => {
    setEditUserData(null);
    setDeleteConfirmOpen(false);
    setSelected(new Set());
  };

  const handleDeleteOneUser = (id: string) => {
    setSelected(new Set([id]));
    setDeleteConfirmOpen(true);
  };

  return (
    <>
      <Card
        sx={{
          p: '0 0 8px 0',
          backgroundColor: 'var(--mui-palette-common-white)',
          color: 'var(--mui-palette-primary-main)',
          border: '1px solid var(--mui-palette-primary-main)',
          borderRadius: '16px',
        }}
      >
        {selected.size > 0 && (
          <Box
            display="flex"
            justifyContent="flex-end"
            p={2}
            sx={{ backgroundColor: 'var(--mui-palette-primary-main)' }}
          >
            {' '}
            <Button
              sx={{
                backgroundColor: 'var(--mui-palette-secondary-main)',
                color: 'var(--mui-palette-common-white)',
                '&:hover': { backgroundColor: 'var(--mui-palette-secondary-dark)' },
              }}
              variant="outlined"
              onClick={() => {
                setDeleteConfirmOpen(true);
              }}
            >
              {t('deleteSelectedItems')} ({selected.size})
            </Button>
          </Box>
        )}

        <TableContainer sx={{ border: 'none' }}>
          <Table>
            <TableHead
              sx={{
                '& .MuiTableCell-head': {
                  backgroundColor: 'var(--mui-palette-primary-main)',
                  color: 'var(--mui-palette-common-white)',
                },
                '& .MuiTableCell-body': {
                  borderBottom: '1px solid var(--mui-palette-primary-main)',
                },
              }}
            >
              {' '}
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.size === rows.length && rows.length > 0}
                    indeterminate={selected.size > 0 && selected.size < rows.length}
                    onChange={handleSelectAll}
                    sx={{
                      color: 'var(--mui-palette-common-white)',
                      '&.Mui-checked': {
                        color: 'var(--mui-palette-common-white)',
                      },
                      '&.MuiCheckbox-indeterminate': {
                        color: 'var(--mui-palette-common-white)',
                      },
                    }}
                  />
                </TableCell>
                <TableCell>{t('id')}</TableCell>
                <TableCell>{t('user')}</TableCell>
                <TableCell>{t('email')}</TableCell>
                <TableCell>{t('position')}</TableCell>
                <TableCell>{t('department')}</TableCell>
                <TableCell>{t('roles')}</TableCell>
                <TableCell>{t('isActive')}</TableCell>
                <TableCell align="right">{t('actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                '& .MuiTableCell-body': {
                  borderBottom: '1px solid var(--mui-palette-primary-main)',
                },
              }}
            >
              {rows.map((row) => {
                const isItemSelected = isSelected(row.id);
                return (
                  <TableRow hover key={row.id} selected={isItemSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onChange={() => {
                          handleSelectOne(row.id);
                        }}
                      />
                    </TableCell>{' '}
                    <TableCell sx={{ width: '10%' }}>{row.id}</TableCell>
                    <TableCell sx={{ width: '25%' }}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar src={row.thumbnail?.resourceUrl ?? row.employee?.avatar}>{row.firstName?.[0]}</Avatar>
                        <Box>
                          <Typography variant="subtitle2" noWrap>
                            {row.employee?.name ?? `${row.firstName} ${row.lastName}`}
                          </Typography>

                          <Typography variant="body2" color="text.secondary" noWrap>
                            {row.userName}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>{' '}
                    <TableCell>{row.employee?.mail}</TableCell>
                    <TableCell>
                      {row.employee ? `${row.employee.positionName} (${row.employee.positionStateName})` : null}
                    </TableCell>
                    <TableCell>{row.employee?.departmentName}</TableCell>
                    <TableCell>{row.roles?.join(', ')}</TableCell>
                    <TableCell>
                      {row.isActive ? (
                        <CheckCircleOutline sx={{ color: 'var(--mui-palette-primary-main)' }} />
                      ) : (
                        <CancelOutlined sx={{ color: 'var(--mui-palette-error-main)' }} />
                      )}
                    </TableCell>{' '}
                    <TableCell align="right">
                      <IconButton
                        onClick={(event) => {
                          handleMenuClick(event, row);
                        }}
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Box display="flex" justifyContent="flex-end" pr={2} mt={1}>
          <TablePagination
            component="div"
            count={count}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            labelRowsPerPage={t('rowsPerPage')}
            labelDisplayedRows={() => {
              const totalPages = Math.ceil(count / rowsPerPage);
              return t('paginationInfo', { currentPage: page + 1, totalPages });
            }}
            sx={{
              '& .MuiTablePagination-actions button': {
                color: 'var(--mui-palette-primary-main)',
                '&.Mui-disabled': {
                  color: 'var(--mui-palette-action-disabled)',
                },
              },
            }}
          />{' '}
        </Box>
      </Card>

      {/* Actions Menu */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => {
            setViewOpen(true);
            handleMenuClose();
          }}
        >
          {t('viewDetails')}
        </MenuItem>
        <MenuItem onClick={handleEditClick}> {t('edit')}</MenuItem>
        {/* <MenuItem
          onClick={() => {
            handleDeleteOneUser(selectedUser?.id ?? '');
            handleMenuClose();
          }}
        >
          {t('delete')}
        </MenuItem> */}
      </Popover>

      {/* Dialogs */}
      <ConfirmDeleteDialog
        open={deleteConfirmOpen}
        selectedCount={selected.size}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />

      {editUserData ? (
        <EditUserDialog
          open={editOpen}
          user={editUserData}
          onClose={() => {
            setEditOpen(false);
          }}
          onSubmit={async (updatedData) => {
            await onUpdateUser(editUserData.id, updatedData);
            setEditOpen(false);
          }}
        />
      ) : null}

      {selectedUser ? (
        <ViewUserDialog
          open={viewOpen}
          userId={selectedUser?.id ?? null}
          onClose={() => {
            setViewOpen(false);
          }}
        />
      ) : null}
    </>
  );
}
