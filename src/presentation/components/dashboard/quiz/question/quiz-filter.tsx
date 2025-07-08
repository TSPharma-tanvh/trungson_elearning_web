'use client';

import * as React from 'react';
import { GetQuizRequest } from '@/domain/models/quiz/request/get-quiz-request';
import { CoreEnumUtils, LearningModeEnum, QuizTypeEnum, ScheduleStatusEnum } from '@/utils/enum/core-enum';
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

export function QuizFilters({ onFilter }: { onFilter: (filters: GetQuizRequest) => void }): React.JSX.Element {
  const [searchText, setSearchText] = React.useState('');
  const [isRequired, setIsRequired] = React.useState<boolean | undefined>(undefined);
  const [status, setStatus] = React.useState<StatusEnum | undefined>(undefined);
  const [displayType, setDisplayType] = React.useState<DisplayTypeEnum | undefined>(undefined);
  const [quizType, setQuizType] = React.useState<QuizTypeEnum | undefined>(undefined);

  const handleFilter = () => {
    const request = new GetQuizRequest({
      searchText: searchText || undefined,
      isRequired: isRequired,
      type: quizType || undefined,
      pageNumber: 1,
      pageSize: 10,
    });

    onFilter(request);
  };

  const handleClear = () => {
    setSearchText('');
    setIsRequired(undefined);
    setStatus(undefined);
    setDisplayType(undefined);
    onFilter(new GetQuizRequest({ pageNumber: 1, pageSize: 10 }));
  };

  return (
    <Card sx={{ p: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" flexWrap="wrap">
        <OutlinedInput
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          fullWidth
          placeholder="Search course"
          startAdornment={
            <InputAdornment position="start">
              <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
            </InputAdornment>
          }
          sx={{ maxWidth: 250 }}
        />

        {/* Is Required */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Is Required</InputLabel>
          <Select
            value={isRequired === undefined ? '' : isRequired ? 'true' : 'false'}
            label="Is Required"
            onChange={(e) => {
              const val = e.target.value;
              setIsRequired(val === '' ? undefined : val === 'true');
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="true">Required</MenuItem>
            <MenuItem value="false">Optional</MenuItem>
          </Select>
        </FormControl>

        {/* Quiz Type */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={quizType !== undefined ? quizType.toString() : ''}
            onChange={(e) => setQuizType(e.target.value === '' ? undefined : (Number(e.target.value) as QuizTypeEnum))}
            label="Type"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value={QuizTypeEnum.LessonQuiz}>LessonQuiz</MenuItem>
            <MenuItem value={QuizTypeEnum.ExamQuiz}>ExamQuiz</MenuItem>
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

        {/* Display Type */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Display Type</InputLabel>
          <Select
            label="Display Type"
            value={displayType !== undefined ? displayType.toString() : ''}
            onChange={(e) =>
              setDisplayType(e.target.value === '' ? undefined : (Number(e.target.value) as DisplayTypeEnum))
            }
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value={DisplayTypeEnum.Public}>Public</MenuItem>
            <MenuItem value={DisplayTypeEnum.Private}>Private</MenuItem>
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
