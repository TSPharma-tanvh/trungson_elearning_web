import { useEffect, useState } from 'react';
import { UpdateUserPathProgressRequest } from '@/domain/models/user-path/request/update-user-path-progress-request';
import { type UserPathProgressDetailResponse } from '@/domain/models/user-path/response/user-path-progress-detail-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { DateTimeUtils } from '@/utils/date-time-utils';
import {
  ApproveStatusEnum,
  CategoryEnum,
  CategoryEnumUtils,
  DisplayTypeEnum,
  StatusEnum,
  UserProgressEnum,
} from '@/utils/enum/core-enum';
import { FileResourceEnum } from '@/utils/enum/file-resource-enum';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Article, Calendar, Image as ImageIcon, Note, Tag } from '@phosphor-icons/react';

import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import { CustomDateTimePicker } from '@/presentation/components/core/picker/custom-date-picker';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';
import { CategorySelect } from '@/presentation/components/shared/category/category-select';
import { ClassTeacherSelectDialog } from '@/presentation/components/shared/classes/teacher/teacher-select';
import { PathSelectDialog } from '@/presentation/components/shared/courses/path/path-select';
import { EnrollmentMultiSelect } from '@/presentation/components/shared/enrollment/enrollment-multi-select';
import { EnrollmentSingleSelect } from '@/presentation/components/shared/enrollment/enrollment-single-select';
import { FileResourceSelect } from '@/presentation/components/shared/file/file-resource-select';
import { UserMultiSelectDialog } from '@/presentation/components/user/user-multi-select';
import { UserSelectDialog } from '@/presentation/components/user/user-select';

interface EditUserPathProgressDialogProps {
  open: boolean;
  data: UserPathProgressDetailResponse | null;
  onClose: () => void;
  onSubmit: (data: UpdateUserPathProgressRequest) => void;
}

export function UpdateUserPathProgressFormDialog({
  open,
  data: userPathProgress,
  onClose,
  onSubmit,
}: EditUserPathProgressDialogProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { userUsecase, pathUseCase, enrollUsecase } = useDI();
  const [fullScreen, setFullScreen] = useState(false);
  const [formData, setFormData] = useState<UpdateUserPathProgressRequest>(new UpdateUserPathProgressRequest({}));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [thumbnailSource, setThumbnailSource] = useState<'upload' | 'select'>('select');

  useEffect(() => {
    if (userPathProgress && open) {
      const newFormData = new UpdateUserPathProgressRequest({
        id: userPathProgress.id || undefined,
        userID: userPathProgress.userID || undefined,
        pathID: userPathProgress.pathID || undefined,
        progress: userPathProgress.progress || undefined,
        startDate: userPathProgress.startDate || undefined,
        endDate: userPathProgress.endDate || undefined,
        lastAccess: userPathProgress.lastAccess || undefined,
        status: userPathProgress.status || undefined,
        enrollmentID: userPathProgress.enrollmentID || undefined,
      });
      setFormData(newFormData);
    }
  }, [userPathProgress, open, userUsecase, pathUseCase, enrollUsecase]);

  const handleChange = <K extends keyof UpdateUserPathProgressRequest>(
    field: K,
    value: UpdateUserPathProgressRequest[K]
  ) => {
    setFormData((prev) => new UpdateUserPathProgressRequest({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error updating path:', error);
      CustomSnackBar.showSnackbar('Failed to update path', 'error');
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
    { value: StatusEnum.Enable, label: 'Enable' },
    { value: StatusEnum.Disable, label: 'Disable' },
    { value: StatusEnum.Deleted, label: 'Deleted' },
  ];

  const displayTypeOptions = [
    { value: DisplayTypeEnum.Public, label: 'Public' },
    { value: DisplayTypeEnum.Private, label: 'Private' },
  ];

  if (!userPathProgress) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6" component="div">
          Update UserPathProgress
        </Typography>
        <Box>
          <IconButton onClick={() => { setFullScreen((prev) => !prev); }}>
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
            ID: {userPathProgress?.id}
          </Typography>

          <Grid container spacing={2}>
            {/* <Grid item xs={12}>
              <PathSelectDialog
                pathUsecase={pathUseCase}
                value={formData.pathID ?? ''}
                onChange={(value: string) => handleChange('pathID', value)}
                disabled={false}
              />
            </Grid>

            <Grid item xs={12}>
              <UserSelectDialog
                userUsecase={userUsecase}
                value={formData.userID ?? ''}
                onChange={(value: string) => handleChange('userID', value)}
                disabled={false}
              />
            </Grid> */}

            {/* <Grid item xs={12}>
              <EnrollmentSingleSelect
                enrollmentUsecase={enrollUsecase}
                value={formData.enrollmentID ?? ''}
                onChange={(value: string) => handleChange('enrollmentID', value)}
                disabled={false}
                categoryEnum={CategoryEnum.Path}
              />
            </Grid> */}

            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label="Thời gian bắt đầu"
                value={formData.startDate ? DateTimeUtils.formatISODateToString(formData.startDate) : undefined}
                onChange={(value) => { handleChange('startDate', value); }}
                disabled={false}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomDateTimePicker
                label="Thời gian kết thúc"
                value={formData.endDate ? DateTimeUtils.formatISODateToString(formData.endDate) : undefined}
                onChange={(value) => { handleChange('endDate', value); }}
                disabled={false}
              />
            </Grid>

            <Grid item xs={12}>
              {' '}
              <CustomSelectDropDown<string>
                label="Trạng thái"
                value={formData.status}
                onChange={(val) => { handleChange('status', val); }}
                disabled={false}
                options={[
                  { value: UserProgressEnum[UserProgressEnum.NotStarted], label: 'Chưa bắt đầu' },
                  { value: UserProgressEnum[UserProgressEnum.Ongoing], label: 'Đang làm' },
                  { value: UserProgressEnum[UserProgressEnum.Done], label: 'Hoàn thành' },
                ]}
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
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ width: isMobile ? '100%' : '180px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
