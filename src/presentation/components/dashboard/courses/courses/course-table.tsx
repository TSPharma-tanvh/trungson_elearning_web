import React from 'react';
import { UpdateCourseRequest } from '@/domain/models/courses/request/update-course-request';
import { CourseDetailResponse } from '@/domain/models/courses/response/course-detail-response';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { MoreVert } from '@mui/icons-material';
import { Avatar, Box, Checkbox, IconButton, Stack, TableCell, Typography } from '@mui/material';

import { CustomTable } from '@/presentation/components/core/custom-table';
import { ConfirmDeleteDialog } from '@/presentation/components/core/dialog/confirm-delete-dialog';

import CourseDetailForm from './course-detail-form';
import { UpdateCourseFormDialog } from './update-course-form-dialog';

interface CourseTableProps {
  rows: CourseDetailResponse[];
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteCourses: (ids: string[]) => Promise<void>;
  onEditCourse: (data: UpdateCourseRequest) => Promise<void>;
}

export default function CourseTable({
  rows,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onDeleteCourses,
  onEditCourse,
}: CourseTableProps) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [editCourseData, setEditCourseData] = React.useState<CourseDetailResponse | null>(null);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleRequestDelete = (id: string) => {
    setPendingDeleteId(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (pendingDeleteId) {
      await onDeleteCourses([pendingDeleteId]);
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
      <CustomTable<CourseDetailResponse>
        rows={rows}
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        getRowId={(row) => row.id!}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        onDelete={onDeleteCourses}
        actionMenuItems={[
          {
            label: 'View Details',
            onClick: (row) => {
              setEditCourseData(row);
              setViewOpen(true);
            },
          },
          {
            label: 'Edit',
            onClick: (row) => {
              setEditCourseData(row);
              setEditOpen(true);
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
            <TableCell>Name</TableCell>
            <TableCell>Detail</TableCell>
            <TableCell>Required</TableCell>
            <TableCell>Start Time</TableCell>
            <TableCell>End Time</TableCell>
            <TableCell>Disable Status</TableCell>
            <TableCell>Course Type</TableCell>
            <TableCell>Schedule Status</TableCell>
            <TableCell>Display Type</TableCell>
          </>
        )}
        renderRow={(row, isSelected, onSelect, onActionClick) => (
          <>
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
            <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word', minWidth: 300 }}>
              <Typography variant="body2">{row.detail}</Typography>
            </TableCell>
            <TableCell>{row.isRequired ? 'Yes' : 'No'}</TableCell>
            <TableCell>{DateTimeUtils.formatISODateFromDate(row.startTime)}</TableCell>
            <TableCell>{DateTimeUtils.formatISODateFromDate(row.endTime)}</TableCell>
            <TableCell>{row.disableStatus}</TableCell>
            <TableCell>{row.courseType}</TableCell>
            <TableCell>{row.scheduleStatus}</TableCell>
            <TableCell>{row.displayType}</TableCell>
            <TableCell align="right">
              <IconButton onClick={(e) => onActionClick(e as React.MouseEvent<HTMLElement>)}>
                <MoreVert />
              </IconButton>
            </TableCell>
          </>
        )}
      />

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

      {editCourseData && (
        <CourseDetailForm open={viewOpen} courseId={editCourseData.id ?? null} onClose={() => setViewOpen(false)} />
      )}

      <ConfirmDeleteDialog
        open={dialogOpen}
        selectedCount={1}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
