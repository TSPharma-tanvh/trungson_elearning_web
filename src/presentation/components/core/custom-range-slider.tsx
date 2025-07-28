'use client';

import * as React from 'react';
import { FormControl, FormLabel, Slider, type SliderProps } from '@mui/material';

interface CustomRangeSliderProps extends Omit<SliderProps, 'onChange'> {
  label?: string;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export const CustomRangeSlider: React.FC<CustomRangeSliderProps> = ({
  label = '',
  value,
  onChange,
  min = 0,
  max = 20,
  ...rest
}) => {
  return (
    <FormControl
      sx={{
        minWidth: 200,
        height: 40,
        justifyContent: 'center',
      }}
    >
      {label ? (
        <FormLabel
          sx={{
            fontSize: '0.75rem',
            color: 'var(--mui-palette-primary-main)',
            fontWeight: 600,
            mb: 0.5,
          }}
        >
          {label}
        </FormLabel>
      ) : null}

      <Slider
        value={value}
        onChange={(_, newValue) => {
          onChange(newValue as [number, number]);
        }}
        min={min}
        max={max}
        size="small"
        valueLabelDisplay="auto"
        sx={{
          mt: '-6px',
          color: 'var(--mui-palette-primary-main)',
          height: 6,
          '& .MuiSlider-thumb': {
            width: 16,
            height: 16,
            backgroundColor: 'var(--mui-palette-secondary-main)',
            border: '2px solid var(--mui-palette-common-white)',
            '&:hover, &.Mui-focusVisible': {
              boxShadow: '0 0 0 8px rgba(0, 0, 0, 0.1)',
            },
            '&.Mui-active': {
              boxShadow: '0 0 0 10px rgba(0, 0, 0, 0.15)',
            },
          },
          '& .MuiSlider-track': {
            border: 'none',
            height: 6,
          },
          '& .MuiSlider-rail': {
            opacity: 0.3,
            backgroundColor: 'var(--mui-palette-primary-main)',
            height: 6,
          },
          '& .MuiSlider-valueLabel': {
            backgroundColor: 'var(--mui-palette-primary-main)',
            color: 'var(--mui-palette-common-white)',
            fontSize: 12,
            borderRadius: '4px',
            padding: '2px 6px',
          },
        }}
        {...rest}
      />
    </FormControl>
  );
};
