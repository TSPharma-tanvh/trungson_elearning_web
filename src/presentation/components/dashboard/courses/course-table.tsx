import React from 'react';
import { UpdateCourseRequest } from '@/domain/models/courses/request/update-course-request';
import { CourseDetailResponse } from '@/domain/models/courses/response/course-detail-response';
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
import CourseDetailForm from './course-detail-form';
import { UpdateCourseFormDialog } from './update-course-form-dialog';

interface CourseTableProps {
  rows: CourseDetailResponse[];
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteCoursePaths: (ids: string[]) => Promise<void>;
  onEditCourse: (data: UpdateCourseRequest) => Promise<void>;
}

export default function CourseTable({
  rows,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onDeleteCoursePaths,
  onEditCourse,
}: CourseTableProps) {
  const rowIds = React.useMemo(() => rows.map((r) => r.id!), [rows]);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = React.useState<CourseDetailResponse | null>(null);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [editCourseData, setEditPathData] = React.useState<CourseDetailResponse | null>(null);
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

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, row: CourseDetailResponse) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleOpenDeleteDialog = (ids: string[]) => {
    setIdsToDelete(ids);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    await onDeleteCoursePaths(idsToDelete);
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
                <TableCell>Required</TableCell>
                <TableCell>StartTime</TableCell>
                <TableCell>EndTime</TableCell>
                <TableCell>DisableStatus</TableCell>
                <TableCell>CourseType</TableCell>
                <TableCell>ScheduleStatus</TableCell>
                <TableCell>DisplayType</TableCell>
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
                    <TableCell>{DateTimeUtils.formatISODateFromDate(row.startTime)}</TableCell>
                    <TableCell>{DateTimeUtils.formatISODateFromDate(row.endTime)}</TableCell>
                    <TableCell>{row.disableStatus}</TableCell>
                    <TableCell>{row.courseType}</TableCell>
                    <TableCell>{row.scheduleStatus}</TableCell>
                    <TableCell>{row.displayType}</TableCell>
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

      {editCourseData && (
        <UpdateCourseFormDialog
          open={editOpen}
          data={editCourseData}
          onClose={() => setEditOpen(false)}
          onSubmit={async (updatedData) => {
            await onEditCourse(updatedData);
            setEditOpen(false);
          }}
        />
      )}

      {selectedRow && (
        <CourseDetailForm open={viewOpen} courseId={selectedRow?.id ?? null} onClose={() => setViewOpen(false)} />
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
