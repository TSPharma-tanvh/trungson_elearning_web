import { useEffect, useState } from 'react';
import { CategoryResponse } from '@/domain/models/category/response/category-response';
import { CategoryUsecase } from '@/domain/usecases/category/category-usecase';
import { useCategoryLoader } from '@/presentation/hooks/use-category-loader';
import { CategoryEnum } from '@/utils/enum/core-enum';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Pagination,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

interface CategorySelectDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
  categoryUsecase: CategoryUsecase | null;
  categoryEnum: CategoryEnum;
  value?: string;
}

// ⛳ CategorySelectDialog.tsx
function CategorySelectDialog({
  open,
  onClose,
  onSelect,
  categoryUsecase,
  categoryEnum,
  value,
}: CategorySelectDialogProps) {
  const [searchText, setSearchText] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [fullScreen, setFullScreen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

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
      loadCategories(1, true);
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
        Select Category
        <Box sx={{ position: 'absolute', right: 8, top: 8 }}>
          <IconButton onClick={() => setFullScreen(!fullScreen)}>
            {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Box px={2} pb={2}>
        <TextField
          fullWidth
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <List ref={listRef} sx={{ overflow: 'auto', maxHeight: 300 }}>
          {categories.length === 0 && !loadingCategories ? (
            <Typography variant="body2" sx={{ p: 2 }}>
              No categories found
            </Typography>
          ) : (
            categories.map((cat: CategoryResponse) => (
              <ListItem button key={cat.id} selected={selected === cat.id} onClick={() => setSelected(cat.id)}>
                <ListItemText primary={cat.categoryName} />
              </ListItem>
            ))
          )}
          {loadingCategories && (
            <Box textAlign="center" py={1}>
              <CircularProgress size={20} />
            </Box>
          )}
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
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm} variant="contained" disabled={!selected}>
            Confirm
          </Button>
        </Box>
      </DialogActions>
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
// ⛳ CategorySelect.tsx
export function CategorySelect({
  categoryUsecase,
  value,
  onChange,
  categoryEnum,
  label = 'Category',
  disabled = false,
  categories = [],
}: CategorySelectProps) {
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
      } catch (e) {
        console.error('Failed to fetch category:', e);
      } finally {
        setLoaded(true);
      }
    };

    fetchCategory();
  }, [value, categoryUsecase, categories, loaded]);

  return (
    <>
      <TextField
        fullWidth
        label={label}
        value={selectedCategory?.categoryName || ''}
        onClick={() => setOpen(true)}
        disabled={disabled}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton edge="end" onClick={() => setOpen(true)} disabled={disabled}></IconButton>
            </InputAdornment>
          ),
        }}
      />

      <CategorySelectDialog
        open={open}
        onClose={() => setOpen(false)}
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
