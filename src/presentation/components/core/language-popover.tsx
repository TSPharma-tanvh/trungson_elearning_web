import React, { useCallback, useEffect, useState } from 'react';
import AppStrings from '@/utils/app-strings';
import StoreLocalManager from '@/utils/store-manager';
import Box from '@mui/material/Box';
import type { IconButtonProps } from '@mui/material/IconButton';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';
import { useTranslation } from 'react-i18next';

export type LanguagePopoverProps = IconButtonProps & {
  data?: {
    value: string;
    label: string;
    icon: string;
  }[];
};

export function LanguagePopover({ data = [], sx, ...other }: LanguagePopoverProps) {
  const { t, i18n } = useTranslation();

  const [locale, setLocale] = useState<string>(i18n.language);

  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    setLocale(i18n.language);
  }, [i18n.language]);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleChangeLang = useCallback(
    (newLang: string) => {
      setLocale(newLang);
      void i18n.changeLanguage(newLang);
      StoreLocalManager.saveLocalData(AppStrings.LANGUAGE, newLang);
      handleClosePopover();
    },
    [handleClosePopover, i18n]
  );

  const currentLang = data.find((lang) => lang.value === locale);

  const renderFlag = (label?: string, icon?: string) => (
    <Box component="img" alt={label} src={icon} sx={{ width: 26, height: 20, borderRadius: 0.5, objectFit: 'cover' }} />
  );

  return (
    <>
      <IconButton
        onClick={handleOpenPopover}
        sx={{
          width: 40,
          height: 40,
          ...(openPopover && { bgcolor: 'action.selected' }),
          ...sx,
        }}
        {...other}
      >
        {renderFlag(currentLang?.label, currentLang?.icon)}
      </IconButton>

      <Popover
        open={Boolean(openPopover)}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 160,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: {
                bgcolor: 'action.selected',
                fontWeight: 'fontWeightSemiBold',
              },
            },
          }}
        >
          {data?.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === currentLang?.value}
              onClick={() => {
                handleChangeLang(option.value);
              }}
            >
              {renderFlag(option.label, option.icon)}
              {t(option.label)}
            </MenuItem>
          ))}
        </MenuList>
      </Popover>
    </>
  );
}
