'use client';

import * as React from 'react';
import { GetUserDevicesRequest } from '@/domain/models/user-devices/request/get-user-devices-request';
import { LearningModeEnum, ScheduleStatusEnum } from '@/utils/enum/core-enum';
import { DisplayTypeEnum, StatusEnum } from '@/utils/enum/path-enum';
import { Button, Card, Stack } from '@mui/material';

import { CustomSearchFilter } from '@/presentation/components/core/text-field/custom-search-filter';

export function UserDevicesFilters({
  onFilter,
}: {
  onFilter: (filters: GetUserDevicesRequest) => void;
}): React.JSX.Element {
  const [searchText, setSearchText] = React.useState('');

  const handleFilter = () => {
    const request = new GetUserDevicesRequest({
      searchText: searchText || undefined,
      pageNumber: 1,
      pageSize: 10,
    });

    onFilter(request);
  };

  const handleClear = () => {
    setSearchText('');

    onFilter(new GetUserDevicesRequest({ pageNumber: 1, pageSize: 10 }));
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
        <CustomSearchFilter value={searchText} onChange={setSearchText} placeholder="Search devices" />

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
