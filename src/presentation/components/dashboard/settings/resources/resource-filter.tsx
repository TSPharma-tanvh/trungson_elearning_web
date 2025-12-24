'use client';

import * as React from 'react';
import { GetFileResourcesRequest } from '@/domain/models/file/request/get-file-resource-request';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { CategoryEnum, CoreEnumUtils } from '@/utils/enum/core-enum';
import { FileTypeEnum } from '@/utils/enum/file-resource-enum';
import { Button, Card, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomSelectFilter } from '@/presentation/components/core/drop-down/custom-select-filter';
import { CustomSearchFilter } from '@/presentation/components/core/text-field/custom-search-filter';
import { CategorySingleFilter } from '@/presentation/components/shared/category/category-single-filter';

export function ResourceFilters({
  onFilter,
}: {
  onFilter: (filters: GetFileResourcesRequest) => void;
}): React.JSX.Element {
  const { t } = useTranslation();
  const { categoryUsecase } = useDI();
  const [searchText, setSearchText] = React.useState('');
  const [resourceValue, setResourceValue] = React.useState<FileTypeEnum | undefined>(undefined);
  const [categoryId, setCategoryId] = React.useState<string | undefined>(undefined);

  const handleFilter = () => {
    const request = new GetFileResourcesRequest({
      searchText: searchText || undefined,
      type: resourceValue !== undefined ? FileTypeEnum[resourceValue] : undefined,
      categoryID: categoryId,
      pageNumber: 1,
      pageSize: 10,
    });

    onFilter(request);
  };

  const handleClear = () => {
    setSearchText('');
    setResourceValue(undefined);
    setCategoryId(undefined);
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
          label={t('type')}
          value={resourceValue}
          onChange={(val) => {
            setResourceValue(val);
          }}
          options={CoreEnumUtils.getEnumOptions(FileTypeEnum)}
        />

        <CategorySingleFilter
          categoryUsecase={categoryUsecase}
          value={categoryId ?? ''}
          onChange={(value) => {
            setCategoryId(value);
          }}
          disabled={false}
          categoryEnum={CategoryEnum.Resource}
        ></CategorySingleFilter>

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
