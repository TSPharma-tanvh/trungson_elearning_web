'use client';

import * as React from 'react';
import { GetQuizRequest } from '@/domain/models/quiz/request/get-quiz-request';
import { CoreEnumUtils, QuizTypeEnum } from '@/utils/enum/core-enum';
import { DisplayTypeEnum, StatusEnum } from '@/utils/enum/path-enum';
import { Button, Card, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomSelectFilter } from '@/presentation/components/core/drop-down/custom-select-filter';
import { CustomSearchFilter } from '@/presentation/components/core/text-field/custom-search-filter';

export function QuizFilters({ onFilter }: { onFilter: (filters: GetQuizRequest) => void }): React.JSX.Element {
  const { t } = useTranslation();

  const [searchText, setSearchText] = React.useState('');
  const [isRequired, setIsRequired] = React.useState<boolean | undefined>(undefined);
  const [status, setStatus] = React.useState<StatusEnum | undefined>(undefined);
  const [displayType, setDisplayType] = React.useState<DisplayTypeEnum | undefined>(undefined);
  const [quizType, setQuizType] = React.useState<QuizTypeEnum | undefined>(undefined);

  const handleFilter = () => {
    const request = new GetQuizRequest({
      searchText: searchText || undefined,
      isRequired,
      type: quizType || undefined,
      pageNumber: 1,
      pageSize: 10,
    });

    onFilter(request);
  };

  const handleClear = () => {
    setSearchText('');
    setIsRequired(undefined);
    setStatus(undefined);
    setDisplayType(undefined);
    onFilter(new GetQuizRequest({ pageNumber: 1, pageSize: 10 }));
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
        <CustomSearchFilter
          value={searchText}
          onChange={setSearchText}
          onEnter={() => handleFilter()}
          placeholder={t('searchQuiz')}
        />

        {/* Is Required */}

        <CustomSelectFilter<boolean>
          label={t('isRequired')}
          value={isRequired}
          onChange={setIsRequired}
          options={[
            { value: true, label: 'required' },
            { value: false, label: 'optional' },
          ]}
        />

        {/* Quiz Type */}
        <CustomSelectFilter<QuizTypeEnum>
          label={t('type')}
          value={quizType}
          onChange={(val) => {
            setQuizType(val);
          }}
          options={CoreEnumUtils.getEnumOptions(QuizTypeEnum)}
        />

        {/* Status */}
        <CustomSelectFilter<StatusEnum>
          label={t('status')}
          value={status}
          onChange={(val) => {
            setStatus(val);
          }}
          options={CoreEnumUtils.getEnumOptions(StatusEnum)}
        />

        {/* Display Type */}
        <CustomSelectFilter<DisplayTypeEnum>
          label={t('displayType')}
          value={displayType}
          onChange={(val) => {
            setDisplayType(val);
          }}
          options={CoreEnumUtils.getEnumOptions(DisplayTypeEnum)}
        />

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
