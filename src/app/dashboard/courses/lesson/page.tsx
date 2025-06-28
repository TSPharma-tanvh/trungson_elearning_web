'use client';

import React from 'react';
import { GetLessonRequest } from '@/domain/lessons/request/get-lesson-request';
import { Button, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { Plus } from '@phosphor-icons/react';

import { LessonsFilters } from '@/presentation/components/dashboard/lessons/lessons-filter';

export default function Page(): React.JSX.Element {
  const [filters, setFilters] = React.useState<GetLessonRequest>(new GetLessonRequest({ pageNumber: 1, pageSize: 10 }));
  const [page, setPage] = React.useState(0);

  const handleFilter = (newFilters: GetLessonRequest) => {
    setFilters(newFilters);
    setPage(0);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Lessons</Typography>
        </Stack>
        <Button
          startIcon={<Plus fontSize="var(--icon-fontSize-md)" />}
          variant="contained"
          //   onClick={() => setShowCreateDialog(true)}
        >
          Add
        </Button>
      </Stack>
      <LessonsFilters onFilter={handleFilter} />
    </Stack>
  );
}
