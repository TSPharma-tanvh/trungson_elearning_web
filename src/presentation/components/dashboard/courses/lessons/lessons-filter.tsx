'use client';

import * as React from 'react';
import { GetLessonRequest } from '@/domain/models/lessons/request/get-lesson-request';
import { CoreEnumUtils, LearningModeEnum, LessonContentEnum, StatusEnum } from '@/utils/enum/core-enum';
import { Button, Card, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomSelectFilter } from '@/presentation/components/core/drop-down/custom-select-filter';
import { CustomSearchFilter } from '@/presentation/components/core/text-field/custom-search-filter';

export function LessonsFilters({ onFilter }: { onFilter: (filters: GetLessonRequest) => void }): React.JSX.Element {
  const { t } = useTranslation();

  const [searchText, setSearchText] = React.useState('');
  const [status, setStatus] = React.useState<StatusEnum | undefined>(undefined);
  const [lessonType, setLessonType] = React.useState<LearningModeEnum | undefined>(undefined);
  const [contentType, setContentType] = React.useState<LessonContentEnum | undefined>(undefined);
  const [disableStatus, setDisableStatus] = React.useState<StatusEnum | undefined>(undefined);
  const [hasVideo, setHasVideo] = React.useState<boolean | undefined>(undefined);
  const [hasFileResource, setHasFileResource] = React.useState<boolean | undefined>(undefined);

  const handleFilter = () => {
    const request = new GetLessonRequest({
      searchText: searchText || undefined,
      status,
      lessonType,
      contentType,
      hasVideo,
      hasFileResource,

      pageNumber: 1,
      pageSize: 10,
    });

    onFilter(request);
  };

  const handleClear = () => {
    setSearchText('');
    setStatus(undefined);
    setLessonType(undefined);
    setContentType(undefined);
    setDisableStatus(undefined);
    setHasVideo(undefined);
    setHasFileResource(undefined);
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
          onEnter={() => {
            handleFilter();
          }}
          placeholder={t('searchLessons') || 'Search lessons'}
        />

        <CustomSelectFilter<LearningModeEnum>
          label={t('lessonType')}
          value={lessonType}
          onChange={setLessonType}
          options={CoreEnumUtils.getEnumOptions(LearningModeEnum).map((opt) => ({
            value: opt.value,
            label: t(opt.label),
          }))}
        />

        <CustomSelectFilter<StatusEnum>
          label={t('status')}
          value={status}
          onChange={setStatus}
          options={CoreEnumUtils.getEnumOptions(StatusEnum).map((opt) => ({
            value: opt.value,
            label: t(opt.label),
          }))}
        />

        <CustomSelectFilter<LessonContentEnum>
          label={t('contentType')}
          value={contentType}
          onChange={setContentType}
          options={CoreEnumUtils.getEnumOptions(LessonContentEnum).map((opt) => ({
            value: opt.value,
            label: t(opt.label.toLowerCase()),
          }))}
        />

        <CustomSelectFilter<StatusEnum>
          label={t('disableStatus')}
          value={disableStatus}
          onChange={setDisableStatus}
          options={CoreEnumUtils.getEnumOptions(StatusEnum).map((opt) => ({
            value: opt.value,
            label: t(opt.label),
          }))}
        />

        <CustomSelectFilter<boolean>
          label={t('hasVideo')}
          value={hasVideo}
          onChange={setHasVideo}
          options={[
            { value: true, label: 'yes' },
            { value: false, label: 'no' },
          ]}
        />

        <CustomSelectFilter<boolean>
          label={t('hasFileResource')}
          value={hasFileResource}
          onChange={setHasFileResource}
          options={[
            { value: true, label: 'yes' },
            { value: false, label: 'no' },
          ]}
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
