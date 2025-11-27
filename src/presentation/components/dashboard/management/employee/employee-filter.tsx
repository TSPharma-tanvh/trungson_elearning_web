'use client';

import * as React from 'react';
import { GetEmployeeRequest } from '@/domain/models/employee/request/get-employee-request';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { Button, Card, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomDateTimeFilter } from '@/presentation/components/core/picker/custom-date-filter';
import { CustomSearchFilter } from '@/presentation/components/core/text-field/custom-search-filter';

export function EmployeeFilters({ onFilter }: { onFilter: (filters: GetEmployeeRequest) => void }): React.JSX.Element {
  const { t } = useTranslation();
  const [searchText, setSearchText] = React.useState('');
  const [dateTime, setDateTime] = React.useState<Date | undefined>(undefined);

  const handleFilter = () => {
    const request = new GetEmployeeRequest({
      searchText: searchText || undefined,
      hireDate: dateTime,
      pageNumber: 1,
      pageSize: 10,
    });

    onFilter(request);
  };

  const handleClear = () => {
    setSearchText('');
    setDateTime(undefined);
    onFilter(new GetEmployeeRequest({ pageNumber: 1, pageSize: 10 }));
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
          onEnter={() => {
            handleFilter();
          }}
          placeholder={t('searchEmployee')}
        />

        <CustomDateTimeFilter
          label={t('startTime')}
          value={dateTime ? dateTime.toISOString() : ''}
          onChange={(value) => {
            const parsedDate = DateTimeUtils.formatStringToDateTime(value);
            if (parsedDate) {
              setDateTime(parsedDate);
            }
          }}
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
