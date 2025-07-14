'use client';

import * as React from 'react';
import { GetCourseRequest } from '@/domain/models/courses/request/get-course-request';
import { CoreEnumUtils, LearningModeEnum, ScheduleStatusEnum } from '@/utils/enum/core-enum';
import { DisplayTypeEnum, StatusEnum } from '@/utils/enum/path-enum';
import { Button, Card, InputAdornment, OutlinedInput, Stack } from '@mui/material';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react';

import { CustomSelectFilter } from '@/presentation/components/core/drop-down/custom-select-filter';
import { CustomSearchFilter } from '@/presentation/components/core/text-field/custom-search-filter';

export function CourseFilters({ onFilter }: { onFilter: (filters: GetCourseRequest) => void }): React.JSX.Element {
  const [searchText, setSearchText] = React.useState('');
  const [isRequired, setIsRequired] = React.useState<boolean | undefined>(undefined);
  const [status, setStatus] = React.useState<StatusEnum | undefined>(undefined);
  const [displayType, setDisplayType] = React.useState<DisplayTypeEnum | undefined>(undefined);
  const [courseType, setCourseType] = React.useState<LearningModeEnum | undefined>(undefined);
  const [scheduleStatus, setScheduleStatus] = React.useState<ScheduleStatusEnum | undefined>(undefined);

  const handleFilter = () => {
    const request = new GetCourseRequest({
      searchText: searchText || undefined,
      isRequired: isRequired,
      disableStatus: status,
      courseType: courseType,
      displayType: displayType,
      scheduleStatus: scheduleStatus,
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
    onFilter(new GetCourseRequest({ pageNumber: 1, pageSize: 10 }));
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
        <CustomSearchFilter value={searchText} onChange={setSearchText} placeholder="Search course" />

        {/* Is Required */}
        <CustomSelectFilter<boolean>
          label="Is Required"
          value={isRequired}
          onChange={setIsRequired}
          options={[
            { value: true, label: 'Required' },
            { value: false, label: 'Optional' },
          ]}
        />

        {/* Course Type */}
        <CustomSelectFilter<LearningModeEnum>
          label="Type"
          value={courseType}
          onChange={(val) => setCourseType(val)}
          options={CoreEnumUtils.getEnumOptions(LearningModeEnum)}
        />

        {/* Status */}
        <CustomSelectFilter<StatusEnum>
          label="Status"
          value={status}
          onChange={(val) => setStatus(val)}
          options={CoreEnumUtils.getEnumOptions(StatusEnum)}
        />

        {/* Display Type */}
        <CustomSelectFilter<DisplayTypeEnum>
          label="Display Type"
          value={displayType}
          onChange={(val) => setDisplayType(val)}
          options={CoreEnumUtils.getEnumOptions(DisplayTypeEnum)}
        />

        {/* Schedule status */}
        <CustomSelectFilter<ScheduleStatusEnum>
          label="Status"
          value={scheduleStatus}
          onChange={(val) => setScheduleStatus(val)}
          options={CoreEnumUtils.getEnumOptions(ScheduleStatusEnum)}
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
