'use client';

import * as React from 'react';
import { GetUserLessonProgressRequest } from '@/domain/models/user-lesson/request/get-user-lesson-request';
import { CoreEnumUtils, UserProgressEnum } from '@/utils/enum/core-enum';
import { Button, Card, Stack } from '@mui/material';

import { CustomSelectFilter } from '@/presentation/components/core/drop-down/custom-select-filter';
import { CustomSearchFilter } from '@/presentation/components/core/text-field/custom-search-filter';

export function UserLessonProgressFilters({
  onFilter,
}: {
  onFilter: (filters: GetUserLessonProgressRequest) => void;
}): React.JSX.Element {
  const [searchText, setSearchText] = React.useState('');
  const [_isRequired, setIsRequired] = React.useState<boolean | undefined>(undefined);
  const [status, setStatus] = React.useState<UserProgressEnum | undefined>(undefined);

  const handleFilter = () => {
    const request = new GetUserLessonProgressRequest({
      searchText: searchText || undefined,
      status: status !== undefined ? UserProgressEnum[status] : undefined,
      pageNumber: 1,
      pageSize: 10,
    });

    onFilter(request);
  };

  const handleClear = () => {
    setSearchText('');
    setIsRequired(undefined);
    setStatus(undefined);
    onFilter(new GetUserLessonProgressRequest({ pageNumber: 1, pageSize: 10 }));
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
        <CustomSelectFilter<UserProgressEnum>
          label="Status"
          value={status}
          onChange={(val) => {
            setStatus(val);
          }}
          options={CoreEnumUtils.getEnumOptions(UserProgressEnum)}
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
