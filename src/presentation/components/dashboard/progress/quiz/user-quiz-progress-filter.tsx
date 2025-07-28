'use client';

import * as React from 'react';
import { GetUserQuizProgressRequest } from '@/domain/models/user-quiz/request/get-user-quiz-progress-request';
import { CoreEnumUtils, UserQuizProgressEnum } from '@/utils/enum/core-enum';
import { Button, Card, Stack } from '@mui/material';

import { CustomSelectFilter } from '@/presentation/components/core/drop-down/custom-select-filter';
import { CustomSearchFilter } from '@/presentation/components/core/text-field/custom-search-filter';

export function UserQuizProgressFilters({
  onFilter,
}: {
  onFilter: (filters: GetUserQuizProgressRequest) => void;
}): React.JSX.Element {
  const [searchText, setSearchText] = React.useState('');
  const [status, setStatus] = React.useState<UserQuizProgressEnum | undefined>(undefined);

  const handleFilter = () => {
    const request = new GetUserQuizProgressRequest({
      searchText: searchText || undefined,
      progressStatus: status !== undefined ? status : undefined,
      pageNumber: 1,
      pageSize: 10,
    });

    onFilter(request);
  };

  const handleClear = () => {
    setSearchText('');
    setStatus(undefined);
    onFilter(new GetUserQuizProgressRequest({ pageNumber: 1, pageSize: 10 }));
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
        <CustomSearchFilter value={searchText} onChange={setSearchText} placeholder="Search progress" />

        {/* Status */}
        <CustomSelectFilter<UserQuizProgressEnum>
          label="Status"
          value={status}
          onChange={(val) => {
            setStatus(val);
          }}
          options={CoreEnumUtils.getEnumOptions(UserQuizProgressEnum)}
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
