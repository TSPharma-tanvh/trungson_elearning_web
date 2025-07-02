'use client';

import * as React from 'react';
import { GetClassRequest } from '@/domain/models/class/request/get-class-request';
import { LearningModeEnum, ScheduleStatusEnum, StatusEnum } from '@/utils/enum/core-enum';
import {
  Box,
  Button,
  Card,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react';

export function ClassFilters({ onFilter }: { onFilter: (filters: GetClassRequest) => void }): React.JSX.Element {
  const [searchText, setSearchText] = React.useState('');
  const [className, setClassName] = React.useState('');
  const [classType, setClassType] = React.useState<string | undefined>(undefined);
  const [scheduleStatus, setScheduleStatus] = React.useState<string | undefined>(undefined);

  const handleFilter = () => {
    const request = new GetClassRequest({
      searchText: searchText || undefined,
      className: className || undefined,
      classType: classType !== undefined ? LearningModeEnum[+classType as number] : undefined,
      scheduleStatus: scheduleStatus !== undefined ? ScheduleStatusEnum[+scheduleStatus as number] : undefined,
      pageNumber: 1,
      pageSize: 10,
    });

    onFilter(request);
  };

  const handleClear = () => {
    setSearchText('');
    setClassName('');
    setClassType(undefined);
    setScheduleStatus(undefined);

    onFilter(new GetClassRequest({ pageNumber: 1, pageSize: 10 }));
  };

  return (
    <Card sx={{ p: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" flexWrap="wrap">
        {/* Search Text */}
        <OutlinedInput
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          fullWidth
          placeholder="Search..."
          startAdornment={
            <InputAdornment position="start">
              <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
            </InputAdornment>
          }
          sx={{ maxWidth: 250 }}
        />

        {/* Class Type */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Class Type</InputLabel>
          <Select
            value={classType ?? ''}
            label="Class Type"
            onChange={(e) => setClassType(e.target.value === '' ? undefined : e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value={LearningModeEnum.Online.toString()}>Online</MenuItem>
            <MenuItem value={LearningModeEnum.Offline.toString()}>Offline</MenuItem>
          </Select>
        </FormControl>

        {/* Schedule Status */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Schedule Status</InputLabel>
          <Select
            value={scheduleStatus ?? ''}
            label="Schedule Status"
            onChange={(e) => setScheduleStatus(e.target.value === '' ? undefined : e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value={ScheduleStatusEnum.Schedule.toString()}>Schedule</MenuItem>
            <MenuItem value={ScheduleStatusEnum.Ongoing.toString()}>Ongoing</MenuItem>
            <MenuItem value={ScheduleStatusEnum.Cancelled.toString()}>Cancelled</MenuItem>
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
