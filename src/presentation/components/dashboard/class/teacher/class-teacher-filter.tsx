'use client';

import * as React from 'react';
import { GetClassTeacherRequest } from '@/domain/models/teacher/request/get-class-teacher-request';
import { ActiveEnum, CoreEnumUtils } from '@/utils/enum/core-enum';
import { Button, Card, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomSelectFilter } from '@/presentation/components/core/drop-down/custom-select-filter';
import { CustomSearchFilter } from '@/presentation/components/core/text-field/custom-search-filter';

export function ClassTeacherFilters({
  onFilter,
}: {
  onFilter: (filters: GetClassTeacherRequest) => void;
}): React.JSX.Element {
  const { t } = useTranslation();
  const [searchText, setSearchText] = React.useState('');
  const [_isRequired, setIsRequired] = React.useState<boolean | undefined>(undefined);
  const [status, setStatus] = React.useState<ActiveEnum | undefined>(undefined);

  const handleFilter = () => {
    const request = new GetClassTeacherRequest({
      searchText: searchText || undefined,
      status: status !== undefined ? ActiveEnum[status] : undefined,
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
    <Card
      sx={{
        p: 2,
        backgroundColor: 'var(--mui-palette-common-white)',
        color: 'var(--mui-palette-primary-main)',
        border: '1px solid var(--mui-palette-primary-main)',
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" flexWrap="wrap">
        <CustomSearchFilter
          value={searchText}
          onChange={setSearchText}
          onEnter={() => handleFilter()}
          placeholder={t('searchTeacher')}
        />

        {/* Status */}
        <CustomSelectFilter<ActiveEnum>
          label={t('status')}
          value={status}
          onChange={(val: ActiveEnum | undefined) => {
            setStatus(val);
          }}
          options={CoreEnumUtils.getEnumOptions(ActiveEnum)}
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
