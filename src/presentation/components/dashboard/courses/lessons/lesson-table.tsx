import React from 'react';
import { type UpdateLessonRequest } from '@/domain/models/lessons/request/update-lesson-request';
import { type LessonDetailResponse } from '@/domain/models/lessons/response/lesson-detail-response';
import { MoreVert, Visibility } from '@mui/icons-material';
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

import ImagePreviewDialog from '@/presentation/components/shared/file/image-preview-dialog';
import VideoPreviewDialog from '@/presentation/components/shared/file/video-preview-dialog';

import { ConfirmDeleteDialog } from '../../../core/dialog/confirm-delete-dialog';
import { UpdateLessonFormDialog } from './edit-lesson-form';
import ClassDetailForm from './lesson-detail-form';
import LessonDetailForm from './lesson-detail-form';

interface LessonTableProps {
  rows: LessonDetailResponse[];
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteLessonPaths: (ids: string[]) => Promise<void>;
  onEditLesson: (data: UpdateLessonRequest) => Promise<void>;
}

export default function LessonTable({
  rows,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onDeleteLessonPaths: onDeleteLesson,
  onEditLesson,
}: LessonTableProps) {
  const rowIds = React.useMemo(() => rows.map((r) => r.id!), [rows]);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = React.useState<LessonDetailResponse | null>(null);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [editCourseData, setEditPathData] = React.useState<LessonDetailResponse | null>(null);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [idsToDelete, setIdsToDelete] = React.useState<string[]>([]);
  const isSelected = (id: string) => selected.has(id);
  const [previewImageOpen, setPreviewImageOpen] = React.useState(false);
  const [previewVideoOpen, setPreviewVideoOpen] = React.useState(false);
  const [previewFile, setPreviewFile] = React.useState<{ url: string; title?: string } | null>(null);
  const [fullscreen, setFullscreen] = React.useState(false);

  const handlePreviewImage = (url: string, title?: string) => {
    setPreviewFile({ url, title });
    setPreviewImageOpen(true);
  };

  const handlePreviewVideo = (url: string, title?: string) => {
    setPreviewFile({ url, title });
    setPreviewVideoOpen(true);
  };

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

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, row: LessonDetailResponse) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleOpenDeleteDialog = (ids: string[]) => {
    setIdsToDelete(ids);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    await onDeleteLesson(idsToDelete);
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
              <TableCell>Enable Play</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>LessonType</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Video</TableCell>
              <TableCell>Quiz</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody />
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
                      <IconButton
                        onClick={() => {
                          if (row.thumbnail?.resourceUrl) {
                            handlePreviewImage(row.thumbnail.resourceUrl, row.name);
                          }
                        }}
                        sx={{ p: 0 }} // Remove padding for compact avatar click
                      >
                        <Avatar src={row.thumbnail?.resourceUrl}>{row.name?.[0]}</Avatar>
                      </IconButton>
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
                  <TableCell>{row.enablePlay ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.lessonType}</TableCell>
                  <TableCell>{row.category?.categoryName}</TableCell>
                  <TableCell>
                    {row.video?.resourceUrl ? (
                      <IconButton onClick={() => handlePreviewVideo(row.video?.resourceUrl ?? '', row.name)}>
                        <Visibility fontSize="small" />
                      </IconButton>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>{row.quizzes?.length}</TableCell>
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

      {selectedRow && (
        <LessonDetailForm open={viewOpen} lessonId={selectedRow?.id ?? null} onClose={() => setViewOpen(false)} />
      )}

      {editCourseData && (
        <UpdateLessonFormDialog
          open={editOpen}
          data={editCourseData}
          onClose={() => setEditOpen(false)}
          onSubmit={async (updatedData) => {
            await onEditLesson(updatedData);
            setEditOpen(false);
          }}
        />
      )}

      {previewFile?.url && (
        <ImagePreviewDialog
          open={previewImageOpen}
          onClose={() => setPreviewImageOpen(false)}
          imageUrl={previewFile.url}
          title={previewFile.title}
          fullscreen={fullscreen}
          onToggleFullscreen={() => setFullscreen((prev) => !prev)}
        />
      )}

      {previewFile?.url && (
        <VideoPreviewDialog
          open={previewVideoOpen}
          onClose={() => setPreviewVideoOpen(false)}
          videoUrl={previewFile.url}
          title={previewFile.title}
          fullscreen={fullscreen}
          onToggleFullscreen={() => setFullscreen((prev) => !prev)}
        />
      )}

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        selectedCount={idsToDelete.length}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </Card>
  );
}
