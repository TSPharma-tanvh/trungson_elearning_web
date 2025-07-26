'use client';

import * as React from 'react';
import { GetClassTeacherRequest } from '@/domain/models/teacher/request/get-class-teacher-request';
import { ActiveEnum, CoreEnumUtils, LearningModeEnum, ScheduleStatusEnum } from '@/utils/enum/core-enum';
import { DisplayTypeEnum, StatusEnum } from '@/utils/enum/path-enum';
import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react';

export function ClassTeacherFilters({
  onFilter,
}: {
  onFilter: (filters: GetClassTeacherRequest) => void;
}): React.JSX.Element {
  const [searchText, setSearchText] = React.useState('');
  const [isRequired, setIsRequired] = React.useState<boolean | undefined>(undefined);
  const [status, setStatus] = React.useState<string | undefined>(undefined);

  const handleFilter = () => {
    const request = new GetClassTeacherRequest({
      searchText: searchText || undefined,
      status: status !== undefined ? status.toString() : undefined,
      pageNumber: 1,
      pageSize: 10,
    });

    onFilter(request);
  };

  const handleClear = () => {
    setSearchText('');
    setIsRequired(undefined);
    setStatus(undefined);
    onFilter(new GetClassTeacherRequest({ pageNumber: 1, pageSize: 10 }));
  };

  return (
    <Card sx={{ p: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" flexWrap="wrap">
        <OutlinedInput
          size="small"
          value={searchText}
          onChange={(e) => { setSearchText(e.target.value); }}
          fullWidth
          placeholder="Search course"
          startAdornment={
            <InputAdornment position="start">
              <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
            </InputAdornment>
          }
          sx={{ maxWidth: 250 }}
        />

        {/* Status */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={status ?? ''}
            onChange={(e) => { setStatus(e.target.value === '' ? undefined : e.target.value); }}
            label="Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value={ActiveEnum[ActiveEnum.Active]}>Active</MenuItem>
            <MenuItem value={ActiveEnum[ActiveEnum.Inactive]}>Inactive</MenuItem>
          </Select>
        </FormControl>

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
