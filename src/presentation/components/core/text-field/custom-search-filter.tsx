'use client';

import * as React from 'react';
import { InputAdornment, OutlinedInput, type SxProps, type Theme } from '@mui/material';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react';

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  onEnter?: (val: string) => void;
  placeholder?: string;
  maxWidth?: number | string;
  sx?: SxProps<Theme>;
}

export const CustomSearchFilter: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onEnter,
  placeholder = 'Search...',
  maxWidth = 250,
  sx,
}) => {
  return (
    <OutlinedInput
      size="small"
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (onEnter) {
            onEnter(value);
          } else {
            onChange(value);
          }
        }
      }}
      placeholder={placeholder}
      fullWidth
      startAdornment={
        <InputAdornment position="start">
          <MagnifyingGlassIcon
            fontSize="var(--icon-fontSize-md)"
            style={{ color: 'var(--mui-palette-primary-main)' }}
          />
        </InputAdornment>
      }
      sx={{
        maxWidth,
        input: { color: 'var(--mui-palette-secondary-main)' },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'var(--mui-palette-primary-main)',
        },
        ...sx,
      }}
    />
  );
};
