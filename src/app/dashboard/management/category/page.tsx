'use client';

import React from 'react';
import { type CreateCategoryRequest } from '@/domain/models/category/request/create-category-request';
import { GetCategoryRequest } from '@/domain/models/category/request/get-category-request';
import { type UpdateCategoryRequest } from '@/domain/models/category/request/update-category-request';
import { type CategoryDetailResponse } from '@/domain/models/category/response/category-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { Button, Stack, Typography } from '@mui/material';
import { Plus } from '@phosphor-icons/react';

import { CreateCategoryDialog } from '@/presentation/components/dashboard/management/category/category-create-form';
import { CategoryFilters } from '@/presentation/components/dashboard/management/category/category-filter';
import CategoryTable from '@/presentation/components/dashboard/management/category/category-table';

export default function Page(): React.JSX.Element {
  const { categoryUsecase } = useDI();

  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [filters, setFilters] = React.useState<GetCategoryRequest>(
    new GetCategoryRequest({ pageNumber: 1, pageSize: 10 })
  );
  const [categorys, setCategories] = React.useState<CategoryDetailResponse[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [_deleteLoading, setDeleteLoading] = React.useState(false);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const fetchCategories = React.useCallback(async () => {
    try {
      const request = new GetCategoryRequest({
        ...filters,
        pageNumber: page + 1,
        pageSize: rowsPerPage,
      });
      const { categories, totalRecords } = await categoryUsecase.getCategoryList(request);
      setCategories(categories);
      setTotalCount(totalRecords);
    } catch (error) {
      setCategories([]);
      return undefined;
    }
  }, [filters, page, rowsPerPage, categoryUsecase]);

  React.useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const handleFilter = (newFilters: GetCategoryRequest) => {
    setFilters(newFilters);
    setPage(0);
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(event.target.value, 10);
    setRowsPerPage(newSize);
    setPage(0);
  };

  const handleCreateCategory = async (request: CreateCategoryRequest) => {
    try {
      await categoryUsecase.createCategory(request);
      setShowCreateDialog(false);
      await fetchCategories();
    } catch (error) {
      return undefined;
    }
  };

  const handleEditCategory = async (request: UpdateCategoryRequest) => {
    try {
      await categoryUsecase.updateCategory(request);
      await fetchCategories();
    } catch (error) {
      return undefined;
    }
  };

  const handleDeleteCategories = async (ids: string[]) => {
    try {
      setDeleteLoading(true);
      for (const id of ids) {
        const response = await categoryUsecase.deleteCategory(id);
        if (!response) {
          throw new Error(`Failed to delete path with ID: ${id}`);
        }
      }
      await fetchCategories();
    } catch (error) {
      return undefined;
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4" sx={{ color: 'var(--mui-palette-secondary-main)' }}>
            Category
          </Typography>
        </Stack>
        <Button
          startIcon={<Plus fontSize="var(--icon-fontSize-md)" />}
          variant="contained"
          onClick={() => {
            setShowCreateDialog(true);
          }}
        >
          Add
        </Button>
      </Stack>
      <CategoryFilters onFilter={handleFilter} />
      <CategoryTable
        rows={categorys}
        count={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onDeleteCategories={handleDeleteCategories}
        onEditCategory={handleEditCategory}
      />

      <CreateCategoryDialog
        onSubmit={handleCreateCategory}
        disabled={false}
        loading={false}
        open={showCreateDialog}
        onClose={() => {
          setShowCreateDialog(false);
        }}
      />
    </Stack>
  );
}
