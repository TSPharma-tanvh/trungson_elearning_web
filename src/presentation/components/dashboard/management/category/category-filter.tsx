'use client';

import * as React from 'react';
import { GetCategoryRequest } from '@/domain/models/category/request/get-category-request';
import { CategoryEnum } from '@/utils/enum/core-enum';
import { Button, Card, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomSearchFilter } from '@/presentation/components/core/text-field/custom-search-filter';

export function CategoryFilters({ onFilter }: { onFilter: (filters: GetCategoryRequest) => void }): React.JSX.Element {
  const { t } = useTranslation();
  const [searchText, setSearchText] = React.useState('');

  const handleFilter = () => {
    const request = new GetCategoryRequest({
      searchText: searchText || undefined,
      category: CategoryEnum[CategoryEnum.Question],
      pageNumber: 1,
      pageSize: 10,
    });

    onFilter(request);
  };

  const handleClear = () => {
    setSearchText('');
    onFilter(new GetCategoryRequest({ pageNumber: 1, pageSize: 10, category: CategoryEnum[CategoryEnum.Question] }));
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
          placeholder={t('search')}
        />

        {/* Status */}
        {/* <CustomSelectFilter<CategoryFilterEnum>
          label={t('category')}
          value={categoryValue}
          onChange={(val) => {
            setCategoryValue(val);
          }}
          options={CoreEnumUtils.getEnumOptions(CategoryFilterEnum)}
        /> */}

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
