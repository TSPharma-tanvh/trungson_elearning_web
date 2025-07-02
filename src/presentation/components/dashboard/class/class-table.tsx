import React from 'react';
import { UpdateClassRequest } from '@/domain/models/class/request/update-class-request';
import { ClassResponse } from '@/domain/models/class/response/class-response';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { MoreVert } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
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

import { ConfirmDeleteDialog } from '../core/dialog/confirm-delete-dialog';
import ClassDetailForm from './class-detail-form';
import { UpdateClassFormDialog } from './update-class-form';

interface ClassTableProps {
  rows: ClassResponse[];
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteClass: (ids: string[]) => Promise<void>;
  onEditClass: (data: UpdateClassRequest) => Promise<void>;
}

export default function ClassTable({
  rows,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onDeleteClass: onDeleteClasss,
  onEditClass,
}: ClassTableProps) {
  const rowIds = React.useMemo(() => rows.map((r) => r.id!), [rows]);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = React.useState<ClassResponse | null>(null);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [editClassData, setEditPathData] = React.useState<ClassResponse | null>(null);
  const [editOpen, setEditOpen] = React.useState(false);
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

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, row: ClassResponse) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleOpenDeleteDialog = (ids: string[]) => {
    setIdsToDelete(ids);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    await onDeleteClasss(idsToDelete);
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
      <Card>
        {selected.size > 0 && (
          <Box display="flex" justifyContent="flex-end" p={2}>
            <Button color="error" variant="outlined" onClick={() => handleOpenDeleteDialog(Array.from(selected))}>
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
                <TableCell>Name</TableCell>
                <TableCell>Detail</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>QR Code Url</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Minute Late</TableCell>
                <TableCell>Class Type</TableCell>
                <TableCell>Schedule Status</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row) => {
                const isItemSelected = isSelected(row.id!);
                return (
                  <TableRow key={row.id} selected={isItemSelected} hover>
                    <TableCell padding="checkbox">
                      <Checkbox checked={isItemSelected} onChange={() => handleSelectOne(row.id!)} />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar src={row.thumbnail?.resourceUrl}>{row.className?.[0]}</Avatar>
                        <Box>
                          <Typography variant="subtitle2" noWrap>
                            {row.className}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word', minWidth: 300 }}>
                      <Typography variant="body2">{row.classDetail}</Typography>
                    </TableCell>
                    <TableCell>{row.duration}</TableCell>
                    <TableCell>{row.qrCodeURL}</TableCell>
                    <TableCell>{DateTimeUtils.formatISODateFromDate(row.startAt)}</TableCell>
                    <TableCell>{DateTimeUtils.formatISODateFromDate(row.endAt)}</TableCell>
                    <TableCell>{row.minuteLate}</TableCell>
                    <TableCell>{row.classType}</TableCell>
                    <TableCell>{row.scheduleStatus}</TableCell>
                    <TableCell>{row.category?.categoryName}</TableCell>
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
          labelDisplayedRows={() => `Page ${page + 1} of ${Math.ceil(count / rowsPerPage)}`}
        />
      </Card>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              if (selectedRow) {
                setViewOpen(true);
              }
              handleMenuClose();
            }}
          >
            View Details
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (selectedRow) {
                setEditPathData(selectedRow);
                setEditOpen(true);
              }
              handleMenuClose();
            }}
          >
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (selectedRow?.id) handleOpenDeleteDialog([selectedRow.id]);
              handleMenuClose();
            }}
          >
            Delete
          </MenuItem>
        </MenuList>
      </Popover>

      {editClassData && (
        <UpdateClassFormDialog
          open={editOpen}
          classes={editClassData}
          onClose={() => setEditOpen(false)}
          onSubmit={async (updatedData) => {
            await onEditClass(updatedData);
            setEditOpen(false);
          }}
        />
      )}

      {selectedRow && (
        <ClassDetailForm open={viewOpen} classId={selectedRow?.id ?? null} onClose={() => setViewOpen(false)} />
      )}

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        selectedCount={idsToDelete.length}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
