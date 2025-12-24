'use client';

import React, { useEffect, useState } from 'react';
import { GetCategoryRequest } from '@/domain/models/category/request/get-category-request';
import { type CategoryDetailResponse } from '@/domain/models/category/response/category-detail-response';
import { type CategoryUsecase } from '@/domain/usecases/category/category-usecase';
import { useCategorySelectDebounce } from '@/presentation/hooks/category/use-category-select-debounce';
import { useCategoryLoader } from '@/presentation/hooks/use-category-loader';
import { CategoryEnumUtils, type CategoryEnum } from '@/utils/enum/core-enum';
import { CategoryOutlined, InfoOutlined } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Pagination,
  Select,
  Typography,
  useMediaQuery,
  type SelectProps,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomSearchInput } from '@/presentation/components/core/text-field/custom-search-input';
import CategoryDetailForm from '@/presentation/components/dashboard/management/category/category-detail-form';

interface CategorySingleFilterProps extends Omit<SelectProps<string>, 'value' | 'onChange'> {
  categoryUsecase: CategoryUsecase | null;
  value: string;
  onChange: (value: string) => void;
  categoryEnum: CategoryEnum;
  label?: string;
  disabled?: boolean;
  maxWidth?: number;
}

export function CategorySingleFilter({
  categoryUsecase,
  value,
  onChange,
  categoryEnum,
  label = 'category',
  disabled = false,
  maxWidth = 220,
  ...selectProps
}: CategorySingleFilterProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localValue, setLocalValue] = useState<string>(value);
  const [localSearchText, setLocalSearchText] = useState('');
  const debouncedSearchText = useCategorySelectDebounce(localSearchText, 300);

  const [selectedCategoryMap, setSelectedCategoryMap] = useState<Record<string, CategoryDetailResponse>>({});
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryDetailResponse | null>(null);

  const { categories, loadingCategories, pageNumber, totalPages, setSearchText, listRef, loadCategories } =
    useCategoryLoader({
      categoryUsecase,
      isOpen: dialogOpen,
      categoryEnum,
      searchText: debouncedSearchText,
    });

  const isFull = isSmallScreen || isFullscreen;

  //  handlers
  const handleOpen = () => {
    if (!disabled) setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setLocalValue(value);
  };

  const handleSave = () => {
    onChange(localValue);
    setDialogOpen(false);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    if (categoryUsecase && !loadingCategories) {
      void loadCategories(page, false);
      listRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  //  effects
  useEffect(() => {
    setSearchText(debouncedSearchText);
  }, [debouncedSearchText, setSearchText]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (!categoryUsecase || !value) return;

    const fetchSelected = async () => {
      try {
        const request = new GetCategoryRequest({
          category: CategoryEnumUtils.getCategoryKeyFromValue(categoryEnum),
          pageNumber: 1,
          pageSize: 10,
        });

        const result = await categoryUsecase.getCategoryList(request);
        const map = { ...selectedCategoryMap };
        let updated = false;

        for (const cat of result.categories) {
          if (cat.id && !map[cat.id]) {
            map[cat.id] = cat;
            updated = true;
          }
        }

        if (updated) setSelectedCategoryMap(map);
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'An error has occurred.';
        CustomSnackBar.showSnackbar(msg, 'error');
      }
    };

    void fetchSelected();
  }, [categoryUsecase, value, categoryEnum]);

  useEffect(() => {
    if (!dialogOpen) return;

    const map = { ...selectedCategoryMap };
    let updated = false;

    for (const cat of categories) {
      if (cat.id && !map[cat.id]) {
        map[cat.id] = cat;
        updated = true;
      }
    }

    if (updated) setSelectedCategoryMap(map);
  }, [categories, dialogOpen]);

  //  render
  return (
    <>
      {/* Selector */}
      <FormControl
        disabled={disabled}
        size="small"
        sx={{
          '& .MuiInputLabel-root': {
            color: 'var(--mui-palette-secondary-main)',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: 'var(--mui-palette-primary-main)',
          },
          '& .MuiInputLabel-shrink': {
            color: 'var(--mui-palette-primary-main)',
          },
          '& .MuiInputLabel-shrink.Mui-focused': {
            color: 'var(--mui-palette-secondary-main)',
          },
          maxWidth,
          width: '100%',
        }}
      >
        <InputLabel id="course-select-label">{t(label)}</InputLabel>
        <Select
          value={value}
          input={
            <OutlinedInput
              label={t(label)}
              startAdornment={
                <CategoryOutlined sx={{ mr: 1, color: 'var(--mui-palette-secondary-main)', opacity: 0.7 }} />
              }
            />
          }
          onClick={handleOpen}
          renderValue={(selected) => selectedCategoryMap[selected]?.categoryName || t('noCategorySelected')}
          open={false}
          sx={{
            '& .MuiSelect-select': {
              backgroundColor: 'var(--mui-palette-common-white)',
              color: 'var(--mui-palette-secondary-main)',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--mui-palette-primary-main)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--mui-palette-secondary-main)',
            },
          }}
          {...selectProps}
        />
      </FormControl>

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={handleClose} fullWidth fullScreen={isFull} maxWidth="sm" scroll="paper">
        <DialogTitle sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">{t('selectCategory')}</Typography>
            <Box>
              <IconButton size="small" onClick={() => setIsFullscreen((p) => !p)}>
                {isFull ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
              <IconButton size="small" onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          <CustomSearchInput value={localSearchText} onChange={setLocalSearchText} placeholder={t('search')} />
        </DialogTitle>

        <DialogContent dividers>
          <Box component="ul" ref={listRef} sx={{ listStyle: 'none', p: 0 }}>
            {categories.map((cat) => (
              <MenuItem key={cat.id} selected={localValue === cat.id} onClick={() => setLocalValue(cat.id ?? '')}>
                <Checkbox checked={localValue === cat.id} />
                <ListItemText primary={cat.categoryName} />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategory(cat);
                    setViewOpen(true);
                  }}
                >
                  <InfoOutlined />
                </IconButton>
              </MenuItem>
            ))}

            {loadingCategories && <Typography sx={{ p: 2 }}>{t('loading')}</Typography>}

            {!loadingCategories && categories.length === 0 && <Typography sx={{ p: 2 }}>{t('empty')}</Typography>}
          </Box>
        </DialogContent>

        <DialogActions sx={{ flexDirection: 'column', gap: 2 }}>
          {totalPages > 1 && <Pagination count={totalPages} page={pageNumber} onChange={handlePageChange} />}

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={handleClose}>{t('cancel')}</Button>
            <Button variant="contained" onClick={handleSave} disabled={!localValue}>
              {t('save')}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {selectedCategory && (
        <CategoryDetailForm
          open={viewOpen}
          categoryId={selectedCategory.id ?? null}
          onClose={() => setViewOpen(false)}
        />
      )}
    </>
  );
}
