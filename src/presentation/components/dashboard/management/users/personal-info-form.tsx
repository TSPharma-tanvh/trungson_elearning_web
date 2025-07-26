import React from 'react';
import { AccountCircle, Email, Image, Phone } from '@mui/icons-material';
import { Grid, InputAdornment, TextField } from '@mui/material';

export function PersonalInfoForm({ onChange }: { onChange: (field: string, value: any) => void }) {
  return (
    <Grid container spacing={3}>
      {' '}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Full Name"
          fullWidth
          size="small"
          onChange={(e) => { onChange('name', e.target.value); }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Email"
          fullWidth
          size="small"
          onChange={(e) => { onChange('email', e.target.value); }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Phone Number"
          fullWidth
          size="small"
          onChange={(e) => { onChange('phone', e.target.value); }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Phone />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Avatar URL"
          fullWidth
          size="small"
          onChange={(e) => { onChange('avatar', e.target.value); }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Image />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
    </Grid>
  );
}
