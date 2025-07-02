'use client';

import * as React from 'react';
import { GetLessonRequest } from '@/domain/models/lessons/request/get-lesson-request';
import { CoreEnumUtils, LearningModeEnum, ScheduleStatusEnum } from '@/utils/enum/core-enum';
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

export function LessonsFilters({ onFilter }: { onFilter: (filters: GetLessonRequest) => void }): React.JSX.Element {
  const [searchText, setSearchText] = React.useState('');
  const [status, setStatus] = React.useState<StatusEnum | undefined>(undefined);
  const [lessonsType, setLessonsType] = React.useState<LearningModeEnum | undefined>(undefined);

  const handleFilter = () => {
    const request = new GetLessonRequest({
      searchText: searchText || undefined,
      status: status,
      lessonType: lessonsType,
      pageNumber: 1,
      pageSize: 10,
    });

    onFilter(request);

    onFilter(request);
  };

  const handleClear = () => {
    setSearchText('');
    setStatus(undefined);
    onFilter(new GetLessonRequest({ pageNumber: 1, pageSize: 10 }));
  };

  return (
    <Card sx={{ p: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" flexWrap="wrap">
        <OutlinedInput
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          fullWidth
          placeholder="Search lesson"
          startAdornment={
            <InputAdornment position="start">
              <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
            </InputAdornment>
          }
          sx={{ maxWidth: 250 }}
        />

        {/* Lessons Type */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={lessonsType !== undefined ? lessonsType.toString() : ''}
            onChange={(e) =>
              setLessonsType(e.target.value === '' ? undefined : (Number(e.target.value) as LearningModeEnum))
            }
            label="Type"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value={LearningModeEnum.Online}>Online</MenuItem>
            <MenuItem value={LearningModeEnum.Offline}>Offline</MenuItem>
          </Select>
        </FormControl>

        {/* Status */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={status !== undefined ? status.toString() : ''}
            onChange={(e) => setStatus(e.target.value === '' ? undefined : (Number(e.target.value) as StatusEnum))}
            label="Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value={StatusEnum.Enable}>Enable</MenuItem>
            <MenuItem value={StatusEnum.Disable}>Disable</MenuItem>
            <MenuItem value={StatusEnum.Deleted}>Deleted</MenuItem>
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
