'use client';

import React, { useEffect, useState } from 'react';
import { type CategoryDetailResponse } from '@/domain/models/category/response/category-detail-response';
import { type CategoryUsecase } from '@/domain/usecases/category/category-usecase';
import { useCategorySelectDebounce } from '@/presentation/hooks/category/use-category-select-debounce';
import { useCategoryQuestionLoader } from '@/presentation/hooks/use-category-question-loader';
import { type CategoryEnum } from '@/utils/enum/core-enum';
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
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import { CustomSearchInput } from '@/presentation/components/core/text-field/custom-search-input';

import QuestionCategoryDetailForm from '../../dashboard/quiz/category/question-category-detail-form';

interface QuestionCategorySelectDialogProps {
  categoryUsecase: CategoryUsecase | null;
  value: string;
  onChange: (value: string) => void;
  categoryEnum: CategoryEnum;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  selectedCategoryMap: Record<string, CategoryDetailResponse>;
  onCategoryMapUpdate: (map: Record<string, CategoryDetailResponse>) => void;
}

export function CategorySelectDialog({
  categoryUsecase,
  value,
  onChange,
  categoryEnum,
  label = 'category',
  disabled = false,
  required = false,
  selectedCategoryMap,
  onCategoryMapUpdate,
}: QuestionCategorySelectDialogProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localValue, setLocalValue] = useState<string>(value);
  const [localSearchText, setLocalSearchText] = useState('');
  const debouncedSearchText = useCategorySelectDebounce(localSearchText, 300);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryDetailResponse | null>(null);

  const { categories, loadingCategories, pageNumber, totalPages, setSearchText, listRef, loadCategories } =
    useCategoryQuestionLoader({
      categoryUsecase,
      isOpen: dialogOpen,
      categoryEnum,
      searchText: debouncedSearchText,
    });

  const isFull = isSmallScreen || isFullscreen;

  const handleOpen = () => {
    if (!disabled) {
      setDialogOpen(true);
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
    setLocalValue(value);
  };
  const handleSave = () => {
    onChange(localValue);
    setDialogOpen(false);
  };

  const handlePageChange = (_: any, newPage: number) => {
    if (categoryUsecase && !loadingCategories) {
      void loadCategories(newPage, false);
      listRef.current?.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    setSearchText(debouncedSearchText);
  }, [debouncedSearchText, setSearchText]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Cập nhật map khi có danh sách mới
  useEffect(() => {
    if (!dialogOpen) return;
    const newMap = { ...selectedCategoryMap };
    let updated = false;
    for (const cat of categories) {
      if (cat.id && !newMap[cat.id]) {
        newMap[cat.id] = cat;
        updated = true;
      }
    }
    if (updated) onCategoryMapUpdate(newMap);
  }, [categories, dialogOpen]);

  return (
    <>
      <FormControl fullWidth disabled={disabled}>
        <InputLabel id="category-select-label">
          {t(label)}
          {required && !value ? <span style={{ color: 'error.main', marginLeft: 4 }}>*</span> : null}
        </InputLabel>
        <Select
          labelId="category-select-label"
          value={value}
          onClick={handleOpen}
          open={false}
          renderValue={(selected) => selectedCategoryMap[selected]?.categoryName || t('noItemSelected')}
          input={
            <OutlinedInput
              label={
                <span>
                  {t(label)}
                  {required && !value ? <span style={{ color: 'error.main', marginLeft: 4 }}>*</span> : null}
                </span>
              }
              startAdornment={<CategoryOutlined sx={{ mr: 1, opacity: 0.7 }} />}
            />
          }
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: required && !value ? 'error.main' : undefined },
            },
          }}
        />
        {required && !value ? <FormHelperText sx={{ color: 'error.main' }}>{t('requiredField')}</FormHelperText> : null}
      </FormControl>

      <Dialog open={dialogOpen} onClose={handleClose} fullScreen={isFull} maxWidth="sm" fullWidth scroll="paper">
        {' '}
        <DialogTitle sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{t('selectQuestionBank')}</Typography>
            <Box>
              <IconButton
                onClick={() => {
                  setIsFullscreen((prev) => !prev);
                }}
              >
                {isFull ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <CustomSearchInput value={localSearchText} onChange={setLocalSearchText} placeholder={t('search')} />
        </DialogTitle>
        <DialogContent dividers>
          <Box component="ul" ref={listRef} sx={{ listStyle: 'none', p: 0, m: 0 }}>
            {categories.map((category) => (
              <MenuItem
                key={category.id}
                selected={localValue === category.id}
                onClick={() => {
                  setLocalValue(category.id ?? '');
                }}
              >
                <Checkbox checked={localValue === category.id} />
                <ListItemText
                  primary={category.categoryName}
                  secondary={`${t('totalScore')}: ${category.totalScore}`}
                />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategory(category);
                    setViewOpen(true);
                  }}
                >
                  <InfoOutlined />
                </IconButton>
              </MenuItem>
            ))}
            {loadingCategories ? <Typography sx={{ p: 2 }}>{t('loading')}</Typography> : null}
            {!loadingCategories && categories.length === 0 && <Typography sx={{ p: 2 }}>{t('empty')}</Typography>}
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
          <QuestionCategoryDetailForm
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

interface QuestionCategorySelectProps {
  categoryUsecase: CategoryUsecase | null;
  value: string | undefined;
  onChange: (value: string) => void;
  categoryEnum: CategoryEnum;
  label?: string;
  disabled?: boolean;
  required?: boolean;
}

export function QuestionCategorySelect({
  categoryUsecase,
  value,
  onChange,
  categoryEnum,
  label = 'questionBank',
  disabled = false,
  required = false,
}: QuestionCategorySelectProps) {
  const [categoryMap, setCategoryMap] = useState<Record<string, CategoryDetailResponse>>({});

  useEffect(() => {
    if (!value || !categoryUsecase || categoryMap[value]) return;

    const fetchCategory = async () => {
      try {
        const detail = await categoryUsecase.getCategoryById(value);
        if (detail.id) {
          setCategoryMap((prev) => ({
            ...prev,
            [detail.id!]: detail,
          }));
        }
      } catch (err) {
        return null;
      }
    };

    void fetchCategory();
  }, [value, categoryUsecase]);

  return (
    <CategorySelectDialog
      categoryUsecase={categoryUsecase}
      value={value || ''}
      onChange={onChange}
      categoryEnum={categoryEnum}
      label={label}
      disabled={disabled}
      required={required}
      selectedCategoryMap={categoryMap}
      onCategoryMapUpdate={setCategoryMap}
    />
  );
}
