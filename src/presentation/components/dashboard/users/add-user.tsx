import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { AddressInfoForm } from './address-info-form';
import { PersonalInfoForm } from './personal-info-form';
import { UserMetaForm } from './user-meta-form';

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function AddUserDialog({ open, onClose, onSubmit }: AddUserDialogProps) {
  const [formData, setFormData] = React.useState<any>({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add User</DialogTitle>
      <DialogContent>
        <Stack spacing={3} mt={2}>
          <PersonalInfoForm onChange={handleChange} />
          <AddressInfoForm onChange={handleChange} />
          <UserMetaForm onChange={handleChange} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column-reverse' : 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            width: '100%',
            mt: 2,
            ml: 2,
            mr: 2,
            mb: 2,
          }}
        >
          <Button onClick={onClose} variant="outlined" sx={{ width: isMobile ? '100%' : '180px', maxWidth: '100%' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ width: isMobile ? '100%' : '180px', maxWidth: '100%' }}
          >
            Save
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
