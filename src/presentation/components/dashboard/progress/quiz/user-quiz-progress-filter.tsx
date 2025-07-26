'use client';

import * as React from 'react';
import { GetUserQuizProgressRequest } from '@/domain/models/user-quiz/request/get-user-quiz-progress-request';
import { CoreEnumUtils, LearningModeEnum, ScheduleStatusEnum, UserQuizProgressEnum } from '@/utils/enum/core-enum';
import { DisplayTypeEnum, StatusEnum } from '@/utils/enum/path-enum';
import { Button, Card, InputAdornment, OutlinedInput, Stack } from '@mui/material';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react';

import { CustomSelectFilter } from '@/presentation/components/core/drop-down/custom-select-filter';
import { CustomSearchFilter } from '@/presentation/components/core/text-field/custom-search-filter';

export function UserQuizProgressFilters({
  onFilter,
}: {
  onFilter: (filters: GetUserQuizProgressRequest) => void;
}): React.JSX.Element {
  const [searchText, setSearchText] = React.useState('');
  const [isRequired, setIsRequired] = React.useState<boolean | undefined>(undefined);
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
    setIsRequired(undefined);
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
          onChange={(val) => { setStatus(val); }}
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
