'use client';

import React, { useEffect, useState } from 'react';
import { GetCategoryRequest } from '@/domain/models/category/request/get-category-request';
import { type CategoryDetailResponse } from '@/domain/models/category/response/category-detail-response';
import { type CategoryResponse } from '@/domain/models/category/response/category-response';
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
  FormHelperText,
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

interface CategorySelectDialogProps extends Omit<SelectProps<string>, 'value' | 'onChange'> {
  categoryUsecase: CategoryUsecase | null;
  value: string;
  onChange: (value: string) => void;
  categoryEnum: CategoryEnum;
  label?: string;
  disabled?: boolean;
  required?: boolean;
}

export function CategorySelectDialog({
  categoryUsecase,
  value,
  onChange,
  categoryEnum,
  label = 'category',
  disabled = false,
  required = false,
  ...selectProps
}: CategorySelectDialogProps) {
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

  // Handlers
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

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    if (categoryUsecase && !loadingCategories) {
      void loadCategories(newPage, false);
      if (listRef.current) {
        listRef.current.scrollTop = 0;
      }
    }
  };

  // Effects
  useEffect(() => {
    setSearchText(debouncedSearchText);
  }, [debouncedSearchText, setSearchText]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (categoryUsecase && value) {
      const fetchSelectedCategories = async () => {
        try {
          const request = new GetCategoryRequest({
            category: CategoryEnumUtils.getCategoryKeyFromValue(categoryEnum),
            pageNumber: 1,
            pageSize: 10,
          });
          const result = await categoryUsecase.getCategoryList(request);
          const newMap = { ...selectedCategoryMap };
          let updated = false;
          for (const category of result.categories) {
            if (!newMap[category.id ?? '']) {
              newMap[category.id ?? ''] = category;
              updated = true;
            }
          }
          if (updated) {
            setSelectedCategoryMap(newMap);
          }
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'An error has occurred.';
          CustomSnackBar.showSnackbar(message, 'error');
        }
      };
      void fetchSelectedCategories();
    }
  }, [categoryUsecase, value, categoryEnum, selectedCategoryMap]);

  useEffect(() => {
    if (dialogOpen) {
      const newMap = { ...selectedCategoryMap };
      let updated = false;
      for (const category of categories) {
        if (category.id && !newMap[category.id]) {
          newMap[category.id] = category;
          updated = true;
        }
      }
      if (updated) {
        setSelectedCategoryMap(newMap);
      }
    }
  }, [categories, dialogOpen, selectedCategoryMap]);

  return (
    <>
      <FormControl fullWidth disabled={disabled}>
        <InputLabel id="category-select-label">
          {t(label)}
          {required && !value ? <span style={{ color: 'error.main', marginLeft: 4 }}>*</span> : <div />}
        </InputLabel>

        <Select
          labelId="category-select-label"
          value={value}
          input={
            <OutlinedInput
              label={
                <span>
                  {t(label)}
                  {required && !value ? <span style={{ color: 'error.main', marginLeft: 4 }}>*</span> : <div />}
                </span>
              }
              startAdornment={<CategoryOutlined sx={{ mr: 1, color: 'inherit', opacity: 0.7 }} />}
            />
          }
          onClick={handleOpen}
          renderValue={(selected) => selectedCategoryMap[selected]?.categoryName || t('noCategorySelected')}
          open={false}
          {...selectProps}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: required && !value ? 'error.main' : 'inherit',
              },
              '&:hover fieldset': {
                borderColor: required && !value ? 'error.dark' : 'primary.main',
              },
              '&.Mui-focused fieldset': {
                borderColor: required && !value ? 'error.main' : 'primary.main',
              },
            },
            '& .MuiFormLabel-root': {
              color: required && !value ? 'error.main' : 'inherit',
              '&.Mui-focused': { color: required && !value ? 'error.main' : 'primary.main' },
            },
          }}
        />

        {required && !value ? (
          <FormHelperText sx={{ color: 'error.main', mt: 0.5 }}>{t('requiredField')}</FormHelperText>
        ) : null}
      </FormControl>

      <Dialog open={dialogOpen} onClose={handleClose} fullWidth fullScreen={isFull} maxWidth="sm" scroll="paper">
        <DialogTitle sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{t('selectCategory')}</Typography>
            <Box>
              <IconButton
                onClick={() => {
                  setIsFullscreen((prev) => !prev);
                }}
                size="small"
              >
                {isFull ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
              <IconButton onClick={handleClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <CustomSearchInput value={localSearchText} onChange={setLocalSearchText} placeholder={t('search')} />
        </DialogTitle>

        <DialogContent dividers>
          <Box component="ul" ref={listRef} sx={{ overflowY: 'auto', mb: 2, listStyle: 'none', padding: 0 }}>
            {categories.map((category) => (
              <MenuItem
                key={category.id}
                value={category.id}
                selected={localValue === category.id}
                onClick={() => {
                  setLocalValue(category.id ?? '');
                }}
              >
                <Checkbox checked={localValue === category.id} />
                <ListItemText primary={category.categoryName} />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategory(category);
                    setViewOpen(true);
                  }}
                  aria-label={t('showDetails')}
                >
                  <InfoOutlined />
                </IconButton>
              </MenuItem>
            ))}
            {loadingCategories ? (
              <Typography variant="body2" sx={{ p: 2 }}>
                {t('loading')}
              </Typography>
            ) : null}
            {!loadingCategories && categories.length === 0 && (
              <Typography variant="body2" sx={{ p: 2 }}>
                {t('empty')}
              </Typography>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ flexDirection: 'column', gap: 2 }}>
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <Pagination
                count={totalPages}
                page={pageNumber}
                onChange={handlePageChange}
                color="primary"
                size={isSmallScreen ? 'small' : 'medium'}
              />
            </Box>
          )}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={handleClose}>{t('cancel')}</Button>
            <Button onClick={handleSave} variant="contained" disabled={!localValue}>
              {t('save')}
            </Button>
          </Box>
        </DialogActions>

        {selectedCategory ? (
          <CategoryDetailForm
            open={viewOpen}
            categoryId={selectedCategory.id ?? null}
            onClose={() => {
              setViewOpen(false);
            }}
          />
        ) : null}
      </Dialog>
    </>
  );
}

