'use client';

import React from 'react';
import { TravelAllowanceRequest } from '@/domain/models/settings/request/travel-allowance-request';
import { UpdateAppSettingsRequest } from '@/domain/models/settings/request/update-app-setting-request';
import { GetAppSettingsResponse } from '@/domain/models/settings/response/get-app-settings-response';
import { AppSettingKeys } from '@/utils/string/setting-key-strings';
import { Delete, Edit, Info, MoreVert } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  IconButton,
  MenuItem,
  MenuList,
  Popover,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { ConfirmDeleteDialog } from '@/presentation/components/core/dialog/confirm-delete-dialog';

import { UpdateAppSettingDialog } from './update-setting-form';

interface AppSettingsTableProps {
  rows: GetAppSettingsResponse[];
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: (ids: string[]) => Promise<void>;
  onEdit: (data: UpdateAppSettingsRequest) => Promise<void>;
}

export default function AppSettingsTable({
  rows,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onDelete,
  onEdit,
}: AppSettingsTableProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = React.useState<GetAppSettingsResponse | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [idsToDelete, setIdsToDelete] = React.useState<string[]>([]);

  const [editSetting, setEditSetting] = React.useState<GetAppSettingsResponse | null>(null);
  const [editOpen, setEditOpen] = React.useState(false);

  const isSelected = (id: string) => selected.has(id);
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSelected(e.target.checked ? new Set(rows.map((r) => r.id!)) : new Set());
  const handleSelectOne = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleMenuClick = (e: React.MouseEvent<HTMLElement>, row: GetAppSettingsResponse) => {
    setAnchorEl(e.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleOpenDeleteDialog = (ids: string[]) => {
    setIdsToDelete(ids);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    await onDelete(idsToDelete);
    setSelected((prev) => {
      const next = new Set(prev);
      idsToDelete.forEach((id) => next.delete(id));
      return next;
    });
    setDeleteDialogOpen(false);
  };

  const parseMetadata = (row: GetAppSettingsResponse): TravelAllowanceRequest[] | null => {
    if (!row.key?.includes(AppSettingKeys.TravelAllowance) || !row.metadataJson) return null;
    try {
      const obj = JSON.parse(row.metadataJson);
      return [TravelAllowanceRequest.fromJson(obj)];
    } catch (error) {
      console.error('Failed to parse metadataJson', error);
      return null;
    }
  };

  const renderTravelAllowanceSummary = (metadataJson: string) => {
    try {
      const obj = JSON.parse(metadataJson);
      const distanceFrom = obj.DistanceFromKm ?? obj.distanceFromKm;
      const distanceTo = obj.DistanceToKm ?? obj.distanceToKm;
      const amount = obj.AllowanceAmount ?? obj.allowanceAmount;

      return `${distanceFrom} → ${distanceTo} km / ${amount.toLocaleString()}₫`;
    } catch (error) {
      console.error('Invalid metadataJson:', error);
      return 'Invalid data';
    }
  };

  const formatKey = (key: string): string => {
    if (!key) return '';
    const parts = key.split('.');
    const lastPart = parts[parts.length - 1];

    return lastPart.charAt(0).toLowerCase() + lastPart.slice(1);
  };

  return (
    <>
      <Card
        sx={{
          p: '0 0 8px 0',
          backgroundColor: 'var(--mui-palette-common-white)',
          border: '1px solid var(--mui-palette-primary-main)',
          borderRadius: '16px',
        }}
      >
        {selected.size > 0 && (
          <Box
            display="flex"
            justifyContent="flex-end"
            p={2}
            sx={{ backgroundColor: 'var(--mui-palette-primary-main)' }}
          >
            <Button
              sx={{
                backgroundColor: 'var(--mui-palette-secondary-main)',
                color: 'white',
                '&:hover': { backgroundColor: 'var(--mui-palette-secondary-dark)' },
              }}
              variant="outlined"
              onClick={() => handleOpenDeleteDialog(Array.from(selected))}
            >
              {t('deleteSelectedItems')} ({selected.size})
            </Button>
          </Box>
        )}

        <TableContainer>
          <Table>
            <TableHead
              sx={{
                '& .MuiTableCell-head': {
                  backgroundColor: 'var(--mui-palette-primary-main)',
                  color: 'white',
                },
              }}
            >
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.size === rows.length && rows.length > 0}
                    indeterminate={selected.size > 0 && selected.size < rows.length}
                    onChange={handleSelectAll}
                    sx={{ color: 'white' }}
                  />
                </TableCell>
                <TableCell>{t('name')}</TableCell>
                <TableCell>{t('value')}</TableCell>
                <TableCell>{t('category')}</TableCell>
                <TableCell>{t('isDefault')}</TableCell>
                <TableCell>{t('description')}</TableCell>
                <TableCell align="right">{t('actions')}</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row) => {
                const isItemSelected = isSelected(row.id!);
                const travelData = parseMetadata(row);

                return (
                  <React.Fragment key={row.id}>
                    <TableRow hover selected={isItemSelected}>
                      <TableCell padding="checkbox">
                        <Checkbox checked={isItemSelected} onChange={() => handleSelectOne(row.id!)} />
                      </TableCell>
                      <TableCell>{t(formatKey(row.key))}</TableCell>
                      <TableCell>
                        {row.key.includes('TravelAllowance') && row.metadataJson
                          ? renderTravelAllowanceSummary(row.metadataJson)
                          : row.value}
                      </TableCell>
                      <TableCell>{t(row.category?.toLowerCase() ?? '')}</TableCell>
                      <TableCell>{row.isDefault ? t('yes') : t('no')}</TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={(e) => handleMenuClick(e, row)}>
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={count}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          labelRowsPerPage={t('rowsPerPage')}
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${t('of')} ${count}`}
        />
      </Card>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              if (selectedRow) {
                setEditSetting(selectedRow);
                setEditOpen(true);
              }
              handleMenuClose();
            }}
          >
            {t('edit')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (selectedRow?.id) handleOpenDeleteDialog([selectedRow.id]);
              handleMenuClose();
            }}
          >
            {t('delete')}
          </MenuItem>
        </MenuList>
      </Popover>

      {editSetting ? (
        <UpdateAppSettingDialog
          open={editOpen}
          setting={editSetting}
          onClose={() => {
            setEditOpen(false);
          }}
          onSubmit={async (updatedData) => {
            await onEdit(updatedData);
            setEditOpen(false);
          }}
        />
      ) : null}

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        selectedCount={idsToDelete.length}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
