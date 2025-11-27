'use client';

import React from 'react';
import { GetAnswerRequest } from '@/domain/models/answer/request/get-answer-request';
import { type UpdateAnswerRequest } from '@/domain/models/answer/request/update-answer-request';
import { type AnswerDetailResponse } from '@/domain/models/answer/response/answer-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { AnswerFilters } from '@/presentation/components/dashboard/quiz/answer/answer-filter';
import AnswerTable from '@/presentation/components/dashboard/quiz/answer/answer-table';

export default function Page(): React.JSX.Element {
  const { t } = useTranslation();
  const { answerUsecase } = useDI();

  // const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [filters, setFilters] = React.useState<GetAnswerRequest>(new GetAnswerRequest({ pageNumber: 1, pageSize: 10 }));
  const [answers, setAnswers] = React.useState<AnswerDetailResponse[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [_deleteLoading, setDeleteLoading] = React.useState(false);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const fetchAnswers = React.useCallback(async () => {
    try {
      const request = new GetAnswerRequest({
        ...filters,
        pageNumber: page + 1,
        pageSize: rowsPerPage,
      });
      const { answers: answerList, totalRecords } = await answerUsecase.getAnswerListInfo(request);
      setAnswers(answerList);
      setTotalCount(totalRecords);
    } catch (error) {
      setAnswers([]);
    }
  }, [filters, page, rowsPerPage, answerUsecase]);

  React.useEffect(() => {
    void fetchAnswers();
  }, [fetchAnswers]);

  const handleFilter = (newFilters: GetAnswerRequest) => {
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

  // const handleCreateAnswer = async (request: CreateAnswerRequest) => {
  //   try {
  //     await answerUsecase.createAnswer(request);
  //     setShowCreateDialog(false);
  //     await fetchAnswers();
  //   } catch (error) {
  //     return undefined;
  //   }
  // };

  const handleEditAnswer = async (request: UpdateAnswerRequest) => {
    try {
      await answerUsecase.updateAnswer(request);
      await fetchAnswers();
    } catch (error) {
      return undefined;
    }
  };

  const handleDeleteAnswers = async (ids: string[]) => {
    try {
      setDeleteLoading(true);
      for (const id of ids) {
        const response = await answerUsecase.deleteAnswer(id);
        if (!response) {
          throw new Error(`Failed to delete path with ID: ${id}`);
        }
      }
      await fetchAnswers();
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
            {t('answers')}
          </Typography>
        </Stack>
        {/* <Button
          startIcon={<Plus fontSize="var(--icon-fontSize-md)" />}
          variant="contained"
          onClick={() => {
            setShowCreateDialog(true);
          }}
        >
          {t('add')}
        </Button> */}
      </Stack>
      <AnswerFilters onFilter={handleFilter} />

      <AnswerTable
        rows={answers}
        count={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onDeleteAnswers={handleDeleteAnswers}
        onEditAnswer={handleEditAnswer}
      />

      {/* <CreateAnswerForm
        onSubmit={handleCreateAnswer}
        open={showCreateDialog}
        onClose={() => {
          setShowCreateDialog(false);
        }}
      /> */}
    </Stack>
  );
}
