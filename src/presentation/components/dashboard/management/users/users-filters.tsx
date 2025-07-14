'use client';

import * as React from 'react';
import { GetUserRequest } from '@/domain/models/user/request/get-user-request';
import { useRoleOptions } from '@/presentation/hooks/role/use-role-options';
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

export function UsersFilters({ onFilter }: { onFilter: (filters: GetUserRequest) => void }): React.JSX.Element {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [roles, setRoles] = React.useState<string[]>([]);

  const roleUsecase = useDI().roleUseCase;
  const { roleOptions, loadMoreRoles, hasMore, loading } = useRoleOptions(roleUsecase);

  const listRef = React.useRef<HTMLUListElement | null>(null);

  const handleScroll = (event: React.UIEvent<HTMLUListElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore && !loading) {
      loadMoreRoles();
    }
  };

  const handleFilter = () => {
    onFilter(
      new GetUserRequest({
        searchTerm: searchTerm || undefined,
        roles: roles.length > 0 ? roles : undefined,
        pageNumber: 1,
        pageSize: 10,
      })
    );
  };

  const handleClear = () => {
    setSearchTerm('');
    setRoles([]);
    onFilter(
      new GetUserRequest({
        pageNumber: 1,
        pageSize: 10,
      })
    );
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
      {' '}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
        <OutlinedInput
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          placeholder="Search User"
          startAdornment={
            <InputAdornment position="start">
              <MagnifyingGlassIcon
                fontSize="var(--icon-fontSize-md)"
                style={{ color: 'var(--mui-palette-primary-main)' }}
              />{' '}
            </InputAdornment>
          }
          sx={{
            maxWidth: 250,
            input: { color: 'var(--mui-palette-primary-main)' },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--mui-palette-primary-main)' },
          }}
        />

        <FormControl
          sx={{ minWidth: 150, maxWidth: 200, '& .MuiInputLabel-root': { color: 'var(--mui-palette-primary-main)' } }}
          size="small"
          fullWidth
        >
          <InputLabel id="role-select-label">Roles</InputLabel>
          <Select
            multiple
            labelId="role-select-label"
            value={roles}
            onChange={(e) => setRoles(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
            input={<OutlinedInput label="Roles" />}
            renderValue={(selected) =>
              selected.length === 0 ? (
                <Typography color="text.secondary">Select Roles</Typography>
              ) : (
                roleOptions
                  .filter((opt) => selected.includes(opt.value))
                  .map((opt) => opt.label)
                  .join(', ')
              )
            }
            sx={{
              '& .MuiSelect-select': {
                backgroundColor: 'var(--mui-palette-common-white)',
                color: 'var(--mui-palette-primary-main)',
              },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--mui-palette-primary-main)' },
            }}
            MenuProps={{
              PaperProps: {
                style: { maxHeight: 300 },
              },
              MenuListProps: {
                ref: listRef,
                onScroll: handleScroll,
              },
            }}
          >
            {roleOptions.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                style={{ color: 'var(--mui-palette-primary-main)', backgroundColor: 'var(--mui-palette-common-white)' }}
              >
                <Checkbox
                  checked={roles.includes(option.value)}
                  style={{
                    color: 'var(--mui-palette-primary-main)',
                    backgroundColor: 'var(--mui-palette-common-white)',
                  }}
                />
                <ListItemText
                  primary={option.label}
                  style={{
                    color: 'var(--mui-palette-primary-main)',
                  }}
                />
              </MenuItem>
            ))}
            {loading && (
              <Box textAlign="center" py={1}>
                <CircularProgress size={20} />
              </Box>
            )}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleFilter}
          sx={{ backgroundColor: 'var(--mui-palette-primary-main)', color: 'var(--mui-palette-common-white)' }}
        >
          Filter
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={handleClear}
          sx={{
            color: 'var(--mui-palette-secondary-main)',
            borderColor: 'var(--mui-palette-secondary-main)',
            '&:hover': {
              backgroundColor: 'var(--mui-palette-secondary-main)',
              color: 'var(--mui-palette-common-white)',
              borderColor: 'var(--mui-palette-secondary-dark)',
            },
          }}
        >
          Clear
        </Button>
      </Stack>
    </Card>
  );
}
