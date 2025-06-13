import * as React from 'react';
import { useRoleOptions } from '@/presentation/hooks/role/use-role-options';
import { useDI } from '@/presentation/hooks/useDependencyContainer';
import { Box, CircularProgress, MenuItem, Select } from '@mui/material';

export function RoleSelect() {
  const roleUsecase = useDI().roleUseCase;
  const { roleOptions, loadMoreRoles, hasMore, loading } = useRoleOptions(roleUsecase);

  const listRef = React.useRef<HTMLUListElement | null>(null);

  const handleScroll = React.useCallback(() => {
    if (!listRef.current || !hasMore || loading) return;

    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      loadMoreRoles();
    }
  }, [loadMoreRoles, hasMore, loading]);

  return (
    <Select
      fullWidth
      defaultValue=""
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
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
      {loading && (
        <Box textAlign="center" py={1}>
          <CircularProgress size={20} />
        </Box>
      )}
    </Select>
  );
}
