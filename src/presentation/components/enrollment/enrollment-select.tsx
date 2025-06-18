import { CategoryResponse } from '@/domain/models/category/response/category-response';
import { EnrollmentCriteriaResponse } from '@/domain/models/criteria/response/enrollment-criteria-response';
import { CategoryUsecase } from '@/domain/usecases/category/category-usecase';
import { EnrollmentUsecase } from '@/domain/usecases/enrollment/enrollment-usecase';
import { useCategoryLoader } from '@/presentation/hooks/use-category-loader';
import { useEnrollmentLoader } from '@/presentation/hooks/use-enrollment-loader';
import { CategoryEnum } from '@/utils/enum/core-enum';
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectProps,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface EnrollmentSelectProps extends Omit<SelectProps, 'value' | 'onChange'> {
  enrollmentUsecase: EnrollmentUsecase | null;
  value: string | undefined;
  onChange: (value: string) => void;
  categoryEnum: CategoryEnum;
  disabled?: boolean;
  label?: string;
}

export function EnrollmentSelect({
  enrollmentUsecase: categoryUsecase,
  value,
  onChange,
  categoryEnum,
  disabled = false,
  label = 'Category',
  ...selectProps
}: EnrollmentSelectProps) {
  const theme = useTheme();
  const { categories, loadingCategories, isSelectOpen, listRef, handleScroll, setIsSelectOpen } = useEnrollmentLoader({
    categoryUsecase,
    isOpen: true,
    categoryEnum,
  });

  return (
    <FormControl fullWidth disabled={disabled}>
      <InputLabel id="category-select-label" shrink>
        {label}
      </InputLabel>
      <Select
        labelId="category-select-label"
        value={value || ''}
        onChange={(e) => onChange(e.target.value as string)}
        open={isSelectOpen}
        onOpen={() => setIsSelectOpen(true)}
        onClose={() => setIsSelectOpen(false)}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) =>
          selected
            ? categories.find((cat: EnrollmentCriteriaResponse) => cat.id === selected)?.name || 'No Category Selected'
            : 'No Category Selected'
        }
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: 300,
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: theme.palette.mode === 'dark' ? '#2D3748' : '#F7FAFC',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: theme.palette.mode === 'dark' ? '#4A5568' : '#CBD5E0',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' ? '#718096' : '#A0AEC0',
                },
              },
              scrollbarWidth: 'thin',
              scrollbarColor: `${theme.palette.mode === 'dark' ? '#4A5568 #2D3748' : '#CBD5E0 #F7FAFC'}`,
            },
          },
          MenuListProps: {
            ref: listRef,
            onScroll: handleScroll,
          },
        }}
        {...selectProps}
      >
        {categories.length === 0 && !loadingCategories ? (
          <MenuItem disabled>No categories available</MenuItem>
        ) : (
          categories.map((category: EnrollmentCriteriaResponse) => (
            <MenuItem key={category.id} value={category.id}>
              <ListItemText primary={category.name} />
            </MenuItem>
          ))
        )}
        {loadingCategories && (
          <Box textAlign="center" py={1}>
            <CircularProgress size={20} />
          </Box>
        )}
      </Select>
    </FormControl>
  );
}
