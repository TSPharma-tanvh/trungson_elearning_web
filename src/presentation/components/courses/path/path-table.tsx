'use client';

import React from 'react';
import { UpdateCoursePathRequest } from '@/domain/models/path/request/update-path-request';
import { CoursePathResponse } from '@/domain/models/path/response/course-path-response';
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

import { CoursePathDetailForm } from './course-path-detail-form';
import { UpdatePathFormDialog } from './update-path-form';

interface Props {
  rows: CoursePathResponse[];
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteCoursePaths: (ids: string[]) => void;
  onEditCoursePath: (data: UpdateCoursePathRequest) => void;
}

export default function CoursePathTable({
  rows,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onDeleteCoursePaths,
  onEditCoursePath,
}: Props) {
  const rowIds = React.useMemo(() => rows.map((r) => r.id!), [rows]);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = React.useState<CoursePathResponse | null>(null);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [editPathData, setEditUserData] = React.useState<CoursePathResponse | null>(null);
  const [editOpen, setEditOpen] = React.useState(false);
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

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, row: CoursePathResponse) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => setAnchorEl(null);

  return (
    <>
      <Card>
        {selected.size > 0 && (
          <Box display="flex" justifyContent="flex-end" p={2}>
            <Button color="error" variant="outlined" onClick={() => onDeleteCoursePaths(Array.from(selected))}>
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
                <TableCell>Required</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Display</TableCell>
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
                        <Avatar src={row.thumbnail?.resourceUrl}>{row.name?.[0]}</Avatar>
                        <Box>
                          <Typography variant="subtitle2" noWrap>
                            {row.name}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>{row.detail}</TableCell>
                    <TableCell>{row.isRequired ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{DateTimeUtils.formatISODate(row.startTime ?? '')}</TableCell>
                    <TableCell>{DateTimeUtils.formatISODate(row.endTime ?? '')}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{row.displayType}</TableCell>
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
                setEditUserData(selectedRow);
                setEditOpen(true);
              }
              handleMenuClose();
            }}
          >
            Edit
          </MenuItem>

          <MenuItem
            onClick={() => {
              if (selectedRow?.id) onDeleteCoursePaths([selectedRow.id]);
              handleMenuClose();
            }}
          >
            Delete
          </MenuItem>
        </MenuList>
      </Popover>

      {editPathData && (
        <UpdatePathFormDialog
          open={editOpen}
          path={editPathData}
          onClose={() => setEditOpen(false)}
          onSubmit={async (updatedData) => {
            await onEditCoursePath(updatedData);
            setEditOpen(false);
          }}
        />
      )}

      {selectedRow && (
        <CoursePathDetailForm
          open={viewOpen}
          coursePathId={selectedRow?.id ?? null}
          onClose={() => setViewOpen(false)}
        />
      )}
    </>
  );
}
