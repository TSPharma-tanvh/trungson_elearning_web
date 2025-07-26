import React from 'react';
import { Stack, TextField } from '@mui/material';

export function CustomerMetaForm({ onChange }: { onChange: (field: string, value: any) => void }) {
  return (
    <Stack spacing={3}>
      {' '}
      <TextField label="User ID" fullWidth size="small" onChange={(e) => { onChange('id', e.target.value); }} />
      <TextField
        label="Created At"
        type="datetime-local"
        fullWidth
        size="small"
        onChange={(e) => { onChange('createdAt', e.target.value); }}
        InputLabelProps={{ shrink: true }}
      />
    </Stack>
  );
}
