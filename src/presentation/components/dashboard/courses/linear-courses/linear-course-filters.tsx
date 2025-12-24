'use client';

import * as React from 'react';
import { GetCourseRequest } from '@/domain/models/courses/request/get-course-request';
import { CoreEnumUtils, CourseTypeEnum, type LearningModeEnum, type ScheduleStatusEnum } from '@/utils/enum/core-enum';
import { DepartmentFilterType } from '@/utils/enum/employee-enum';
import { StatusEnum, type DisplayTypeEnum } from '@/utils/enum/path-enum';
import { Button, Card, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomEmployeeDistinctFilter } from '@/presentation/components/core/drop-down/custom-employee-distinct-filter';
import { CustomSelectFilter } from '@/presentation/components/core/drop-down/custom-select-filter';
import { CustomSearchFilter } from '@/presentation/components/core/text-field/custom-search-filter';

export function LinearCourseFilters({
  onFilter,
}: {
  onFilter: (filters: GetCourseRequest) => void;
}): React.JSX.Element {
  const { t } = useTranslation();
  const [searchText, setSearchText] = React.useState('');
  const [isRequired, setIsRequired] = React.useState<boolean | undefined>(undefined);
  const [status, setStatus] = React.useState<StatusEnum | undefined>(undefined);
  const [displayType, setDisplayType] = React.useState<DisplayTypeEnum | undefined>(undefined);
  // const [courseType, _setCourseType] = React.useState<LearningModeEnum | undefined>(undefined);
  const [scheduleStatus, _setScheduleStatus] = React.useState<ScheduleStatusEnum | undefined>(undefined);
  const [positionCode, setPositionCode] = React.useState<string | undefined>(undefined);
  const [positionStateCode, setPositionStateCode] = React.useState<string | undefined>(undefined);
  const [departmentTypeCode, setDepartmentTypeCode] = React.useState<string | undefined>(undefined);
  const [isFixedCourse, setIsFixedCourse] = React.useState<boolean | undefined>(undefined);

  const handleFilter = () => {
    const request = new GetCourseRequest({
      searchText: searchText || undefined,
      isRequired,
      disableStatus: status,
      courseType: CourseTypeEnum.Linear,
      displayType,
      scheduleStatus,
      positionCode,
      positionStateCode,
      departmentTypeCode,
      isFixedCourse,
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
    setPositionCode(undefined);
    setPositionStateCode(undefined);
    setDepartmentTypeCode(undefined);
    setIsFixedCourse(undefined);
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
        <CustomSearchFilter
          value={searchText}
          onChange={setSearchText}
          onEnter={() => {
            handleFilter();
          }}
          placeholder={t('searchCourses')}
        />

        {/* Is Required */}
        <CustomSelectFilter<boolean>
          label={t('isRequired')}
          value={isRequired}
          onChange={setIsRequired}
          options={[
            { value: true, label: 'required' },
            { value: false, label: 'optional' },
          ]}
        />

        <CustomSelectFilter<boolean>
          label={t('isFixedCourse')}
          value={isFixedCourse}
          onChange={setIsFixedCourse}
          options={[
            { value: true, label: 'yes' },
            { value: false, label: 'no' },
          ]}
        />

        {/* Course Type */}
        {/* <CustomSelectFilter<LearningModeEnum>
          label={t('type')}
          value={courseType}
          onChange={(val) => {
            setCourseType(val);
          }}
          options={CoreEnumUtils.getEnumOptions(LearningModeEnum)}
        /> */}

        {/* Status */}
        <CustomSelectFilter<StatusEnum>
          label={t('status')}
          value={status}
          onChange={(val) => {
            setStatus(val);
          }}
          options={CoreEnumUtils.getEnumOptions(StatusEnum)}
        />

        {/* Display Type */}
        {/* <CustomSelectFilter<DisplayTypeEnum>
          label={t('displayType')}
          value={displayType}
          onChange={(val) => {
            setDisplayType(val);
          }}
          options={CoreEnumUtils.getEnumOptions(DisplayTypeEnum)}
        /> */}

        {/* Schedule status */}
        {/* <CustomSelectFilter<ScheduleStatusEnum>
          label={t('scheduleStatus')}
          value={scheduleStatus}
          onChange={(val) => {
            setScheduleStatus(val);
          }}
          options={CoreEnumUtils.getEnumOptions(ScheduleStatusEnum)}
        /> */}

        {/* Employee Distinct Filters */}
        <CustomEmployeeDistinctFilter
          label={t('position')}
          type={DepartmentFilterType.Position} // Position
          value={positionCode}
          onChange={setPositionCode}
        />

        <CustomEmployeeDistinctFilter
          label={t('positionState')}
          type={DepartmentFilterType.PositionState} // PositionState
          value={positionStateCode}
          onChange={setPositionStateCode}
        />

        <CustomEmployeeDistinctFilter
          label={t('departmentType')}
          type={DepartmentFilterType.DepartmentType} // Department
          value={departmentTypeCode}
          onChange={setDepartmentTypeCode}
        />

        <Button variant="contained" color="primary" size="small" onClick={handleFilter}>
          {t('filter')}
        </Button>
        <Button variant="outlined" color="secondary" size="small" onClick={handleClear}>
          {t('clear')}
        </Button>
      </Stack>
    </Card>
  );
}
