'use client';

import React, { useEffect, useState } from 'react';
import { CreateRoleRequest } from '@/domain/models/role/request/create-role-request';
import { PermissionResponse } from '@/domain/models/role/response/permission-reponse';
import { useDI } from '@/presentation/hooks/useDependencyContainer';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
} from '@mui/material';

interface CreateRoleFormProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateRoleForm({ open, onClose, onCreated }: CreateRoleFormProps): JSX.Element {
  const roleUseCase = useDI().roleUseCase;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [allPermissions, setAllPermissions] = useState<PermissionResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setName('');
    setDescription('');
    setSelectedPermissions([]);
  };

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const permissions = await roleUseCase.getAllPermission();
      setAllPermissions(permissions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const req = new CreateRoleRequest({
        name: name.trim(),
        description: description.trim(),
        permissions: selectedPermissions,
        isActive: true,
      });

      await roleUseCase.createRole(req);
      onCreated();
      onClose();
    } catch (err) {
      console.error('Create role error', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <form onSubmit={handleSubmit}>
        <DialogTitle>Create Role</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={2}>
            <TextField required label="Role Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
            />
            <FormControl fullWidth>
              <InputLabel id="permission-select-label">Permissions</InputLabel>
              <Select
                labelId="permission-select-label"
                multiple
                value={selectedPermissions}
                onChange={(e) => setSelectedPermissions(e.target.value as string[])}
                input={<OutlinedInput label="Permissions" />}
                renderValue={(selected) => selected.join(', ')}
              >
                {loading ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} /> Loading permissions...
                  </MenuItem>
                ) : (
                  allPermissions.map((perm) => (
                    <MenuItem key={perm.value} value={perm.value}>
                      <Checkbox checked={selectedPermissions.includes(perm.value)} />
                      <ListItemText
                        primary={perm.name}
                        secondary={`${perm.groupName}${perm.type ? ` - ${perm.type}` : ''}`}
                      />
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              resetForm();
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting || loading || !name || selectedPermissions.length === 0}
          >
            {submitting ? <CircularProgress size={20} /> : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
