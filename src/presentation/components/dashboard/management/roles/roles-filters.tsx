'use client';

import * as React from 'react';
import { GetRoleRequest } from '@/domain/models/role/request/get-role-request';
import { useDI } from '@/presentation/hooks/useDependencyContainer';
import {
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  FormControl,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

export function RolesFilters({ onFilter }: { onFilter: (filters: GetRoleRequest) => void }): React.JSX.Element {
  const [name, setName] = React.useState('');
  const [roles, setRoles] = React.useState<string[]>([]);

  const roleUsecase = useDI().roleUseCase;

  const listRef = React.useRef<HTMLUListElement | null>(null);

  const handleScroll = (event: React.UIEvent<HTMLUListElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
  };

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
    <Card sx={{ p: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
        <OutlinedInput
          size="small"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          placeholder="Search Name"
          startAdornment={
            <InputAdornment position="start">
              <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
            </InputAdornment>
          }
          sx={{ maxWidth: '300px' }}
        />

        <Stack direction="row" spacing={1}>
          <Button variant="contained" color="primary" size="small" onClick={handleFilter}>
            Filter
          </Button>
          <Button variant="outlined" color="secondary" size="small" onClick={handleClear}>
            Clear
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
