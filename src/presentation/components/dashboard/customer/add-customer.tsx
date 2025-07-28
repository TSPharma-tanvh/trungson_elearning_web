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
import { CustomerMetaForm } from './customer-meta-form';
import { PersonalInfoForm } from './personal-info-form';

interface CustomerFormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  // Add all expected fields from all subforms
  [key: string]: unknown;
}

interface AddCustomerDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: unknown) => void;
}

export function AddCustomerDialog({ open, onClose, onSubmit }: AddCustomerDialogProps) {
  const [formData, setFormData] = React.useState<CustomerFormData>({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Customer</DialogTitle>
      <DialogContent>
        <Stack spacing={3} mt={2}>
          <PersonalInfoForm onChange={handleChange} />
          <AddressInfoForm onChange={handleChange} />
          <CustomerMetaForm onChange={handleChange} />
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
