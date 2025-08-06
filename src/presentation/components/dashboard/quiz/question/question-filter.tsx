'use client';

import * as React from 'react';
import { GetQuestionRequest } from '@/domain/models/question/request/get-question-request';
import { Button, Card, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomRangeSlider } from '@/presentation/components/core/custom-range-slider';
import { CustomSearchFilter } from '@/presentation/components/core/text-field/custom-search-filter';

export function QuestionFilters({ onFilter }: { onFilter: (filters: GetQuestionRequest) => void }): React.JSX.Element {
  const { t } = useTranslation();
  const [searchText, setSearchText] = React.useState('');
  const [minMaxAnswers, setMinMaxAnswers] = React.useState<[number, number]>([0, 10]);
  const [quizID, setQuizID] = React.useState('');
  const [questionText, setQuestionText] = React.useState('');

  const handleFilter = () => {
    const request = new GetQuestionRequest({
      searchText: searchText || undefined,
      quizID: quizID || undefined,
      questionText: questionText || undefined,
      minAnswers: minMaxAnswers[0],
      maxAnswers: minMaxAnswers[1],
      pageNumber: 1,
      pageSize: 10,
    });

    onFilter(request);
  };

  const handleClear = () => {
    setSearchText('');
    setQuizID('');
    setQuestionText('');
    setMinMaxAnswers([0, 10]);
    onFilter(new GetQuestionRequest({ pageNumber: 1, pageSize: 10 }));
  };

  return (
    <Card
      sx={{
        p: 2,
        backgroundColor: 'var(--mui-palette-common-white)',
        color: 'var(--mui-palette-primary-main)',
        border: '1px solid var(--mui-palette-primary-main)',
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" flexWrap="wrap">
        <CustomSearchFilter value={searchText} onChange={setSearchText} placeholder={t('searchQuestions')} />

        <CustomRangeSlider label={t('answersRange')} value={minMaxAnswers} onChange={setMinMaxAnswers} />

        <Button variant="contained" color="primary" size="small" onClick={handleFilter}>
          {t('filter')}
        </Button>
        <Button variant="outlined" color="secondary" size="small" onClick={handleClear}>
          {t('clear')}
        </Button>
      </Stack>
    </Card>
  );
}
