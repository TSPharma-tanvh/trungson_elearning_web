'use client';

import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ConfirmDeleteDialogProps {
  open: boolean;
  selectedCount: number;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
  loading?: boolean;
  title?: string;
  content?: string;
  deleteTitle?: string;
  cancelTitle?: string;
}

export function ConfirmDeleteDialog({
  open,
  selectedCount,
  onCancel,
  onConfirm,
  loading = false,
  title = 'confirmDelete',
  content = 'confirmDeleteItem',
  deleteTitle = 'delete',
  cancelTitle = 'cancel',
}: ConfirmDeleteDialogProps): React.JSX.Element {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="sm">
      <DialogTitle sx={{ p: window.innerWidth < 600 ? 1 : 2 }}>{t(title)}</DialogTitle>
      <DialogContent sx={{ p: window.innerWidth < 600 ? 1 : 2 }}>
        <DialogContentText>{t(content, { count: selectedCount })}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: window.innerWidth < 600 ? 1 : 2 }}>
        <Button onClick={onCancel} disabled={loading}>
          {t(cancelTitle)}
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={loading}>
          {loading ? t('loading') : t(deleteTitle)}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
