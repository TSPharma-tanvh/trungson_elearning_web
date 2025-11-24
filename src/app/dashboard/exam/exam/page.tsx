'use client';

import * as React from 'react';
import { type CreateQuizRequest } from '@/domain/models/quiz/request/create-quiz-request';
import { GetQuizRequest } from '@/domain/models/quiz/request/get-quiz-request';
import { type UpdateQuizRequest } from '@/domain/models/quiz/request/update-quiz-request';
import { type QuizResponse } from '@/domain/models/quiz/response/quiz-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { QuizTypeEnum } from '@/utils/enum/core-enum';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { FileXls } from '@phosphor-icons/react';
import { Plus } from '@phosphor-icons/react/dist/ssr/Plus';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';

import { CreateExamDialog } from '@/presentation/components/dashboard/quiz/exam/exam-create-form';
import { ExamFilters } from '@/presentation/components/dashboard/quiz/exam/exam-filter';
import ExamTable from '@/presentation/components/dashboard/quiz/exam/exam-table';

const excelLink = process.env.NEXT_PUBLIC_IMPORT_QUIZ_FORM;

export default function Page(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();

  const { quizUsecase } = useDI();

  const [showCreateQuizExamDialog, setShowCreateQuizExamDialog] = React.useState(false);

  // const [showImportDialog, setShowImportDialog] = React.useState(false);
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
        type: QuizTypeEnum.ExamQuiz,
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

  const handleCreateQuizExam = async (request: CreateQuizRequest) => {
    try {
      await quizUsecase.createQuiz(request);
      setShowCreateQuizExamDialog(false);
      await fetchQuizzes();
    } catch (error) {
      return undefined;
    }
  };

  const handleCreateQuizLesson = async (request: CreateQuizRequest) => {
    try {
      await quizUsecase.createQuiz(request);
      setShowCreateQuizExamDialog(false);
      await fetchQuizzes();
    } catch (error) {
      return undefined;
    }
  };

  // const handleImportQuiz = async (request: CreateQuizFromExcelRequest) => {
  //   try {
  //     await quizUsecase.importFromExcel(request);
  //     setShowImportDialog(false);
  //     await fetchQuizzes();
  //   } catch (error) {
  //     return undefined;
  //   }
  // };

  const handleEditQuiz = async (request: UpdateQuizRequest) => {
    try {
      await quizUsecase.updateQuiz(request);
      await fetchQuizzes();
    } catch (error) {
      return undefined;
    }
  };

  const handleDeleteQuizzesPermanent = async (ids: string[]) => {
    try {
      setDeleteLoading(true);
      for (const id of ids) {
        const response = await quizUsecase.deleteQuizPermanent(id);
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

  const handleExportToExcel = () => {
    const exportData = quizzes.map((row) => ({
      [t('title')]: row.title ?? '',
      [t('title')]: row.title ?? '',
      [t('detail')]: row.description ?? '',
      [t('status')]: row.status ? t(row.status.toLowerCase()) : '',
      [t('type')]: row.type ? t(row.type.toString().toLowerCase()) : '',
      [t('totalQuestion')]: row.totalQuestion ?? '',
      [t('totalScore')]: row.totalScore ?? '',
      [t('scoreToPass')]: row.scoreToPass ?? '',
      [t('canStartOver')]: row.canStartOver ? t('yes') : t('no'),
      [t('canShuffle')]: row.canShuffle ? t('yes') : t('no'),
      [t('isRequired')]: row.isRequired ? t('yes') : t('no'),
      [t('isAutoSubmitted')]: row.isAutoSubmitted ? t('yes') : t('no'),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Quiz');
    const dateTimeString = DateTimeUtils.getTodayAsString();
    XLSX.writeFile(wb, `Quiz_${dateTimeString}.xlsx`);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4" sx={{ color: 'var(--mui-palette-secondary-main)' }}>
            {t('exam')}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            {/* <Button
              color="inherit"
              startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}
              onClick={() => {
                setShowImportDialog(true);
              }}
            >
              {t('importQuestionsToQuiz')}
            </Button> */}
            {/* <Button
              color="inherit"
              startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}
              onClick={() => window.open(excelLink, '_blank', 'noopener,noreferrer')}
            >
              {t('downloadExampleFile')}
            </Button> */}
            <Button
              color="inherit"
              startIcon={<FileXls fontSize="var(--icon-fontSize-md)" />}
              onClick={() => {
                handleExportToExcel();
              }}
            >
              {t('exportToExcel')}
            </Button>
          </Stack>
        </Stack>
        <div>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button
              startIcon={<Plus fontSize="var(--icon-fontSize-md)" />}
              variant="contained"
              onClick={() => {
                setShowCreateQuizExamDialog(true);
              }}
            >
              {t('quizExamCreate')}
            </Button>
          </Stack>
        </div>
      </Stack>
      <ExamFilters onFilter={handleFilter} />
      <ExamTable
        rows={quizzes}
        count={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        // onDeleteQuizzes={handleDeleteQuizzes}
        onDeleteQuizPermanent={handleDeleteQuizzesPermanent}
        onEditQuiz={handleEditQuiz}
      />

      <CreateExamDialog
        onSubmit={handleCreateQuizExam}
        disabled={false}
        loading={false}
        open={showCreateQuizExamDialog}
        onClose={() => {
          setShowCreateQuizExamDialog(false);
        }}
      />

      {/* <ImportQuizDialog
        onSubmit={handleImportQuiz}
        disabled={false}
        loading={false}
        open={showImportDialog}
        onClose={() => {
          setShowImportDialog(false);
        }}
      /> */}
    </Stack>
  );
}
