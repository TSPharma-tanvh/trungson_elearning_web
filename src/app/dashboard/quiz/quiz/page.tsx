'use client';

import * as React from 'react';
import type { Metadata } from 'next';
import { CreateQuizRequest } from '@/domain/models/quiz/request/create-quiz-request';
import { GetQuizRequest } from '@/domain/models/quiz/request/get-quiz-request';
import { UpdateQuizRequest } from '@/domain/models/quiz/request/update-quiz-request';
import { QuizResponse } from '@/domain/models/quiz/response/quiz-response';
import { useDI } from '@/presentation/hooks/useDependencyContainer';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Box, useMediaQuery, useTheme } from '@mui/system';
import { Copy, CopySimple } from '@phosphor-icons/react/dist/ssr';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus, Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import dayjs from 'dayjs';

import { config } from '@/config';
import { CategoryMultiCheckForm } from '@/presentation/components/dashboard/class/classes/category-multickeck-form';
import { AddCustomerDialog } from '@/presentation/components/dashboard/customer/add-customer';
import { CustomersFilters } from '@/presentation/components/dashboard/customer/customers-filters';
import { CustomersTable } from '@/presentation/components/dashboard/customer/customers-table';
import type { Customer } from '@/presentation/components/dashboard/customer/customers-table';
import { QuizFilters } from '@/presentation/components/dashboard/quiz/question/quiz-filter';
import QuizTable from '@/presentation/components/dashboard/quiz/question/quiz-table';

// export const metadata = { title: `Customers | Dashboard | ${config.site.name}` } satisfies Metadata;
export default function Page(): React.JSX.Element {
  const { quizUsecase } = useDI();

  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = React.useState(false);
  const [filters, setFilters] = React.useState<GetQuizRequest>(new GetQuizRequest({ pageNumber: 1, pageSize: 10 }));
  const [quizzes, setQuizzes] = React.useState<QuizResponse[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const fetchQuizs = React.useCallback(async () => {
    try {
      const request = new GetQuizRequest({
        ...filters,
        pageNumber: page + 1,
        pageSize: rowsPerPage,
      });
      const { quizzes, totalRecords } = await quizUsecase.getQuizListInfo(request);
      setQuizzes(quizzes);
      setTotalCount(totalRecords);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  }, [filters, page, rowsPerPage, quizUsecase]);

  React.useEffect(() => {
    fetchQuizs();
  }, [fetchQuizs]);

  const handleFilter = (newFilters: GetQuizRequest) => {
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

  const handleCreateQuiz = async (request: CreateQuizRequest) => {
    try {
      await quizUsecase.createQuiz(request);
      setShowCreateDialog(false);
      await fetchQuizs();
    } catch (error) {
      console.error('Failed to create course path:', error);
    }
  };

  const handleEditQuiz = async (request: UpdateQuizRequest) => {
    try {
      await quizUsecase.updateQuiz(request);
      await fetchQuizs();
    } catch (error) {
      console.error('Failed to update course path:', error);
    }
  };

  const handleDeleteQuizs = async (ids: string[]) => {
    try {
      setDeleteLoading(true);
      for (const id of ids) {
        const response = await quizUsecase.deleteQuiz(id);
        if (!response) {
          throw new Error(`Failed to delete path with ID: ${id}`);
        }
      }
      await fetchQuizs();
    } catch (error) {
      console.error('Failed to delete course paths:', error);
      throw error;
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Quizzes</Typography>
        </Stack>
        <Button
          startIcon={<Plus fontSize="var(--icon-fontSize-md)" />}
          variant="contained"
          onClick={() => setShowCreateDialog(true)}
        >
          Add
        </Button>
      </Stack>
      <QuizFilters onFilter={handleFilter} />
      <QuizTable
        rows={quizzes}
        count={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onDeleteQuizs={handleDeleteQuizs}
        onEditQuiz={handleEditQuiz}
      ></QuizTable>

      {/* <CreateQuizDialog
        onSubmit={handleCreateQuiz}
        disabled={false}
        loading={false}
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      /> */}
    </Stack>
  );
}
