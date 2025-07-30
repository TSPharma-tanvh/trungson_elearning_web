'use client';

import * as React from 'react';
import { GetCategoryRequest } from '@/domain/models/category/request/get-category-request';
import { CategoryEnum, CoreEnumUtils } from '@/utils/enum/core-enum';
import { Button, Card, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomSelectFilter } from '@/presentation/components/core/drop-down/custom-select-filter';
import { CustomSearchFilter } from '@/presentation/components/core/text-field/custom-search-filter';

export function CategoryFilters({ onFilter }: { onFilter: (filters: GetCategoryRequest) => void }): React.JSX.Element {
  const { t } = useTranslation();
  const [searchText, setSearchText] = React.useState('');
  const [categoryValue, setCategoryValue] = React.useState<CategoryEnum | undefined>(undefined);

  const handleFilter = () => {
    const request = new GetCategoryRequest({
      searchText: searchText || undefined,
      category: categoryValue !== undefined ? CategoryEnum[categoryValue] : undefined,
      pageNumber: 1,
      pageSize: 10,
    });

    onFilter(request);
  };

  const handleClear = () => {
    setSearchText('');
    setCategoryValue(undefined);
    onFilter(new GetCategoryRequest({ pageNumber: 1, pageSize: 10 }));
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
        <CustomSearchFilter value={searchText} onChange={setSearchText} placeholder={t('searchCategory')} />

        {/* Status */}
        <CustomSelectFilter<CategoryEnum>
          label={t('category')}
          value={categoryValue}
          onChange={(val) => {
            setCategoryValue(val);
          }}
          options={CoreEnumUtils.getEnumOptions(CategoryEnum)}
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
