import React from 'react';
import { type UpdateCategoryRequest } from '@/domain/models/category/request/update-category-request';
import { type CategoryDetailResponse } from '@/domain/models/category/response/category-detail-response';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { MoreVert } from '@mui/icons-material';
import { Avatar, Box, Checkbox, IconButton, Stack, TableCell, Typography } from '@mui/material';

import { CustomTable } from '@/presentation/components/core/custom-table';
import { ConfirmDeleteDialog } from '@/presentation/components/core/dialog/confirm-delete-dialog';

import CategoryDetailForm from './category-detail-form';
import { UpdateCategoryFormDialog } from './category-update-form';

interface CategoryTableProps {
  rows: CategoryDetailResponse[];
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteCategories: (ids: string[]) => Promise<void>;
  onEditCategory: (data: UpdateCategoryRequest) => Promise<void>;
}

export default function CategoryTable({
  rows,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onDeleteCategories,
  onEditCategory,
}: CategoryTableProps) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [editCategoryData, setEditCategoryData] = React.useState<CategoryDetailResponse | null>(null);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleRequestDelete = (id: string) => {
    setPendingDeleteId(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (pendingDeleteId) {
      await onDeleteCategories([pendingDeleteId]);
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
      <CustomTable<CategoryDetailResponse>
        rows={rows}
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        getRowId={(row) => row.id!}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        onDelete={onDeleteCategories}
        actionMenuItems={[
          {
            label: 'View Details',
            onClick: (row) => {
              setEditCategoryData(row);
              setViewOpen(true);
            },
          },
          {
            label: 'Edit',
            onClick: (row) => {
              setEditCategoryData(row);
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
            <TableCell>Type</TableCell>
          </>
        )}
        renderRow={(row, isSelected, onSelect, onActionClick) => (
          <>
            <TableCell>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar src={row.thumbnail?.resourceUrl}>{row.categoryName?.[0]}</Avatar>
                <Box>
                  <Typography variant="subtitle2" noWrap>
                    {row.categoryName}
                  </Typography>
                </Box>
              </Stack>
            </TableCell>
            <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word', minWidth: 300 }}>
              <Typography variant="body2">{row.description}</Typography>
            </TableCell>

            <TableCell>{row.category}</TableCell>

            <TableCell align="right">
              <IconButton onClick={(e) => { onActionClick(e as React.MouseEvent<HTMLElement>); }}>
                <MoreVert />
              </IconButton>
            </TableCell>
          </>
        )}
      />

      {editCategoryData ? <UpdateCategoryFormDialog
          open={editOpen}
          data={editCategoryData}
          onClose={() => { setEditOpen(false); }}
          onSubmit={async (updatedData) => {
            await onEditCategory(updatedData);
            setEditOpen(false);
          }}
        /> : null}

      {editCategoryData ? <CategoryDetailForm
          open={viewOpen}
          categoryId={editCategoryData.id ?? null}
          onClose={() => { setViewOpen(false); }}
        /> : null}

      <ConfirmDeleteDialog
        open={dialogOpen}
        selectedCount={1}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
