'use client';

import * as React from 'react';
import { GetAnswerRequest } from '@/domain/models/answer/request/get-answer-request';
import { CoreEnumUtils } from '@/utils/enum/core-enum';
import { StatusEnum } from '@/utils/enum/path-enum';
import { Button, Card, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomSelectFilter } from '@/presentation/components/core/drop-down/custom-select-filter';
import { CustomSearchFilter } from '@/presentation/components/core/text-field/custom-search-filter';

export function AnswerFilters({ onFilter }: { onFilter: (filters: GetAnswerRequest) => void }): React.JSX.Element {
  const { t } = useTranslation();
  const [searchText, setSearchText] = React.useState('');
  const [isCorrect, setIsCorrect] = React.useState<boolean | undefined>(undefined);
  const [status, setStatus] = React.useState<StatusEnum | undefined>(undefined);

  const handleFilter = () => {
    const request = new GetAnswerRequest({
      searchText: searchText || undefined,
      isCorrect,
      status,
      pageNumber: 1,
      pageSize: 10,
    });

    onFilter(request);
  };

  const handleClear = () => {
    setSearchText('');
    setIsCorrect(undefined);
    setStatus(undefined);
    onFilter(new GetAnswerRequest({ pageNumber: 1, pageSize: 10 }));
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
      {' '}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" flexWrap="wrap">
        <CustomSearchFilter
          value={searchText}
          onChange={setSearchText}
          onEnter={() => handleFilter()}
          placeholder={t('searchAnswers')}
        />

        {/* Is Required */}
        <CustomSelectFilter<boolean>
          label={t('isCorrect')}
          value={isCorrect}
          onChange={setIsCorrect}
          options={[
            { value: true, label: 'correct' },
            { value: false, label: 'false' },
          ]}
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
