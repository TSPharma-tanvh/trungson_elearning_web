import { useEffect, useState } from 'react';
import { UpdateEnrollmentCriteriaRequest } from '@/domain/models/enrollment/request/update-enrollment-criteria-request';
import { type EnrollmentCriteriaDetailResponse } from '@/domain/models/enrollment/response/enrollment-criteria-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { StatusEnum } from '@/utils/enum/core-enum';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Article, Tag, UsersFour } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';

interface EditEnrollmentDialogProps {
  open: boolean;
  data: EnrollmentCriteriaDetailResponse | null;
  onClose: () => void;
  onSubmit: (data: UpdateEnrollmentCriteriaRequest) => void;
}

export function UpdateEnrollmentFormDialog({ open, data: enrollment, onClose, onSubmit }: EditEnrollmentDialogProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { fileUsecase } = useDI();

  const [fullScreen, setFullScreen] = useState(false);
  const [formData, setFormData] = useState<UpdateEnrollmentCriteriaRequest>(new UpdateEnrollmentCriteriaRequest({}));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldValidations, setFieldValidations] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (enrollment && open) {
      const newFormData = new UpdateEnrollmentCriteriaRequest({
        id: enrollment.id || '',
        name: enrollment.name || '',
        desc: enrollment.desc || undefined,
        enrollmentStatus:
          enrollment.enrollmentStatus !== undefined
            ? StatusEnum[enrollment.enrollmentStatus as keyof typeof StatusEnum]
            : undefined,
        maxCapacity: enrollment.maxCapacity || undefined,
        isDefault: enrollment.isDefault || undefined,
      });
      setFormData(newFormData);
    }
  }, [enrollment, open, fileUsecase]);

  const handleChange = <K extends keyof UpdateEnrollmentCriteriaRequest>(
    field: K,
    value: UpdateEnrollmentCriteriaRequest[K]
  ) => {
    setFormData((prev) => new UpdateEnrollmentCriteriaRequest({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const allValid = Object.values(fieldValidations).every((v) => v);
      if (!allValid) {
        CustomSnackBar.showSnackbar(t('someFieldsAreInvalid'), 'error');
        return;
      }
      onSubmit(formData);
      onClose();
    } catch (error) {
      return undefined;
    } finally {
      setIsSubmitting(false);
    }
  };

  const iconStyle = {
    size: 20,
    weight: 'fill' as const,
    color: '#616161',
  };

  const statusOptions = [
    { value: StatusEnum.Enable, label: 'enable' },
    { value: StatusEnum.Disable, label: 'disable' },
    { value: StatusEnum.Deleted, label: 'deleted' },
  ];

  if (!enrollment) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6" component="div">
          {t('updateEnrollment')}
        </Typography>
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

      <DialogContent>
        <Box mt={1}>
          <Typography variant="body2" mb={2}>
            ID: {enrollment?.id}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomTextField
                label={t('name')}
                value={formData.name}
                onChange={(value) => {
                  handleChange('name', value);
                }}
                disabled={isSubmitting}
                icon={<Tag {...iconStyle} />}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                label={t('description')}
                value={formData.desc}
                onChange={(value) => {
                  handleChange('desc', value);
                }}
                multiline
                rows={3}
                disabled={isSubmitting}
                icon={<Article {...iconStyle} />}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown<boolean>
                label={t('isDefault')}
                value={formData.isDefault ?? false}
                onChange={(val) => handleChange('isDefault', val)}
                disabled={isSubmitting}
                options={[
                  { value: true, label: 'yes' },
                  { value: false, label: 'no' },
                ]}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label={t('maxCapacity')}
                value={formData.maxCapacity?.toString() ?? ''}
                onChange={(value) => {
                  const numericValue = /^\d+$/.test(value) ? Number(value) : undefined;
                  handleChange('maxCapacity', numericValue);
                }}
                disabled={isSubmitting}
                icon={<UsersFour {...iconStyle} />}
                inputMode="numeric"
                onValidationChange={(isValid) => {
                  setFieldValidations((prev) => ({ ...prev, minuteLate: isValid }));
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomSelectDropDown
                label={t('enrollmentStatus')}
                value={formData.enrollmentStatus ?? ''}
                onChange={(value) => {
                  handleChange('enrollmentStatus', value);
                }}
                disabled={isSubmitting}
                options={statusOptions}
              />
            </Grid>
          </Grid>
        </Box>
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
            m: 2,
          }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{ width: isMobile ? '100%' : '180px' }}
            disabled={isSubmitting}
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ width: isMobile ? '100%' : '180px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : t('save')}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
