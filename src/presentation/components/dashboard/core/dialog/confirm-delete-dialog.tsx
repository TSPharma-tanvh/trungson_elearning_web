'use client';

import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

interface ConfirmDeleteDialogProps {
  open: boolean;
  selectedCount: number;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}

export function ConfirmDeleteDialog({
  open,
  selectedCount,
  onCancel,
  onConfirm,
}: ConfirmDeleteDialogProps): React.JSX.Element {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to deactivate {selectedCount} selected user
          {selectedCount > 1 ? 's' : ''}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Deactivate
        </Button>
      </DialogActions>
    </Dialog>
  );
}
