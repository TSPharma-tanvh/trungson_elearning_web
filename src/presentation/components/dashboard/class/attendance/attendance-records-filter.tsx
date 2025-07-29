'use client';

import * as React from 'react';
import { GetAttendanceRecordsRequest } from '@/domain/models/attendance/request/get-attendance-records-request';
import { CheckinTimeEnum, CoreEnumUtils } from '@/utils/enum/core-enum';
import { Button, Card, Stack } from '@mui/material';

import { CustomSelectFilter } from '@/presentation/components/core/drop-down/custom-select-filter';
import { CustomSearchFilter } from '@/presentation/components/core/text-field/custom-search-filter';

export function AttendanceRecordsFilters({
  onFilter,
}: {
  onFilter: (filters: GetAttendanceRecordsRequest) => void;
}): React.JSX.Element {
  const [searchText, setSearchText] = React.useState('');
  const [status, setStatus] = React.useState<CheckinTimeEnum | undefined>(undefined);

  const handleFilter = () => {
    const request = new GetAttendanceRecordsRequest({
      searchText: searchText || undefined,
      status,
      pageNumber: 1,
      pageSize: 10,
    });

    onFilter(request);
  };

  const handleClear = () => {
    setSearchText('');
    setStatus(undefined);
    onFilter(new GetAttendanceRecordsRequest({ pageNumber: 1, pageSize: 10 }));
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
        <CustomSearchFilter value={searchText} onChange={setSearchText} placeholder="Search attendance" />

        {/* Status */}
        <CustomSelectFilter<CheckinTimeEnum>
          label="Status"
          value={status}
          onChange={(val) => {
            setStatus(val);
          }}
          options={CoreEnumUtils.getEnumOptions(CheckinTimeEnum)}
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
