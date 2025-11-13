'use client';

import * as React from 'react';
import { GetFileResourcesRequest } from '@/domain/models/file/resquest/get-file-resource-request';
import { CoreEnumUtils } from '@/utils/enum/core-enum';
import { FileTypeEnum } from '@/utils/enum/file-resource-enum';
import { Button, Card, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomSelectFilter } from '@/presentation/components/core/drop-down/custom-select-filter';
import { CustomSearchFilter } from '@/presentation/components/core/text-field/custom-search-filter';

export function ResourceFilters({
  onFilter,
}: {
  onFilter: (filters: GetFileResourcesRequest) => void;
}): React.JSX.Element {
  const { t } = useTranslation();
  const [searchText, setSearchText] = React.useState('');
  const [resourceValue, setResourceValue] = React.useState<FileTypeEnum | undefined>(undefined);

  const handleFilter = () => {
    const request = new GetFileResourcesRequest({
      searchText: searchText || undefined,
      type: resourceValue !== undefined ? FileTypeEnum[resourceValue] : undefined,
      pageNumber: 1,
      pageSize: 10,
    });

    onFilter(request);
  };

  const handleClear = () => {
    setSearchText('');
    setResourceValue(undefined);
    onFilter(new GetFileResourcesRequest({ pageNumber: 1, pageSize: 10 }));
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
          placeholder={t('searchResource')}
        />

        {/* Status */}
        <CustomSelectFilter<FileTypeEnum>
          label={t('category')}
          value={resourceValue}
          onChange={(val) => {
            setResourceValue(val);
          }}
          options={CoreEnumUtils.getEnumOptions(FileTypeEnum)}
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
