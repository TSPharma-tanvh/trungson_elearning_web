'use client';

import * as React from 'react';
import { GetEnrollmentCriteriaRequest } from '@/domain/models/enrollment/request/get-enrollment-criteria-request';
import { CategoryEnum, CoreEnumUtils, LearningModeEnum, ScheduleStatusEnum } from '@/utils/enum/core-enum';
import { DisplayTypeEnum, StatusEnum } from '@/utils/enum/path-enum';
import { Button, Card, InputAdornment, OutlinedInput, Stack } from '@mui/material';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react';

import { CustomSelectFilter } from '@/presentation/components/core/drop-down/custom-select-filter';
import { CustomSearchFilter } from '@/presentation/components/core/text-field/custom-search-filter';

export function EnrollmentFilters({
  onFilter,
}: {
  onFilter: (filters: GetEnrollmentCriteriaRequest) => void;
}): React.JSX.Element {
  const [searchText, setSearchText] = React.useState('');
  const [status, setStatus] = React.useState<StatusEnum | undefined>(undefined);
  const [targetType, setTargetType] = React.useState<CategoryEnum | undefined>(undefined);

  const handleFilter = () => {
    const request = new GetEnrollmentCriteriaRequest({
      searchText: searchText || undefined,
      disableStatus: status,
      targetType,
      pageNumber: 1,
      pageSize: 10,
    });

    onFilter(request);
  };

  const handleClear = () => {
    setSearchText('');
    setStatus(undefined);
    setTargetType(undefined);
    onFilter(new GetEnrollmentCriteriaRequest({ pageNumber: 1, pageSize: 10 }));
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
        <CustomSearchFilter value={searchText} onChange={setSearchText} placeholder="Search enrollment" />

        {/* Status */}
        <CustomSelectFilter<StatusEnum>
          label="Status"
          value={status}
          onChange={(val) => { setStatus(val); }}
          options={CoreEnumUtils.getEnumOptions(StatusEnum)}
        />

        {/* Display Type */}
        <CustomSelectFilter<CategoryEnum>
          label="Display Type"
          value={targetType}
          onChange={(val) => { setTargetType(val); }}
          options={CoreEnumUtils.getEnumOptions(CategoryEnum)}
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
