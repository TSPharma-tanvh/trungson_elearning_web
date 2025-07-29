'use client';

import * as React from 'react';
import { type CreateQuizFromExcelRequest } from '@/domain/models/quiz/request/create-quiz-from-excel-request';
import { type CreateQuizRequest } from '@/domain/models/quiz/request/create-quiz-request';
import { GetQuizRequest } from '@/domain/models/quiz/request/get-quiz-request';
import { type UpdateQuizRequest } from '@/domain/models/quiz/request/update-quiz-request';
import { type QuizResponse } from '@/domain/models/quiz/response/quiz-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import { CreateQuizDialog } from '@/presentation/components/dashboard/quiz/quiz/quiz-create-form';
import { QuizFilters } from '@/presentation/components/dashboard/quiz/quiz/quiz-filter';
import { ImportQuizDialog } from '@/presentation/components/dashboard/quiz/quiz/quiz-import-form';
import QuizTable from '@/presentation/components/dashboard/quiz/quiz/quiz-table';

export default function Page(): React.JSX.Element {
  const { quizUsecase } = useDI();

  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [showImportDialog, setShowImportDialog] = React.useState(false);
  const [filters, setFilters] = React.useState<GetQuizRequest>(new GetQuizRequest({ pageNumber: 1, pageSize: 10 }));
  const [quizzes, setQuizzes] = React.useState<QuizResponse[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [_deleteLoading, setDeleteLoading] = React.useState(false);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const fetchQuizzes = React.useCallback(async () => {
    try {
      const request = new GetQuizRequest({
        ...filters,
        pageNumber: page + 1,
        pageSize: rowsPerPage,
      });
      const { quizzes: quiz, totalRecords } = await quizUsecase.getQuizListInfo(request);
      setQuizzes(quiz);
      setTotalCount(totalRecords);
    } catch (error) {
      setQuizzes([]);
    }
  }, [filters, page, rowsPerPage, quizUsecase]);

  React.useEffect(() => {
    void fetchQuizzes();
  }, [fetchQuizzes]);

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
      await fetchQuizzes();
    } catch (error) {
      return undefined;
    }
  };

  const handleImportQuiz = async (request: CreateQuizFromExcelRequest) => {
    try {
      await quizUsecase.importFromExcel(request);
      setShowImportDialog(false);
      await fetchQuizzes();
    } catch (error) {
      return undefined;
    }
  };

  const handleEditQuiz = async (request: UpdateQuizRequest) => {
    try {
      await quizUsecase.updateQuiz(request);
      await fetchQuizzes();
    } catch (error) {
      return undefined;
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
      await fetchQuizzes();
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
          <Typography variant="h4">Quizzes</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button
              color="inherit"
              startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}
              onClick={() => {
                setShowImportDialog(true);
              }}
            >
              Import Questions to Quiz
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Download Example File
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button
            startIcon={<Plus fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={() => {
              setShowCreateDialog(true);
            }}
          >
            Add
          </Button>
        </div>
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
      />

      <CreateQuizDialog
        onSubmit={handleCreateQuiz}
        disabled={false}
        loading={false}
        open={showCreateDialog}
        onClose={() => {
          setShowCreateDialog(false);
        }}
      />

      <ImportQuizDialog
        onSubmit={handleImportQuiz}
        disabled={false}
        loading={false}
        open={showImportDialog}
        onClose={() => {
          setShowImportDialog(false);
        }}
      />
    </Stack>
  );
}
