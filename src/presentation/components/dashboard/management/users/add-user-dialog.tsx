'use client';

import * as React from 'react';
import { RegisterRequestModel } from '@/domain/models/user/request/register-request';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { Lock, Person, Visibility, VisibilityOff } from '@mui/icons-material';
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
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface AddUserProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void>;
}

export const AddUserDialog: React.FC<AddUserProps> = ({ open, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const { userUsecase } = useDI();

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
      await userUsecase.registerUser(formData);

      await onSubmit();
      onClose();
    } catch (error) {
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('addUser')}</DialogTitle>
      <DialogContent sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label={t('username')}
              value={formData.userName}
              onChange={handleChange('userName')}
              fullWidth
              sx={{ mt: 1 }}
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
              label={t('password')}
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
                    <IconButton
                      onClick={() => {
                        setShowPassword((prev) => !prev);
                      }}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label={t('confirmPassword')}
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
                    <IconButton
                      onClick={() => {
                        setShowConfirmPassword((prev) => !prev);
                      }}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={submitting}>
          {t('cancel')}
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={submitting}>
          {submitting ? t('loading') : t('submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
