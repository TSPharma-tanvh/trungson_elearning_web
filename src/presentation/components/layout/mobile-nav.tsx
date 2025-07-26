'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CaretDown as CaretDownIcon } from '@phosphor-icons/react/dist/ssr/CaretDown';
import { CaretUp as CaretUpIcon } from '@phosphor-icons/react/dist/ssr/CaretUp';

import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';
import { isNavItemActive } from '@/lib/is-nav-item-active';
import { Logo } from '@/presentation/components/core/logo';

import { navItems } from './config';
import { navIcons } from './nav-icons';

export interface MobileNavProps {
  onClose?: () => void;
  open?: boolean;
  items?: NavItemConfig[];
}

export function MobileNav({ open, onClose }: MobileNavProps): React.JSX.Element {
  const pathname = usePathname();
  const [expanded, setExpanded] = React.useState<string[]>([]);

  const toggleExpanded = (key: string) => {
    setExpanded((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  return (
    <Drawer
      PaperProps={{
        sx: {
          '--MobileNav-background': 'var(--mui-palette-primary-dark)',
          '--MobileNav-color': 'var(--mui-palette-common-white)',
          '--NavItem-color': 'var(--mui-palette-neutral-300)',
          '--NavItem-hover-background': 'rgba(255, 255, 255, 0.04)',
          '--NavItem-active-background': 'var(--mui-palette-primary-main)',
          '--NavItem-active-color': 'var(--mui-palette-primary-contrastText)',
          '--NavItem-disabled-color': 'var(--mui-palette-neutral-500)',
          '--NavItem-icon-color': 'var(--mui-palette-neutral-400)',
          '--NavItem-icon-active-color': 'var(--mui-palette-primary-contrastText)',
          '--NavItem-icon-disabled-color': 'var(--mui-palette-neutral-600)',
          bgcolor: 'var(--MobileNav-background)',
          color: 'var(--MobileNav-color)',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '100%',
          width: 'var(--MobileNav-width)',
          zIndex: 'var(--MobileNav-zIndex)',
        },
      }}
      onClose={onClose}
      open={open}
    >
      <Stack spacing={2} sx={{ p: 3 }}>
        <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-flex' }}>
          <Logo color="dark" height={64} width={200} />
        </Box>
      </Stack>
      <Divider sx={{ borderColor: 'var(--mui-palette-common-white)' }} />
      <Box component="nav" sx={{ flex: '1 1 auto', p: '12px' }}>
        {renderNavItems({ pathname, items: navItems, expanded, toggleExpanded })}
      </Box>
    </Drawer>
  );
}

function renderNavItems({
  items = [],
  pathname,
  expanded,
  toggleExpanded,
}: {
  items?: NavItemConfig[];
  pathname: string;
  expanded: string[];
  toggleExpanded: (key: string) => void;
}): React.JSX.Element {
  const children = items.reduce((acc: React.ReactNode[], curr: NavItemConfig): React.ReactNode[] => {
    const { key, items: subItems, title, icon } = curr;
    const Icon = icon ? navIcons[icon] : null;

    if (subItems) {
      acc.push(
        <Box key={key} sx={{ mb: 1 }}>
          <Box
            onClick={() => {
              toggleExpanded(key);
            }}
            sx={{
              alignItems: 'center',
              borderRadius: 1,
              color: 'var(--mui-palette-common-white)',
              cursor: 'pointer',
              display: 'flex',
              flex: '0 0 auto',
              gap: 1,
              p: '6px 16px',
              userSelect: 'none',
            }}
          >
            <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flex: '0 0 auto' }}>
              {Icon ? <Icon fill="var(--mui-palette-common-white)" fontSize="var(--icon-fontSize-md)" /> : null}
            </Box>
            <Box sx={{ flex: '1 1 auto' }}>
              <Typography
                component="span"
                sx={{ color: 'inherit', fontSize: '0.875rem', fontWeight: 600, lineHeight: '28px' }}
              >
                {title}
              </Typography>
            </Box>
            {expanded.includes(key) ? (
              <CaretUpIcon fontSize="var(--icon-fontSize-md)" />
            ) : (
              <CaretDownIcon fontSize="var(--icon-fontSize-md)" />
            )}
          </Box>
          {expanded.includes(key) && (
            <Stack component="ul" spacing={0.5} sx={{ listStyle: 'none', m: 0, pl: 4 }}>
              {subItems.map((subItem) => {
                const { key: subItemKey, ...rest } = subItem;
                return <NavItem key={subItemKey} pathname={pathname} {...rest} />;
              })}
            </Stack>
          )}
        </Box>
      );
    } else {
      // Standalone item
      const { key: standaloneKey, ...rest } = curr;
      acc.push(<NavItem key={standaloneKey} pathname={pathname} {...rest} />);
    }

    return acc;
  }, []);

  return (
    <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {children}
    </Stack>
  );
}

interface NavItemProps extends Omit<NavItemConfig, 'items' | 'key'> {
  pathname: string;
}

function NavItem({ disabled, external, href, icon, matcher, pathname, title }: NavItemProps): React.JSX.Element {
  const active = isNavItemActive({ disabled, external, href, matcher, pathname });
  const Icon = icon ? navIcons[icon] : null;

  return (
    <li>
      <Box
        {...(href
          ? {
              component: external ? 'a' : RouterLink,
              href,
              target: external ? '_blank' : undefined,
              rel: external ? 'noreferrer' : undefined,
            }
          : { role: 'button' })}
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          gap: 1,
          p: '6px 16px',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          bgcolor: active ? 'var(--mui-palette-secondary-main)' : 'transparent',
          color: active ? 'var(--mui-palette-common-white)' : 'var(--mui-palette-common-white)',
          ...(disabled && {
            color: 'var(--NavItem-disabled-color)',
            cursor: 'not-allowed',
          }),
        }}
      >
        <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flex: '0 0 auto' }}>
          {Icon ? (
            <Icon
              fill={active ? 'var(--mui-palette-common-white)' : 'var(--mui-palette-common-white)'}
              fontSize="var(--icon-fontSize-md)"
              weight={active ? 'fill' : undefined}
            />
          ) : null}
        </Box>
        <Box sx={{ flex: '1 1 auto' }}>
          <Typography
            component="span"
            sx={{ color: 'inherit', fontSize: '0.875rem', fontWeight: 500, lineHeight: '28px' }}
          >
            {title}
          </Typography>
        </Box>
      </Box>
    </li>
  );
}
