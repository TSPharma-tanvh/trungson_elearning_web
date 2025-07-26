'use client';

import * as React from 'react';
import { RegisterRequestModel } from '@/domain/models/user/request/register-request';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { Badge, Lock, Person, Phone, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import CustomSnackBar from '../../../core/snack-bar/custom-snack-bar';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void>;
}

export const AddUserDialog: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const { userUsecase } = useDI();
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = React.useState<RegisterRequestModel>(
    new RegisterRequestModel({
      userName: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
    })
  );

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const handleChange = (field: keyof RegisterRequestModel) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => new RegisterRequestModel({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const response = await userUsecase.registerUser(formData);

      await onSubmit();
      onClose();
    } catch (error) {
      CustomSnackBar.showSnackbar(error instanceof Error ? error.message : 'Failed to register user', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New User</DialogTitle>
      <DialogContent sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Username"
              value={formData.userName}
              onChange={handleChange('userName')}
              fullWidth
              sx={{ mt: 1 }} //avoid hiding label
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              InputLabelProps={{ shrink: true }}
              value={formData.password}
              onChange={handleChange('password')}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => { setShowPassword((prev) => !prev); }} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              InputLabelProps={{ shrink: true }}
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => { setShowConfirmPassword((prev) => !prev); }} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              InputLabelProps={{ shrink: true }}
              value={formData.firstName}
              onChange={handleChange('firstName')}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Badge />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              InputLabelProps={{ shrink: true }}
              value={formData.lastName}
              onChange={handleChange('lastName')}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Badge />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Phone Number"
              InputLabelProps={{ shrink: true }}
              value={formData.phoneNumber}
              onChange={handleChange('phoneNumber')}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
