'use client';

import * as React from 'react';
import { GetLessonRequest } from '@/domain/models/lessons/request/get-lesson-request';
import { CoreEnumUtils, LearningModeEnum } from '@/utils/enum/core-enum';
import { StatusEnum } from '@/utils/enum/path-enum';
import { Button, Card, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomSelectFilter } from '@/presentation/components/core/drop-down/custom-select-filter';
import { CustomSearchFilter } from '@/presentation/components/core/text-field/custom-search-filter';

export function LessonsFilters({ onFilter }: { onFilter: (filters: GetLessonRequest) => void }): React.JSX.Element {
  const { t } = useTranslation();

  const [searchText, setSearchText] = React.useState('');
  const [status, setStatus] = React.useState<StatusEnum | undefined>(undefined);
  const [lessonsType, setLessonsType] = React.useState<LearningModeEnum | undefined>(undefined);

  const handleFilter = () => {
    const request = new GetLessonRequest({
      searchText: searchText || undefined,
      status,
      lessonType: lessonsType,
      pageNumber: 1,
      pageSize: 10,
    });

    onFilter(request);
  };

  const handleClear = () => {
    setSearchText('');
    setStatus(undefined);
    setLessonsType(undefined);
    onFilter(new GetLessonRequest({ pageNumber: 1, pageSize: 10 }));
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
          placeholder={t('searchLessons') || 'Search lessons'}
        />

        <CustomSelectFilter<LearningModeEnum>
          label={t('type')}
          value={lessonsType}
          onChange={setLessonsType}
          options={CoreEnumUtils.getEnumOptions(LearningModeEnum)}
        />

        <CustomSelectFilter<StatusEnum>
          label={t('status')}
          value={status}
          onChange={setStatus}
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
