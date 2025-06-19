import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, TextField, TextFieldProps } from '@mui/material';

interface SearchInputProps extends Omit<TextFieldProps, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

export function CustomSearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  size = 'small',
  ...props
}: SearchInputProps) {
  return (
    <TextField
      fullWidth
      size={size}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: '#757575' }} />
          </InputAdornment>
        ),
        ...props.InputProps,
      }}
      {...props}
    />
  );
}
