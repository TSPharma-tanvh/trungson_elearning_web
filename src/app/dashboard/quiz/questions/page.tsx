'use client';

import React from 'react';
import { CreateQuestionRequest } from '@/domain/models/question/request/create-question-request';
import { GetQuestionRequest } from '@/domain/models/question/request/get-question-request';
import { UpdateQuestionRequest } from '@/domain/models/question/request/update-question-request';
import { QuestionResponse } from '@/domain/models/question/response/question-response';
import { useDI } from '@/presentation/hooks/useDependencyContainer';
import { Button, Stack, Typography } from '@mui/material';
import { Plus } from '@phosphor-icons/react';

import { QuestionCreateForm } from '@/presentation/components/dashboard/quiz/question/question-create-form';
import { QuestionFilters } from '@/presentation/components/dashboard/quiz/question/question-filter';
import QuestionTable from '@/presentation/components/dashboard/quiz/question/question-table';

export default function Page(): React.JSX.Element {
  const { questionUsecase } = useDI();

  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = React.useState(false);
  const [filters, setFilters] = React.useState<GetQuestionRequest>(
    new GetQuestionRequest({ pageNumber: 1, pageSize: 10 })
  );
  const [questions, setQuestions] = React.useState<QuestionResponse[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const fetchQuestions = React.useCallback(async () => {
    try {
      const request = new GetQuestionRequest({
        ...filters,
        pageNumber: page + 1,
        pageSize: rowsPerPage,
      });
      const { questions, totalRecords } = await questionUsecase.getQuestionListInfo(request);
      setQuestions(questions);
      setTotalCount(totalRecords);
    } catch (error) {
      setQuestions([]);
    }
  }, [filters, page, rowsPerPage, questionUsecase]);

  React.useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleFilter = (newFilters: GetQuestionRequest) => {
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

  const handleCreateQuestion = async (request: CreateQuestionRequest) => {
    try {
      console.error(request);

      await questionUsecase.createQuestion(request);
      setShowCreateDialog(false);
      await fetchQuestions();
    } catch (error) {
      console.error('Failed to create question:', error);
    }
  };

  const handleEditQuestion = async (request: UpdateQuestionRequest) => {
    try {
      await questionUsecase.updateQuestion(request);
      await fetchQuestions();
    } catch (error) {
      console.error('Failed to update question:', error);
    }
  };

  const handleDeleteQuestions = async (ids: string[]) => {
    try {
      setDeleteLoading(true);
      for (const id of ids) {
        const response = await questionUsecase.deleteQuestion(id);
        if (!response) {
          throw new Error(`Failed to delete path with ID: ${id}`);
        }
      }
      await fetchQuestions();
    } catch (error) {
      console.error('Failed to delete questions:', error);
      throw error;
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4" sx={{ color: 'var(--mui-palette-secondary-main)' }}>
            Questions
          </Typography>
        </Stack>
        <Button
          startIcon={<Plus fontSize="var(--icon-fontSize-md)" />}
          variant="contained"
          onClick={() => setShowCreateDialog(true)}
        >
          Add
        </Button>
      </Stack>
      <QuestionFilters onFilter={handleFilter} />
      <QuestionTable
        rows={questions}
        count={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onDeleteQuestions={handleDeleteQuestions}
        onEditQuestion={handleEditQuestion}
      ></QuestionTable>

      <QuestionCreateForm
        onSubmit={handleCreateQuestion}
        disabled={false}
        loading={false}
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      />
    </Stack>
  );
}
