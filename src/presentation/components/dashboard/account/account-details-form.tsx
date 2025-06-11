'use client';

import * as React from 'react';
import { UpdateUserInfoRequest } from '@/domain/models/user/request/user-update-request';
import { UserResponse } from '@/domain/models/user/response/user-response';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Unstable_Grid2';

type Props = {
  user: UserResponse;
  formData: UpdateUserInfoRequest;
  onChange: (field: keyof UpdateUserInfoRequest, value: any) => void;
  onSubmit: () => void;
};

export function AccountDetailsForm({ user, formData, onChange, onSubmit }: Props): React.JSX.Element {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <Card>
        <CardHeader subheader="The information can be edited" title="Profile" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel htmlFor="first-name">First name</InputLabel>
                <OutlinedInput
                  id="first-name"
                  label="First name"
                  value={formData.firstName || ''}
                  onChange={(e) => onChange('firstName', e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel htmlFor="last-name">Last name</InputLabel>
                <OutlinedInput
                  id="last-name"
                  label="Last name"
                  value={formData.lastName || ''}
                  onChange={(e) => onChange('lastName', e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel htmlFor="email">Email</InputLabel>
                <OutlinedInput
                  id="email"
                  label="Email"
                  value={formData.email || ''}
                  onChange={(e) => onChange('email', e.target.value)}
                />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" type="submit">
            Save details
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
