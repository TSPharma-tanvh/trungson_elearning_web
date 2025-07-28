'use client';

import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

interface ConfirmDeleteDialogProps {
  open: boolean;
  selectedCount: number;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
  loading?: boolean;
}

export function ConfirmDeleteDialog({
  open,
  selectedCount,
  onCancel,
  onConfirm,
  loading = false,
}: ConfirmDeleteDialogProps): React.JSX.Element {
  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="sm">
      <DialogTitle sx={{ p: window.innerWidth < 600 ? 1 : 2 }}>Confirm Delete</DialogTitle>
      <DialogContent sx={{ p: window.innerWidth < 600 ? 1 : 2 }}>
        <DialogContentText>
          Are you sure you want to delete {selectedCount} selected
          {selectedCount > 1 ? ' items' : ' item'}?
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: window.innerWidth < 600 ? 1 : 2 }}>
        <Button onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={loading}>
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
