'use client';

import * as React from 'react';
import { GetEmployeeRequest } from '@/domain/models/employee/request/get-employee-request';
import { DateTimeUtils } from '@/utils/date-time-utils';
import { CoreEnumUtils, LearningModeEnum, ScheduleStatusEnum } from '@/utils/enum/core-enum';
import { DisplayTypeEnum, StatusEnum } from '@/utils/enum/path-enum';
import { Button, Card, InputAdornment, OutlinedInput, Stack } from '@mui/material';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react';

import { CustomSelectFilter } from '@/presentation/components/core/drop-down/custom-select-filter';
import { CustomDateTimeFilter } from '@/presentation/components/core/picker/custom-date-filter';
import { CustomDateTimePicker } from '@/presentation/components/core/picker/custom-date-picker';
import { CustomSearchFilter } from '@/presentation/components/core/text-field/custom-search-filter';

export function EmployeeFilters({ onFilter }: { onFilter: (filters: GetEmployeeRequest) => void }): React.JSX.Element {
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
        <CustomSearchFilter value={searchText} onChange={setSearchText} placeholder="Search employee" />

        <CustomDateTimeFilter
          label="Start Time"
          value={dateTime ? dateTime.toISOString() : ''}
          onChange={(value) => {
            const parsedDate = DateTimeUtils.parseLocalDateTimeString(value);
            console.error(value);
            console.error(parsedDate);

            if (parsedDate) {
              setDateTime(parsedDate);
            }
          }}
        />

        <Button variant="contained" color="primary" size="small" onClick={handleFilter}>
          Filter
        </Button>
        <Button variant="outlined" color="secondary" size="small" onClick={handleClear}>
          Clear
        </Button>
      </Stack>
    </Card>
  );
}
