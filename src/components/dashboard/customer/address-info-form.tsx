import React from 'react';
import { LocationOn } from '@mui/icons-material';
import { InputAdornment, Stack, TextField } from '@mui/material';

export function AddressInfoForm({ onChange }: { onChange: (field: string, value: any) => void }) {
  return (
    <Stack spacing={3}>
      {' '}
      {/* Increased spacing */}
      <TextField
        label="Street"
        fullWidth
        size="small"
        onChange={(e) => onChange('street', e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocationOn />
            </InputAdornment>
          ),
        }}
      />
      <TextField label="City" fullWidth size="small" onChange={(e) => onChange('city', e.target.value)} />
      <TextField label="State" fullWidth size="small" onChange={(e) => onChange('state', e.target.value)} />
      <TextField label="Country" fullWidth size="small" onChange={(e) => onChange('country', e.target.value)} />
    </Stack>
  );
}
