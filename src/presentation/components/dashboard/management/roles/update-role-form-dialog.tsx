'use client';

import React, { useEffect, useState, type JSX } from 'react';
import { CreateRoleRequest } from '@/domain/models/role/request/create-role-request';
import { UpdateRoleRequest } from '@/domain/models/role/request/update-role-request';
import { type PermissionResponse } from '@/domain/models/role/response/permission-reponse';
import { type RoleResponse } from '@/domain/models/role/response/role-response'; // Import RoleResponse
import { useDI } from '@/presentation/hooks/use-dependency-container';
import {
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
import { useTranslation } from 'react-i18next';

import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';

interface RoleFormProps {
  open: boolean;
  onClose: () => void;
  onCreatedOrUpdated: () => void;
  role?: RoleResponse;
}

export function RoleForm({ open, onClose, onCreatedOrUpdated, role }: RoleFormProps): JSX.Element {
  const { t } = useTranslation();

  const roleUseCase = useDI().roleUseCase;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [allPermissions, setAllPermissions] = useState<PermissionResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isUpdateMode = Boolean(role);

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
    void fetchPermissions();
  }, []);

  useEffect(() => {
    if (open && role) {
      // Pre-populate form with role data for update
      setName(role.name || '');
      setDescription(role.description || '');
      setSelectedPermissions(role.permissions || []);
    } else {
      resetForm();
    }
  }, [open, role]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isUpdateMode && role?.id) {
        const req = new UpdateRoleRequest({
          name: name.trim(),
          description: description.trim(),
          permissions: selectedPermissions,
          isActive: true,
        });
        await roleUseCase.updateRole(role.id, req);
      } else {
        const req = new CreateRoleRequest({
          name: name.trim(),
          description: description.trim(),
          permissions: selectedPermissions,
          isActive: true,
        });
        await roleUseCase.createRole(req);
      }
      onCreatedOrUpdated();
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error has occurred.';
      CustomSnackBar.showSnackbar(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isUpdateMode ? t('updateRole') : t('createRole')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={2}>
            <TextField
              required
              label={t('roleName')}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              fullWidth
            />
            <TextField
              label={t('description')}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              fullWidth
              multiline
              rows={3}
            />
            <FormControl fullWidth>
              <InputLabel id="permission-select-label">{t('permissions')}</InputLabel>
              <Select
                labelId="permission-select-label"
                multiple
                value={selectedPermissions}
                onChange={(e) => {
                  setSelectedPermissions(e.target.value as string[]);
                }}
                input={<OutlinedInput label="Permissions" />}
                renderValue={(selected) => selected.join(', ')}
              >
                {loading ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} /> {t('permissions')}
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
            {t('cancel')}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting || loading || !name || selectedPermissions.length === 0}
          >
            {submitting ? <CircularProgress size={20} /> : isUpdateMode ? t('update') : t('create')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
