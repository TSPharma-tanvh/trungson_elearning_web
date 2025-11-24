'use client';

import React from 'react';
import { GetQuestionRequest } from '@/domain/models/question/request/get-question-request';
import { type UpdateQuestionRequest } from '@/domain/models/question/request/update-question-request';
import { type QuestionResponse } from '@/domain/models/question/response/question-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { QuestionFilters } from '@/presentation/components/dashboard/quiz/question/question-filter';
import QuestionTable from '@/presentation/components/dashboard/quiz/question/question-table';

export default function Page(): React.JSX.Element {
  const { t } = useTranslation();
  const { questionUsecase } = useDI();

  // const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [filters, setFilters] = React.useState<GetQuestionRequest>(
    new GetQuestionRequest({ pageNumber: 1, pageSize: 10 })
  );
  const [questions, setQuestions] = React.useState<QuestionResponse[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [_deleteLoading, setDeleteLoading] = React.useState(false);
  // const [showImportDialog, setShowImportDialog] = React.useState(false);
  // const [excelImportLoading, setExcelImportLoading] = React.useState(false);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const fetchQuestions = React.useCallback(async () => {
    try {
      const request = new GetQuestionRequest({
        ...filters,
        pageNumber: page + 1,
        pageSize: rowsPerPage,
      });
      const { questions: questionList, totalRecords } = await questionUsecase.getQuestionListInfo(request);
      setQuestions(questionList);
      setTotalCount(totalRecords);
    } catch (error) {
      setQuestions([]);
    }
  }, [filters, page, rowsPerPage, questionUsecase]);

  React.useEffect(() => {
    void fetchQuestions();
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

  // const handleCreateQuestion = async (request: CreateQuestionRequest) => {
  //   try {
  //     await questionUsecase.createQuestion(request);
  //     setShowCreateDialog(false);
  //     await fetchQuestions();
  //   } catch (error) {
  //     return undefined;
  //   }
  // };

  // const handleImportExcel = async (request: CreateQuestionsFromExcelDto) => {
  //   try {
  //     setExcelImportLoading(true);
  //     await questionUsecase.createQuestionByExcel(request);
  //     setShowImportDialog(false);
  //     await fetchQuestions();
  //   } catch (error) {
  //     return undefined;
  //   } finally {
  //     setExcelImportLoading(false);
  //   }
  // };

  const handleEditQuestion = async (request: UpdateQuestionRequest) => {
    try {
      await questionUsecase.updateQuestion(request);
      await fetchQuestions();
    } catch (error) {
      return undefined;
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
            {t('questions')}
          </Typography>
        </Stack>
        {/* <Button
          startIcon={<Plus fontSize="var(--icon-fontSize-md)" />}
          variant="contained"
          onClick={() => {
            setShowImportDialog(true);
          }}
        >
          {t('add')}
        </Button> */}
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
      />

      {/* <QuestionCreateForm
        onSubmit={handleCreateQuestion}
        disabled={false}
        loading={false}
        open={showCreateDialog}
        onClose={() => {
          setShowCreateDialog(false);
        }}
      /> */}

      {/* <CreateQuestionsFromExcelDialog
        open={showImportDialog}
        loading={excelImportLoading}
        onClose={() => setShowImportDialog(false)}
        onSubmit={handleImportExcel}
      /> */}
    </Stack>
  );
}
