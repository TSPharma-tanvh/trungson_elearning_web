'use client';

import React, { useEffect, useState } from 'react';
import { type EmployeeResponse } from '@/domain/models/employee/response/employee-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { DateTimeUtils } from '@/utils/date-time-utils';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import CustomFieldTypography from '@/presentation/components/core/text-field/custom-typhography';
import ImagePreviewDialog from '@/presentation/components/shared/file/image-preview-dialog';

interface EmployeeDetailProps {
  open: boolean;
  employeeId: string | null;
  onClose: () => void;
}

function EmployeeDetails({
  employee,
  fullScreen,
  onAvatarClick,
}: {
  employee: EmployeeResponse;
  fullScreen: boolean;
  onAvatarClick: () => void;
}) {
  const { t } = useTranslation();
  return (
    <Box sx={{ p: window.innerWidth < 600 ? 1 : 2 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Avatar src={employee.avatar} sx={{ width: 64, height: 64, cursor: 'pointer' }} onClick={onAvatarClick}>
          {employee.name?.[0] ?? '?'}
        </Avatar>

        <Typography variant="h5">{employee.name ?? 'Unnamed Employee'}</Typography>
      </Box>
      <Card sx={{ mb: 2 }}>
        <CardHeader title={t('employeeInformation')} />
        <CardContent>
          <Grid container spacing={2}>
            {Object.entries(employee).map(([key, value], index) => {
              if (value === undefined || value === null) return null;

              let displayValue: string | number | boolean = value as string | number | boolean;

              const dateFields = ['birthDate', 'hireDate', 'birthDay'];
              if (dateFields.includes(key) && typeof value === 'string') {
                displayValue = DateTimeUtils.formatISODateFromString(value);
              }

              if (typeof value === 'boolean') {
                displayValue = value ? t('yes') : t('no');
              }

              return (
                <Grid item xs={12} sm={fullScreen ? 3 : 4} key={index}>
                  <Typography variant="subtitle2" fontWeight={500}>
                    {t(key)}
                  </Typography>
                  <CustomFieldTypography value={displayValue} />
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default function EmployeeDetailForm({ open, employeeId, onClose }: EmployeeDetailProps) {
  const { t } = useTranslation();
  const { employeeUsecase } = useDI();
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState<EmployeeResponse | null>(null);
  const [fullScreen, setFullScreen] = useState(false);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [imageFullscreen, setImageFullscreen] = useState(false);

  useEffect(() => {
    if (open && employeeId && employeeUsecase) {
      setLoading(true);
      employeeUsecase
        .getEmployeeById(employeeId)
        .then(setEmployee)
        .catch(() => {
          setEmployee(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, employeeId, employeeUsecase]);

  if (!employeeId) return null;

  const handleAvatarClick = () => {
    if (employee?.avatar) setImagePreviewOpen(true);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">{t('employeeDetails')}</Typography>
        <Box>
          <IconButton
            onClick={() => {
              setFullScreen((prev) => !prev);
            }}
          >
            {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        {loading || !employee ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <EmployeeDetails employee={employee} fullScreen={fullScreen} onAvatarClick={handleAvatarClick} />
        )}
      </DialogContent>

      <ImagePreviewDialog
        open={imagePreviewOpen}
        onClose={() => {
          setImagePreviewOpen(false);
        }}
        imageUrl={employee?.avatar || ''}
        title={employee?.name || 'Avatar'}
        fullscreen={imageFullscreen}
        onToggleFullscreen={() => {
          setImageFullscreen((prev) => !prev);
        }}
      />
    </Dialog>
  );
}
