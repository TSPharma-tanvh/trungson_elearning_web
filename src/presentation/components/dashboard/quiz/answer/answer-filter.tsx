'use client';

import * as React from 'react';
import { GetAnswerRequest } from '@/domain/models/answer/request/get-answer-request';
import { CoreEnumUtils, LearningModeEnum, ScheduleStatusEnum } from '@/utils/enum/core-enum';
import { DisplayTypeEnum, StatusEnum } from '@/utils/enum/path-enum';
import { Button, Card, InputAdornment, OutlinedInput, Stack } from '@mui/material';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react';

import { CustomSelectFilter } from '@/presentation/components/core/drop-down/custom-select-filter';
import { CustomSearchFilter } from '@/presentation/components/core/text-field/custom-search-filter';

export function AnswerFilters({ onFilter }: { onFilter: (filters: GetAnswerRequest) => void }): React.JSX.Element {
  const [searchText, setSearchText] = React.useState('');
  const [isCorrect, setIsCorrect] = React.useState<boolean | undefined>(undefined);
  const [status, setStatus] = React.useState<StatusEnum | undefined>(undefined);

  const handleFilter = () => {
    const request = new GetAnswerRequest({
      searchText: searchText || undefined,
      isCorrect,
      status,
      pageNumber: 1,
      pageSize: 10,
    });

    onFilter(request);
  };

  const handleClear = () => {
    setSearchText('');
    setIsCorrect(undefined);
    setStatus(undefined);
    onFilter(new GetAnswerRequest({ pageNumber: 1, pageSize: 10 }));
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
        <CustomSearchFilter value={searchText} onChange={setSearchText} placeholder="Search answers" />

        {/* Is Required */}
        <CustomSelectFilter<boolean>
          label="Is Correct"
          value={isCorrect}
          onChange={setIsCorrect}
          options={[
            { value: true, label: 'Correct' },
            { value: false, label: 'False' },
          ]}
        />

        {/* Status */}
        <CustomSelectFilter<StatusEnum>
          label="Status"
          value={status}
          onChange={(val) => { setStatus(val); }}
          options={CoreEnumUtils.getEnumOptions(StatusEnum)}
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
