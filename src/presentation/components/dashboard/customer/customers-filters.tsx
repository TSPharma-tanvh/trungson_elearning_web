'use client';

import * as React from 'react';
import { Checkbox, FormControl, InputLabel, ListItemText, ListSubheader } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

export function CustomersFilters(): React.JSX.Element {
  const [status, setStatus] = React.useState('');
  const [role, setRole] = React.useState('');

  const [multiCheckValues, setMultiCheckValues] = React.useState<string[]>([]);

  const multiCheckOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    { value: 'option4', label: 'Option 4' },
    { value: 'option5', label: 'Option 5' },
  ];
  return (
    <Card sx={{ p: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
        {/* <OutlinedInput
          defaultValue=""
          fullWidth
          placeholder="Search customer"
          startAdornment={
            <InputAdornment position="start">
              <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
            </InputAdornment>
          }
          sx={{ maxWidth: '300px' }}
        /> */}
        <OutlinedInput
          size="small"
          defaultValue=""
          fullWidth
          placeholder="Search customer"
          startAdornment={
            <InputAdornment position="start">
              <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
            </InputAdornment>
          }
          sx={{ maxWidth: '300px' }}
        />
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          displayEmpty
          size="small"
          defaultValue=""
          fullWidth
          placeholder="Search customer"
          startAdornment={
            <InputAdornment position="start">
              <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
            </InputAdornment>
          }
          sx={{ maxWidth: '300px' }}
        >
          <MenuItem value="">
            <Typography color="text.secondary">All Status</Typography>
          </MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </Select>
        <Select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          displayEmpty
          size="small"
          defaultValue=""
          fullWidth
          placeholder="Search customer"
          startAdornment={
            <InputAdornment position="start">
              <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
            </InputAdornment>
          }
          sx={{ maxWidth: '300px' }}
        >
          <MenuItem value="">
            <Typography color="text.secondary">All Roles</Typography>
          </MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="user">User</MenuItem>
        </Select>
        <FormControl sx={{ m: 1, minWidth: 120, maxWidth: '300px' }} size="small" fullWidth>
          <InputLabel id="grouped-select-label">Grouping</InputLabel>
          <Select native defaultValue="" id="grouped-native-select" label="Grouping">
            <option aria-label="None" value="" />
            <optgroup label="Category 1">
              <option value={1}>Option 1</option>
              <option value={2}>Option 2</option>
            </optgroup>
            <optgroup label="Category 2">
              <option value={3}>Option 3</option>
              <option value={4}>Option 4</option>
            </optgroup>
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 120, maxWidth: '300px' }} size="small" fullWidth>
          <InputLabel id="grouped-select-label">Grouping</InputLabel>
          <Select labelId="grouped-select-label" defaultValue="" id="grouped-select" label="Grouping">
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <ListSubheader>Category 1</ListSubheader>
            <MenuItem value={1}>Option 1</MenuItem>
            <MenuItem value={2}>Option 2</MenuItem>
            <ListSubheader>Category 2</ListSubheader>
            <MenuItem value={3}>Option 3</MenuItem>
            <MenuItem value={4}>Option 4</MenuItem>
          </Select>
        </FormControl>

        <Select
          multiple
          displayEmpty
          size="small"
          value={multiCheckValues}
          onChange={(e) => {
            const value = e.target.value;
            setMultiCheckValues(typeof value === 'string' ? value.split(',') : (value as string[]));
          }}
          renderValue={(selected) => {
            const selectedArray = Array.isArray(selected) ? selected : [];
            if (selectedArray.length === 0) {
              return <Typography color="text.secondary">Select Options</Typography>;
            }
            return selectedArray.map((val) => multiCheckOptions.find((opt) => opt.value === val)?.label).join(', ');
          }}
          sx={{ minWidth: 180, maxWidth: '300px' }}
          fullWidth
        >
          <MenuItem disabled value="">
            <Typography color="text.secondary">Select Options</Typography>
          </MenuItem>
          {multiCheckOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox checked={multiCheckValues.indexOf(option.value) > -1} />
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
        </Select>

        <Button variant="contained" color="primary" size="small" sx={{ maxWidth: '300px' }} fullWidth>
          Filter
        </Button>
      </Stack>
    </Card>
  );
}
