'use client';

import React from 'react';
import { type CreateCategoryRequest } from '@/domain/models/category/request/create-category-request';
import { GetCategoryRequest } from '@/domain/models/category/request/get-category-request';
import { type UpdateCategoryRequest } from '@/domain/models/category/request/update-category-request';
import { type CategoryDetailResponse } from '@/domain/models/category/response/category-detail-response';
import { type CreateQuestionsFromExcelDto } from '@/domain/models/question/request/create-question-from-excel-request';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { CategoryEnum } from '@/utils/enum/core-enum';
import { Button, Stack, Typography } from '@mui/material';
import { FileXls, Plus } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

import { CreateQuestionCategoryDialog } from '@/presentation/components/dashboard/quiz/category/question-category-create-form';
import { QuestionCategoryFilters } from '@/presentation/components/dashboard/quiz/category/question-category-filter';
import QuestionCategoryTable from '@/presentation/components/dashboard/quiz/category/question-category-table';
import { CreateQuestionsFromExcelDialog } from '@/presentation/components/dashboard/quiz/question/question-create-by-excel-form';

export default function Page(): React.JSX.Element {
  const { t } = useTranslation();
  const { categoryUsecase, questionUsecase } = useDI();

  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [filters, setFilters] = React.useState<GetCategoryRequest>(
    new GetCategoryRequest({ pageNumber: 1, pageSize: 10 })
  );
  const [categorys, setCategories] = React.useState<CategoryDetailResponse[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [_deleteLoading, setDeleteLoading] = React.useState(false);

  //import
  const [showImportDialog, setShowImportDialog] = React.useState(false);
  const [excelImportLoading, setExcelImportLoading] = React.useState(false);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const fetchCategories = React.useCallback(async () => {
    try {
      const request = new GetCategoryRequest({
        ...filters,
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        category: CategoryEnum[CategoryEnum.Question],
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

  //create
  const handleCreateCategory = async (request: CreateCategoryRequest) => {
    try {
      await categoryUsecase.createCategory(request);
      setShowCreateDialog(false);
      await fetchCategories();
    } catch (error) {
      return undefined;
    }
  };

  //import question
  const handleImportExcel = async (request: CreateQuestionsFromExcelDto) => {
    try {
      setExcelImportLoading(true);
      await questionUsecase.createQuestionByExcel(request);
      setShowImportDialog(false);
      await fetchCategories();
    } catch (error) {
      return undefined;
    } finally {
      setExcelImportLoading(false);
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
            {t('questionBank')}
          </Typography>
        </Stack>
        
        <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
          <Button
            startIcon={<FileXls fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={() => {
              setShowImportDialog(true);
            }}
            sx={{
              backgroundColor: 'var(--mui-palette-secondary-main)',
              '&:hover': {
                backgroundColor: 'var(--mui-palette-secondary-dark)',
                color: 'var(--mui-palette-common-white)',
                borderColor: 'var(--mui-palette-secondary-dark)',
              },
            }}
          >
            {t('updateQuestions')}
          </Button>
          <Button
            startIcon={<Plus fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={() => {
              setShowCreateDialog(true);
            }}
          >
            {t('addQuestionBank')}
          </Button>
        </Stack>
      </Stack>
      <QuestionCategoryFilters onFilter={handleFilter} />
      <QuestionCategoryTable
        rows={categorys}
        count={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onDeleteCategories={handleDeleteCategories}
        onEditCategory={handleEditCategory}
      />

      <CreateQuestionCategoryDialog
        onSubmit={handleCreateCategory}
        disabled={false}
        loading={false}
        open={showCreateDialog}
        onClose={() => {
          setShowCreateDialog(false);
        }}
      />

      <CreateQuestionsFromExcelDialog
        open={showImportDialog}
        loading={excelImportLoading}
        onClose={() => {
          setShowImportDialog(false);
        }}
        onSubmit={handleImportExcel}
      />
    </Stack>
  );
}
