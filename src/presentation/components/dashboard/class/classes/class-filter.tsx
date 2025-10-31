'use client';

import * as React from 'react';
import { GetClassRequest } from '@/domain/models/class/request/get-class-request';
import { CoreEnumUtils, LearningModeEnum, ScheduleStatusEnum } from '@/utils/enum/core-enum';
import { Button, Card, Stack } from '@mui/material';
import { t } from 'i18next';

import { CustomSelectFilter } from '@/presentation/components/core/drop-down/custom-select-filter';
import { CustomSearchFilter } from '@/presentation/components/core/text-field/custom-search-filter';

export function ClassFilters({ onFilter }: { onFilter: (filters: GetClassRequest) => void }): React.JSX.Element {
  const [searchText, setSearchText] = React.useState('');
  const [className, setClassName] = React.useState('');
  const [classType, setClassType] = React.useState<LearningModeEnum | undefined>(undefined);
  const [scheduleStatus, setScheduleStatus] = React.useState<ScheduleStatusEnum | undefined>(undefined);

  const handleFilter = () => {
    const request = new GetClassRequest({
      searchText: searchText || undefined,
      className: className || undefined,
      classType: classType !== undefined ? LearningModeEnum[classType] : undefined,
      scheduleStatus: scheduleStatus !== undefined ? ScheduleStatusEnum[scheduleStatus] : undefined,
      pageNumber: 1,
      pageSize: 10,
    });

    onFilter(request);
  };

  const handleClear = () => {
    setSearchText('');
    setClassName('');
    setClassType(undefined);
    setScheduleStatus(undefined);

    onFilter(new GetClassRequest({ pageNumber: 1, pageSize: 10 }));
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
        {/* Search Text */}
        <CustomSearchFilter
          value={searchText}
          onChange={setSearchText}
          onEnter={() => { handleFilter(); }}
          placeholder={t('searchClass')}
        />

        {/* Class Type */}
        <CustomSelectFilter<LearningModeEnum>
          label={t('classType')}
          value={classType}
          onChange={(val) => {
            setClassType(val);
          }}
          options={CoreEnumUtils.getEnumOptions(LearningModeEnum)}
        />

        {/* Schedule Status */}
        <CustomSelectFilter<ScheduleStatusEnum>
          label={t('scheduleStatus')}
          value={scheduleStatus}
          onChange={(val) => {
            setScheduleStatus(val);
          }}
          options={CoreEnumUtils.getEnumOptions(ScheduleStatusEnum)}
          minWidth={180}
        />

        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleFilter}
          sx={{ backgroundColor: 'var(--mui-palette-primary-main)', color: 'var(--mui-palette-common-white)' }}
        >
          {t('filter')}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={handleClear}
          sx={{
            color: 'var(--mui-palette-secondary-main)',
            borderColor: 'var(--mui-palette-secondary-main)',
            '&:hover': {
              backgroundColor: 'var(--mui-palette-secondary-main)',
              color: 'var(--mui-palette-common-white)',
              borderColor: 'var(--mui-palette-secondary-dark)',
            },
          }}
        >
          {t('clear')}
        </Button>
      </Stack>
    </Card>
  );
}
