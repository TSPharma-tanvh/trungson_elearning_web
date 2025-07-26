import React from 'react';
import { Checkbox, FormControlLabel, FormGroup, FormLabel, Stack } from '@mui/material';

const categories = ['Retail', 'Wholesale', 'Online', 'Pharmacy', 'Clinic'];

export function CategoryMultiCheckForm({ onChange }: { onChange: (field: string, value: unknown) => void }) {
  const [selected, setSelected] = React.useState<string[]>([]);

  const handleToggle = (category: string) => {
    const newSelected = selected.includes(category) ? selected.filter((c) => c !== category) : [...selected, category];

    setSelected(newSelected);
    onChange('categories', newSelected);
  };

  return (
    <Stack spacing={1}>
      <FormLabel component="legend">Categories</FormLabel>
      <FormGroup row>
        {categories.map((category) => (
          <FormControlLabel
            key={category}
            control={
              <Checkbox
                checked={selected.includes(category)}
                onChange={() => {
                  handleToggle(category);
                }}
              />
            }
            label={category}
          />
        ))}
      </FormGroup>
    </Stack>
  );
}
