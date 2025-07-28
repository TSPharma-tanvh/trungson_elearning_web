'use client';

import * as React from 'react';
import { GetRoleRequest } from '@/domain/models/role/request/get-role-request';
import { Button, Card, InputAdornment, OutlinedInput, Stack } from '@mui/material';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

export function RolesFilters({ onFilter }: { onFilter: (filters: GetRoleRequest) => void }): React.JSX.Element {
  const [name, setName] = React.useState('');
  const [_roles, setRoles] = React.useState<string[]>([]);

  const handleFilter = () => {
    onFilter(
      new GetRoleRequest({
        name: name || undefined,
        pageNumber: 1,
        pageSize: 10,
      })
    );
  };

  const handleClear = () => {
    setName('');
    setRoles([]);
    onFilter(new GetRoleRequest({ pageNumber: 1, pageSize: 10 }));
  };

  return (
    <Card
      sx={{
        p: 2,
        backgroundColor: 'var(--mui-palette-common-white)',
        color: 'var(--mui-palette-primary-main)',
        border: '1px solid var(--mui-palette-primary-main)',
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
        <OutlinedInput
          size="small"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          fullWidth
          placeholder="Search Name"
          startAdornment={
            <InputAdornment position="start">
              <MagnifyingGlassIcon
                fontSize="var(--icon-fontSize-md)"
                style={{ color: 'var(--mui-palette-primary-main)' }}
              />
            </InputAdornment>
          }
          sx={{
            maxWidth: 300,
            input: { color: 'var(--mui-palette-primary-main)' },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--mui-palette-primary-main)' },
          }}
        />

        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            sx={{ backgroundColor: 'var(--mui-palette-primary-main)', color: 'var(--mui-palette-common-white)' }}
            size="small"
            onClick={handleFilter}
          >
            Filter
          </Button>
          <Button
            variant="outlined"
            sx={{
              color: 'var(--mui-palette-secondary-main)',
              borderColor: 'var(--mui-palette-secondary-main)',
              '&:hover': {
                backgroundColor: 'var(--mui-palette-secondary-main)',
                color: 'var(--mui-palette-common-white)',
                borderColor: 'var(--mui-palette-secondary-dark)',
              },
            }}
            size="small"
            onClick={handleClear}
          >
            Clear
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
