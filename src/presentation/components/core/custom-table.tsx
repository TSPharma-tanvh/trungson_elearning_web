import React from 'react';
import { MoreVert } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  Checkbox,
  IconButton,
  MenuItem,
  MenuList,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';

import { ConfirmDeleteDialog } from '../core/dialog/confirm-delete-dialog';

interface CustomTableProps<T> {
  rows: T[];
  count: number;
  page: number;
  rowsPerPage: number;
  getRowId: (row: T) => string;
  renderHeader: () => React.ReactNode;
  renderRow: (
    row: T,
    isSelected: boolean,
    onSelect: () => void,
    onActionClick: (e: React.MouseEvent) => void
  ) => React.ReactNode;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: (ids: string[]) => Promise<void>;
  actionMenuItems: { label: string; onClick: (row: T) => void }[];
  deleteConfirmHeaderTitle?: string;
}

export function CustomTable<T>({
  rows,
  count,
  page,
  rowsPerPage,
  getRowId,
  renderHeader,
  renderRow,
  onPageChange,
  onRowsPerPageChange,
  onDelete,
  actionMenuItems,
  deleteConfirmHeaderTitle = 'Delete Selected',
}: CustomTableProps<T>) {
  const rowIds = React.useMemo(() => rows.map(getRowId), [rows]);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = React.useState<T | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [idsToDelete, setIdsToDelete] = React.useState<string[]>([]);

  const isSelected = (id: string) => selected.has(id);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(event.target.checked ? new Set(rowIds) : new Set());
  };

  const handleSelectOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, row: T) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleOpenDeleteDialog = (ids: string[]) => {
    setIdsToDelete(ids);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    await onDelete(idsToDelete);
    setSelected((prev) => {
      const next = new Set(prev);
      idsToDelete.forEach((id) => next.delete(id));
      return next;
    });
    setDeleteDialogOpen(false);
    setIdsToDelete([]);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setIdsToDelete([]);
  };

  return (
    <>
      <Card
        sx={{
          p: 0,
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
              variant="contained"
              onClick={() => handleOpenDeleteDialog(Array.from(selected))}
            >
              {deleteConfirmHeaderTitle} ({selected.size})
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
                {renderHeader()}
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
                const id = getRowId(row);
                return (
                  <TableRow key={id} selected={isSelected(id)} hover>
                    <TableCell padding="checkbox">
                      <Checkbox checked={isSelected(id)} onChange={() => handleSelectOne(id)} />
                    </TableCell>
                    {renderRow(
                      row,
                      isSelected(id),
                      () => handleSelectOne(id),
                      (e) => handleMenuClick(e as React.MouseEvent<HTMLElement>, row)
                    )}
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
            labelDisplayedRows={() => `Page ${page + 1} of ${Math.ceil(count / rowsPerPage)}`}
            sx={{
              '& .MuiTablePagination-actions button': {
                color: 'var(--mui-palette-primary-main)',
                '&.Mui-disabled': {
                  color: 'var(--mui-palette-action-disabled)',
                },
              },

              // '& .MuiTablePagination-select': {
              //   color: 'var(--mui-palette-primary-main)',
              // },
              // '& .MuiTablePagination-displayedRows': {
              //   color: 'var(--mui-palette-primary-main)',
              // },
            }}
          />
        </Box>
      </Card>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList>
          {selectedRow &&
            actionMenuItems.map((item, idx) => (
              <MenuItem
                key={idx}
                onClick={() => {
                  item.onClick(selectedRow);
                  handleMenuClose();
                }}
              >
                {item.label}
              </MenuItem>
            ))}
        </MenuList>
      </Popover>

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        selectedCount={idsToDelete.length}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
