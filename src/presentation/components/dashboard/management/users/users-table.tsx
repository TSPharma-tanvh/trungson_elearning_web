'use client';

import * as React from 'react';
import { UpdateUserInfoRequest } from '@/domain/models/user/request/user-update-request';
import { UserResponse } from '@/domain/models/user/response/user-response';
import { MoreVert } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  MenuItem,
  MenuList,
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

import { ConfirmDeleteDialog } from '../../core/dialog/confirm-delete-dialog';
import { EditUserDialog } from './edit-user-dialog';
import { ViewUserDialog } from './view-user-detail-dialog';

interface Props {
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
}: Props) {
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

  const handleMenuClose = () => setAnchorEl(null);

  const handleEditClick = () => {
    if (selectedUser) {
      setEditUserData(selectedUser);
      setEditOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    await onDeleteUsers(Array.from(selected));
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
      <Card>
        {selected.size > 0 && (
          <Box display="flex" justifyContent="flex-end" p={2}>
            <Button color="error" variant="outlined" onClick={() => setDeleteConfirmOpen(true)}>
              Delete Selected ({selected.size})
            </Button>
          </Box>
        )}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.size === rows.length && rows.length > 0}
                    indeterminate={selected.size > 0 && selected.size < rows.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>User</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Roles</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                const isItemSelected = isSelected(row.id);
                return (
                  <TableRow hover key={row.id} selected={isItemSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox checked={isItemSelected} onChange={() => handleSelectOne(row.id)} />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar src={row.thumbnail?.resourceUrl}>{row.firstName?.[0]}</Avatar>
                        <Box>
                          <Typography variant="subtitle2" noWrap>
                            {row.firstName} {row.lastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {row.userName}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>{row.phoneNumber}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.roles?.join(', ')}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={(event) => handleMenuClick(event, row)}>
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={count}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          labelDisplayedRows={() => {
            const totalPages = Math.ceil(count / rowsPerPage);
            return `Page ${page + 1} of ${totalPages}`;
          }}
        />
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
          View Details
        </MenuItem>
        <MenuItem onClick={handleEditClick}>Edit</MenuItem>
        <MenuItem
          onClick={() => {
            handleDeleteOneUser(selectedUser?.id ?? '');
            handleMenuClose();
          }}
        >
          Delete
        </MenuItem>
      </Popover>

      {/* Dialogs */}
      <ConfirmDeleteDialog
        open={deleteConfirmOpen}
        selectedCount={selected.size}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />

      {editUserData && (
        <EditUserDialog
          open={editOpen}
          user={editUserData}
          onClose={() => setEditOpen(false)}
          onSubmit={async (updatedData) => {
            await onUpdateUser(editUserData.id, updatedData);
            setEditOpen(false);
          }}
        />
      )}

      {selectedUser && (
        <ViewUserDialog open={viewOpen} userId={selectedUser?.id ?? null} onClose={() => setViewOpen(false)} />
      )}
    </>
  );
}
