'use client';

import React from 'react';
import { type UpdateCoursePathRequest } from '@/domain/models/path/request/update-path-request';
import { type CoursePathResponse } from '@/domain/models/path/response/course-path-response';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { CancelOutlined, CheckCircleOutline, MoreVert } from '@mui/icons-material';
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
import { useTranslation } from 'react-i18next';

import { ConfirmDeleteDialog } from '../../../core/dialog/confirm-delete-dialog';
import CoursePathDetailForm from './course-path-detail-form';
import { UpdatePathFormDialog } from './update-path-form';

interface CoursePathTableProps {
  rows: CoursePathResponse[];
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteCoursePaths: (ids: string[]) => Promise<void>;
  onEditCoursePath: (data: UpdateCoursePathRequest) => Promise<void>;
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
}: CoursePathTableProps) {
  const { t } = useTranslation();
  const rowIds = React.useMemo(() => rows.map((r) => r.id!), [rows]);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = React.useState<CoursePathResponse | null>(null);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [editPathData, setEditPathData] = React.useState<CoursePathResponse | null>(null);
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

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, row: CoursePathResponse) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
              onClick={() => {
                handleOpenDeleteDialog(Array.from(selected));
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
                <TableCell>{t('name')}</TableCell>
                <TableCell>{t('detail')}</TableCell>
                <TableCell>{t('required')}</TableCell>
                <TableCell>{t('startTime')}</TableCell>
                <TableCell>{t('endTime')}</TableCell>
                <TableCell>{t('status')}</TableCell>
                <TableCell>{t('displayType')}</TableCell>
                <TableCell>{t('category')}</TableCell>
                <TableCell>{t('courses')}</TableCell>
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
                const isItemSelected = isSelected(row.id!);
                return (
                  <TableRow key={row.id} selected={isItemSelected} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onChange={() => {
                          handleSelectOne(row.id!);
                        }}
                      />
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
                    <TableCell>
                      {row.isRequired ? (
                        <CheckCircleOutline sx={{ color: 'var(--mui-palette-primary-main)' }} />
                      ) : (
                        <CancelOutlined sx={{ color: 'var(--mui-palette-error-main)' }} />
                      )}
                    </TableCell>
                    <TableCell>{DateTimeUtils.formatISODateFromString(row.startTime ?? '')}</TableCell>
                    <TableCell>{DateTimeUtils.formatISODateFromString(row.endTime ?? '')}</TableCell>
                    <TableCell>
                      {row.status ? t(row.status.charAt(0).toLowerCase() + t(row.status).slice(1)) : ''}
                    </TableCell>
                    <TableCell>
                      {row.displayType ? t(row.displayType.charAt(0).toLowerCase() + t(row.displayType).slice(1)) : ''}
                    </TableCell>
                    <TableCell>{row.category?.categoryName}</TableCell>
                    <TableCell>{row.courses.length}</TableCell>
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
            {t('viewDetails')}
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
            {t('edit')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (selectedRow?.id) handleOpenDeleteDialog([selectedRow.id]);
              handleMenuClose();
            }}
          >
            {t('delete')}
          </MenuItem>
        </MenuList>
      </Popover>

      {editPathData ? (
        <UpdatePathFormDialog
          open={editOpen}
          path={editPathData}
          onClose={() => {
            setEditOpen(false);
          }}
          onSubmit={async (updatedData) => {
            await onEditCoursePath(updatedData);
            setEditOpen(false);
          }}
        />
      ) : null}

      {selectedRow ? (
        <CoursePathDetailForm
          open={viewOpen}
          coursePathId={selectedRow?.id ?? null}
          onClose={() => {
            setViewOpen(false);
          }}
        />
      ) : null}

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        selectedCount={idsToDelete.length}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
