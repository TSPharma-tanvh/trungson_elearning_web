'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CaretDown as CaretDownIcon } from '@phosphor-icons/react/dist/ssr/CaretDown';
import { CaretUp as CaretUpIcon } from '@phosphor-icons/react/dist/ssr/CaretUp';
import { useTranslation } from 'react-i18next';

import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';
import { isNavItemActive } from '@/lib/is-nav-item-active';
import { Logo } from '@/presentation/components/core/logo';

import { navItems } from './config';
import { navIcons } from './nav-icons';

interface SideNavProps {
  isOpen: boolean;
}

export function SideNav({ isOpen }: SideNavProps): React.JSX.Element {
  const pathname = usePathname();
  const [expanded, setExpanded] = React.useState<string[]>([]);

  const toggleExpanded = (key: string) => {
    setExpanded((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  React.useEffect(() => {
    const activeParents: string[] = [];

    navItems.forEach((item) => {
      if (item.items) {
        const hasActiveChild = item.items.some((child) =>
          isNavItemActive({
            pathname,
            href: child.href,
          })
        );
        if (hasActiveChild) {
          activeParents.push(item.key);
        }
      }
    });

    setExpanded((prev) => Array.from(new Set([...prev, ...activeParents])));
  }, [pathname]);

  return (
    <Box
      sx={{
        '--SideNav-background': 'var(--mui-palette-primary-dark)',
        '--SideNav-color': 'var(--mui-palette-common-white)',
        '--NavItem-color': 'var(--mui-palette-neutral-300)',
        '--NavItem-hover-background': 'rgba(255, 255, 255, 0.04)',
        '--NavItem-active-background': 'var(--mui-palette-primary-main)',
        '--NavItem-active-color': 'var(--mui-palette-primary-contrastText)',
        '--NavItem-disabled-color': 'var(--mui-palette-neutral-500)',
        '--NavItem-icon-color': 'var(--mui-palette-neutral-400)',
        '--NavItem-icon-active-color': 'var(--mui-palette-primary-contrastText)',
        '--NavItem-icon-disabled-color': 'var(--mui-palette-neutral-600)',
        bgcolor: 'var(--SideNav-background)',
        color: 'var(--SideNav-color)',
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column',
        height: '100%',
        left: isOpen ? 0 : 'calc(var(--SideNav-width) * -1)',
        maxWidth: '100%',
        position: 'fixed',
        top: 0,
        width: 'var(--SideNav-width)',
        zIndex: 'var(--SideNav-zIndex)',
        transition: 'left 0.3s ease-in-out',
      }}
    >
      <Stack spacing={2} sx={{ p: 3, flexShrink: 0 }}>
        <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-flex' }}>
          <Logo color="dark" height={64} width={200} />
        </Box>
      </Stack>
      <Divider sx={{ borderColor: 'var(--mui-palette-common-white)', flexShrink: 0 }} />
      <Box
        component="nav"
        sx={{
          flex: '1 1 auto',
          p: '12px',
          overflowY: 'auto',
          overflowX: 'hidden', // Prevent horizontal scroll
          scrollBehavior: 'smooth', // Smooth scrolling
          // Custom scrollbar styling
          '&::-webkit-scrollbar': {
            width: '0px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'var(--mui-palette-neutral-900)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'var(--mui-palette-neutral-700)',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: 'var(--mui-palette-neutral-600)',
            },
          },
          // Firefox scrollbar styling
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--mui-palette-neutral-700) var(--mui-palette-neutral-900)',
        }}
      >
        {renderNavItems({ pathname, items: navItems, expanded, toggleExpanded })}
      </Box>
    </Box>
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

    const { t } = useTranslation();

    if (subItems) {
      // Parent menu -- parent menu
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
                {t(title ?? '')}
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
                const { key: subKey, ...rest } = subItem;
                return <NavItem key={subKey} pathname={pathname} {...rest} />;
              })}
            </Stack>
          )}
        </Box>
      );
    } else {
      //Child item -- child item
      const { key: itemKey, ...rest } = curr;
      acc.push(<NavItem key={itemKey} pathname={pathname} {...rest} />);
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
  const { t } = useTranslation();
  const active = isNavItemActive({ disabled, external, href, matcher, pathname });
  const IconItem = icon ? navIcons[icon] : null;

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
          cursor: 'pointer',
          display: 'flex',
          flex: '0 0 auto',
          gap: 1,
          p: '6px 16px',
          position: 'relative',
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
          {IconItem ? (
            <IconItem
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
            {t(title ?? '')}
          </Typography>
        </Box>
      </Box>
    </li>
  );
}
