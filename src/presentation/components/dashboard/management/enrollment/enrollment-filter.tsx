'use client';

import * as React from 'react';
import { GetEnrollmentCriteriaRequest } from '@/domain/models/enrollment/request/get-enrollment-criteria-request';
import { CategoryEnum, CoreEnumUtils } from '@/utils/enum/core-enum';
import { StatusEnum } from '@/utils/enum/path-enum';
import { Button, Card, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomSelectFilter } from '@/presentation/components/core/drop-down/custom-select-filter';
import { CustomSearchFilter } from '@/presentation/components/core/text-field/custom-search-filter';

export function EnrollmentFilters({
  onFilter,
}: {
  onFilter: (filters: GetEnrollmentCriteriaRequest) => void;
}): React.JSX.Element {
  const { t } = useTranslation();
  const [searchText, setSearchText] = React.useState('');
  const [status, setStatus] = React.useState<StatusEnum | undefined>(undefined);
  const [targetType, setTargetType] = React.useState<CategoryEnum | undefined>(undefined);
  const [isDefault, setIsDefault] = React.useState<boolean | undefined>(undefined);

  const handleFilter = () => {
    const request = new GetEnrollmentCriteriaRequest({
      searchText: searchText,
      disableStatus: status,
      isDefault: isDefault,
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
    setIsDefault(undefined);
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
        <CustomSearchFilter value={searchText} onChange={setSearchText} placeholder={t('searchEnrollment')} />

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
        <CustomSelectFilter<CategoryEnum>
          label={t('category')}
          value={targetType}
          onChange={(val) => {
            setTargetType(val);
          }}
          options={CoreEnumUtils.getEnumOptions(CategoryEnum)}
        />

        <CustomSelectFilter<boolean>
          label={t('isRequired')}
          value={isDefault}
          onChange={setIsDefault}
          options={[
            { value: true, label: 'required' },
            { value: false, label: 'optional' },
          ]}
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
