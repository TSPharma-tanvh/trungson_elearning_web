'use client';

import * as React from 'react';
import { type UserResponse } from '@/domain/models/user/response/user-response';
import { usePopover } from '@/presentation/hooks/use-popover';
import AppStrings from '@/utils/app-strings';
import StoreLocalManager from '@/utils/store-manager';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Bell as BellIcon } from '@phosphor-icons/react/dist/ssr/Bell';
import { CaretLeft as CollapseIcon } from '@phosphor-icons/react/dist/ssr/CaretLeft';
import { CaretRight as ExpandIcon } from '@phosphor-icons/react/dist/ssr/CaretRight';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';

import { logger } from '@/lib/default-logger';

import { MobileNav } from './mobile-nav';
import { UserPopover } from './user-popover';

interface MainNavProps {
  toggleSideNav: () => void;
  isSideNavOpen: boolean;
}

export function MainNav({ toggleSideNav, isSideNavOpen }: MainNavProps): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const userPopover = usePopover<HTMLDivElement>();
  const [user, setUser] = React.useState<UserResponse>();

  React.useEffect(() => {
    const syncUserData = () => {
      const data = StoreLocalManager.getLocalData(AppStrings.USER_DATA);
      if (data) {
        try {
          const parsed = JSON.parse(data) as UserResponse;
          setUser(parsed);
        } catch (error) {
          logger.error('Failed to parse user data:', error);
        }
      }
    };

    syncUserData();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === AppStrings.USER_DATA) {
        syncUserData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => { window.removeEventListener('storage', handleStorageChange); };
  }, []);

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid var(--mui-palette-divider)',
          backgroundColor: 'var(--mui-palette-background-paper)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--MainNav-zIndex)',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', px: 2 }}
        >
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <IconButton
              onClick={() => { setOpenNav(true); }}
              sx={{ display: { lg: 'none' } }}
              aria-label="Open Mobile Navigation"
            >
              <ListIcon />
            </IconButton>
            <Tooltip title={isSideNavOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}>
              <IconButton
                onClick={toggleSideNav}
                sx={{ display: { xs: 'none', lg: 'inline-flex' } }}
                aria-label={isSideNavOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
              >
                {isSideNavOpen ? <CollapseIcon /> : <ExpandIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Search">
              <IconButton aria-label="Search">
                <MagnifyingGlassIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Tooltip title="Contacts">
              <IconButton aria-label="Contacts">
                <UsersIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <Badge badgeContent={4} color="success" variant="dot">
                <IconButton aria-label="Notifications">
                  <BellIcon />
                </IconButton>
              </Badge>
            </Tooltip>
            <Avatar
              key={user?.thumbnail?.resourceUrl}
              onClick={userPopover.handleOpen}
              ref={userPopover.anchorRef}
              src={user?.thumbnail?.resourceUrl}
              sx={{ cursor: 'pointer' }}
            />
          </Stack>
        </Stack>
      </Box>
      <UserPopover anchorEl={userPopover.anchorRef.current} onClose={userPopover.handleClose} open={userPopover.open} />
      <MobileNav onClose={() => { setOpenNav(false); }} open={openNav} />
    </React.Fragment>
  );
}
