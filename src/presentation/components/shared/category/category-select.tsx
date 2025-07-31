import React, { useEffect, useState } from 'react';
import { type CategoryDetailResponse } from '@/domain/models/category/response/category-detail-response';
import { type CategoryResponse } from '@/domain/models/category/response/category-response';
import { type CategoryUsecase } from '@/domain/usecases/category/category-usecase';
import { useCategoryLoader } from '@/presentation/hooks/use-category-loader';
import { type CategoryEnum } from '@/utils/enum/core-enum';
import { CategoryOutlined, InfoOutlined } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Pagination,
  Select,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { CustomSearchInput } from '../../core/text-field/custom-search-input';
import CategoryDetailForm from '../../dashboard/management/category/category-detail-form';

interface CategorySelectDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
  categoryUsecase: CategoryUsecase | null;
  categoryEnum: CategoryEnum;
  value?: string;
}

function CategorySelectDialog({
  open,
  onClose,
  onSelect,
  categoryUsecase,
  categoryEnum,
  value,
}: CategorySelectDialogProps) {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [fullScreen, setFullScreen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [viewOpen, setViewOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<CategoryDetailResponse | null>(null);

  const {
    categories,
    loadingCategories,
    listRef,
    loadCategories,
    pageNumber,
    totalPages,
    setSearchText: setLoaderSearchText,
  } = useCategoryLoader({ categoryUsecase, isOpen: open, categoryEnum });

  useEffect(() => {
    if (open) {
      setSelected(value ?? null);
      // loadCategories(1, true);
    }
  }, [open]);

  useEffect(() => {
    setLoaderSearchText(searchText);
  }, [searchText]);

  const handleConfirm = () => {
    if (selected) {
      onSelect(selected);
      onClose();
    }
  };

  const handlePageChange = async (event: React.ChangeEvent<unknown>, newPage: number) => {
    await loadCategories(newPage);
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} fullScreen={fullScreen}>
      <DialogTitle>
        {t('selectCategory')}
        <Box sx={{ position: 'absolute', right: 8, top: 8 }}>
          <IconButton
            onClick={() => {
              setFullScreen(!fullScreen);
            }}
          >
            {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Box px={2} pb={2}>
        <CustomSearchInput value={searchText} onChange={setSearchText} placeholder={t('search')} />

        <List ref={listRef} sx={{ overflow: 'auto', maxHeight: 300 }}>
          {categories.length === 0 && !loadingCategories ? (
            <Typography variant="body2" sx={{ p: 2 }}>
              {t('empty')}
            </Typography>
          ) : (
            categories.map((cat: CategoryDetailResponse) => (
              <ListItem
                button
                key={cat.id}
                selected={selected === cat.id}
                onClick={() => {
                  setSelected(cat.id ?? '');
                }}
              >
                <ListItemText primary={cat.categoryName} />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategory(cat);
                    setViewOpen(true);
                  }}
                  aria-label={t('showDetails')}
                >
                  <InfoOutlined fontSize="small" />
                </IconButton>
              </ListItem>
            ))
          )}
          {loadingCategories ? (
            <Box textAlign="center" py={1}>
              <CircularProgress size={20} />
            </Box>
          ) : null}
        </List>
      </Box>

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
          <Button onClick={onClose}> {t('cancel')}</Button>
          <Button onClick={handleConfirm} variant="contained" disabled={!selected}>
            {t('confirm')}
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
}

export function CategorySelect({
  categoryUsecase,
  value,
  onChange,
  categoryEnum,
  label = 'category',
  disabled = false,
  categories = [],
}: CategorySelectProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryResponse | undefined>(undefined);
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
          toJSON: () => ({
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
    <>
      <FormControl fullWidth disabled={disabled}>
        <InputLabel id="category-select-label">{t(label)}</InputLabel>
        <Select
          labelId="category-select-label"
          value={value || ''}
          onClick={() => {
            setOpen(true);
          }}
          input={
            <OutlinedInput
              label={t(label)}
              startAdornment={
                <InputAdornment position="start">
                  <CategoryOutlined sx={{ mr: 1 }} />
                </InputAdornment>
              }
            />
          }
          renderValue={() => selectedCategory?.categoryName || ''}
          open={false}
          displayEmpty
        >
          <MenuItem value="" disabled>
            {selectedCategory?.categoryName || t('noCategorySelected')}
          </MenuItem>
        </Select>
      </FormControl>

      <CategorySelectDialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        onSelect={(id: string) => {
          onChange(id);
          setOpen(false);
        }}
        categoryUsecase={categoryUsecase}
        categoryEnum={categoryEnum}
        value={value}
      />
    </>
  );
}
