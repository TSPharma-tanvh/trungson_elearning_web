'use client';

import * as React from 'react';
import { GetPathRequest } from '@/domain/models/path/request/get-path-request';
import { DisplayTypeEnum, StatusEnum } from '@/utils/enum/path-enum';
import {
  Button,
  Card,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
} from '@mui/material';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react';

export function PathFilters({ onFilter }: { onFilter: (filters: GetPathRequest) => void }): React.JSX.Element {
  const [searchText, setSearchText] = React.useState('');
  const [isRequired, setIsRequired] = React.useState<boolean | undefined>(undefined);
  const [status, setStatus] = React.useState<StatusEnum | undefined>(undefined);
  const [displayType, setDisplayType] = React.useState<DisplayTypeEnum | undefined>(undefined);

  const handleFilter = () => {
    const request = new GetPathRequest({
      searchText: searchText || undefined,
      isRequired,
      status,
      displayType,
      pageNumber: 1,
      pageSize: 10,
    });

    onFilter(request);
  };

  const handleClear = () => {
    setSearchText('');
    setIsRequired(undefined);
    setStatus(undefined);
    setDisplayType(undefined);
    onFilter(new GetPathRequest({ pageNumber: 1, pageSize: 10 }));
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
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" flexWrap="wrap">
        <OutlinedInput
          size="small"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
          fullWidth
          placeholder="Search path"
          startAdornment={
            <InputAdornment position="start">
              <MagnifyingGlassIcon
                fontSize="var(--icon-fontSize-md)"
                style={{ color: 'var(--mui-palette-primary-main)' }}
              />
            </InputAdornment>
          }
          sx={{
            maxWidth: 250,
            input: { color: 'var(--mui-palette-primary-main)' },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--mui-palette-primary-main)' },
          }}
        />

        {/* Is Required */}
        <FormControl
          size="small"
          sx={{ minWidth: 150, '& .MuiInputLabel-root': { color: 'var(--mui-palette-primary-main)' } }}
        >
          <InputLabel>Is Required</InputLabel>
          <Select
            value={isRequired === undefined ? '' : isRequired ? 'true' : 'false'}
            label="Is Required"
            onChange={(e) => {
              const val = e.target.value;
              setIsRequired(val === '' ? undefined : val === 'true');
            }}
            sx={{
              '& .MuiSelect-select': {
                backgroundColor: 'var(--mui-palette-common-white)',
                color: 'var(--mui-palette-primary-main)',
              },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--mui-palette-primary-main)' },
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="true">Required</MenuItem>
            <MenuItem value="false">Optional</MenuItem>
          </Select>
        </FormControl>

        {/* Status */}
        <FormControl
          size="small"
          sx={{ minWidth: 150, '& .MuiInputLabel-root': { color: 'var(--mui-palette-primary-main)' } }}
        >
          <InputLabel>Status</InputLabel>
          <Select
            value={status !== undefined ? status.toString() : ''}
            onChange={(e) => {
              setStatus(e.target.value === '' ? undefined : (Number(e.target.value) as StatusEnum));
            }}
            label="Status"
            sx={{
              '& .MuiSelect-select': {
                backgroundColor: 'var(--mui-palette-common-white)',
                color: 'var(--mui-palette-primary-main)',
              },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--mui-palette-primary-main)' },
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value={StatusEnum.Enable}>Enable</MenuItem>
            <MenuItem value={StatusEnum.Disable}>Disable</MenuItem>
            <MenuItem value={StatusEnum.Deleted}>Deleted</MenuItem>
          </Select>
        </FormControl>

        {/* Display Type */}
        <FormControl
          size="small"
          sx={{ minWidth: 150, '& .MuiInputLabel-root': { color: 'var(--mui-palette-primary-main)' } }}
        >
          <InputLabel>Display Type</InputLabel>
          <Select
            label="Display Type"
            value={displayType !== undefined ? displayType.toString() : ''}
            onChange={(e) => {
              setDisplayType(e.target.value === '' ? undefined : (Number(e.target.value) as DisplayTypeEnum));
            }}
            sx={{
              '& .MuiSelect-select': {
                backgroundColor: 'var(--mui-palette-common-white)',
                color: 'var(--mui-palette-primary-main)',
              },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--mui-palette-primary-main)' },
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value={DisplayTypeEnum.Public}>Public</MenuItem>
            <MenuItem value={DisplayTypeEnum.Private}>Private</MenuItem>
          </Select>
        </FormControl>

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
    </Card>
  );
}