interface CategorySelectProps {
  categoryUsecase: CategoryUsecase | null;
  value: string | undefined;
  onChange: (value: string) => void;
  categoryEnum: CategoryEnum;
  label?: string;
  disabled?: boolean;
  categories?: CategoryResponse[];
  required?: boolean;
}

export function CategorySelect({
  categoryUsecase,
  value,
  onChange,
  categoryEnum,
  label = 'category',
  categories = [],
  required = false,
}: CategorySelectProps) {
  const [open, setOpen] = useState(false);
  const [_selectedCategory, setSelectedCategory] = useState<CategoryResponse | undefined>(undefined);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!value || !categoryUsecase || loaded) return;
      const existsInProvided = categories.find((c) => c.id === value);
      if (existsInProvided) {
        setSelectedCategory(existsInProvided);
        setLoaded(true);
        return;
      }

      try {
        const detail = await categoryUsecase.getCategoryById(value);
        const cat: CategoryResponse = {
          id: detail.id ?? '',
          categoryName: detail.categoryName ?? '',
          toJson: () => ({
            id: detail.id,
            categoryName: detail.categoryName,
          }),
        };
        setSelectedCategory(cat);
      } catch (error) {
        return undefined;
      } finally {
        setLoaded(true);
      }
    };

    void fetchCategory();
  }, [value, categoryUsecase, categories, loaded]);

  return (
    <CategorySelectDialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      onChange={(id: string) => {
        onChange(id);
        setOpen(false);
      }}
      categoryUsecase={categoryUsecase}
      categoryEnum={categoryEnum}
      value={value || ''}
      label={label}
      required={required}
    />
  );
}
