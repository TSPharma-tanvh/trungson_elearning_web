import React from 'react';
import { type RoleResponse } from '@/domain/models/role/response/role-response';
import { MoreVert } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  IconButton,
  Menu,
  MenuItem,
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

import { ConfirmDeleteDialog } from '../../../core/dialog/confirm-delete-dialog';

interface Props {
  rows: RoleResponse[];
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteRoles: (roleIds: string[]) => void;
  onEditRole: (role: RoleResponse) => void; // New callback for editing
}

export default function RolesTable({
  rows,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onDeleteRoles,
  onEditRole,
}: Props) {
  const rowIds = React.useMemo(() => rows.map((row) => row.id ?? ''), [rows]);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [deleteTargetIds, setDeleteTargetIds] = React.useState<string[]>([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [menuRowId, setMenuRowId] = React.useState<string | null>(null);

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

  const handleDeleteSelected = () => {
    setDeleteTargetIds(Array.from(selected));
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    onDeleteRoles(deleteTargetIds);
    if (deleteTargetIds.length === selected.size) {
      setSelected(new Set());
    } else {
      setSelected((prev) => {
        const newSet = new Set(prev);
        deleteTargetIds.forEach((id) => newSet.delete(id));
        return newSet;
      });
    }
    setDeleteTargetIds([]);
    setDeleteConfirmOpen(false);
  };

  const handleCancelDelete = () => {
    setDeleteTargetIds([]);
    setDeleteConfirmOpen(false);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, rowId: string) => {
    setAnchorEl(event.currentTarget);
    setMenuRowId(rowId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRowId(null);
  };

  const handleDeleteRow = () => {
    if (menuRowId) {
      setDeleteTargetIds([menuRowId]);
      setDeleteConfirmOpen(true);
    }
    handleMenuClose();
  };

  const handleEditRow = () => {
    if (menuRowId) {
      const role = rows.find((row) => row.id === menuRowId);
      if (role) {
        onEditRole(role);
      }
    }
    handleMenuClose();
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
            <Button
              sx={{
                backgroundColor: 'var(--mui-palette-secondary-main)',
                color: 'var(--mui-palette-common-white)',
                '&:hover': { backgroundColor: 'var(--mui-palette-secondary-dark)' },
              }}
              variant="outlined"
              onClick={handleDeleteSelected}
            >
              Delete Selected ({selected.size})
            </Button>
          </Box>
        )}

        <TableContainer>
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
                <TableCell>Role Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Permissions</TableCell>
                <TableCell align="right">Actions</TableCell>
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
                const isItemSelected = isSelected(row.id ?? '');
                return (
                  <TableRow hover key={row.id} selected={isItemSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox checked={isItemSelected} onChange={() => { handleSelectOne(row.id ?? ''); }} />
                    </TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>
                      <Stack direction="column" spacing={0.5}>
                        {Object.entries(
                          row.permissions.reduce((acc: Record<string, string[]>, perm) => {
                            const [group, action] = perm.split('.', 2);
                            if (!acc[group]) acc[group] = [];
                            acc[group].push(action || '');
                            return acc;
                          }, {})
                        ).map(([group, actions]) => (
                          <Stack key={group} direction="row" spacing={1} flexWrap="wrap">
                            <Typography variant="body2" fontWeight="bold">
                              {group}:
                            </Typography>
                            {actions.map((action, idx) => (
                              <Chip
                                key={`${group}-${action}-${idx}`}
                                label={action}
                                size="small"
                                sx={{ fontSize: '0.75rem' }}
                              />
                            ))}
                          </Stack>
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={(e) => { handleMenuOpen(e, row.id ?? ''); }}>
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
          sx={{
            '& .MuiTablePagination-actions button': {
              color: 'var(--mui-palette-primary-main)',
              '&.Mui-disabled': {
                color: 'var(--mui-palette-action-disabled)',
              },
            },
          }}
        />
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleEditRow}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteRow}>Delete</MenuItem>
      </Menu>

      <ConfirmDeleteDialog
        open={deleteConfirmOpen}
        selectedCount={deleteTargetIds.length}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
