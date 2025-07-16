import { useEffect, useState } from 'react';
import { UpdateClassTeacherRequest } from '@/domain/models/teacher/request/update-class-teacher-request';
import { ClassTeacherResponse } from '@/domain/models/teacher/response/class-teacher-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import { ActiveEnum } from '@/utils/enum/core-enum';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import { Box, useMediaQuery, useTheme } from '@mui/system';
import { Form } from 'react-hook-form';

import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CustomTextField } from '@/presentation/components/core/text-field/custom-textfield';
import { ClassMultiSelectDialog } from '@/presentation/components/shared/classes/class/class-multi-select';
import { CourseMultiSelectDialog } from '@/presentation/components/shared/courses/courses/courses-multi-select';
import { UserSelectDialog } from '@/presentation/components/user/user-select';

interface EditClassTeacherDialogProps {
  open: boolean;
  data: ClassTeacherResponse | null;
  onClose: () => void;
  onSubmit: (data: UpdateClassTeacherRequest) => void;
}

export function UpdateClassTeacherFormDialog({ open, data: teacher, onClose, onSubmit }: EditClassTeacherDialogProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { userUsecase, courseUsecase, classUsecase } = useDI();
  const [detailRows, setDetailRows] = useState(3);

  const [fullScreen, setFullScreen] = useState(false);
  const [formData, setFormData] = useState<UpdateClassTeacherRequest>(new UpdateClassTeacherRequest({}));
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (teacher && open) {
      const newFormData = new UpdateClassTeacherRequest({
        id: teacher?.id,
        userID: teacher?.userID,
        courseID: teacher?.courses !== undefined ? teacher?.courses?.map((course) => course.id).join(',') : undefined,
        classID:
          teacher?.classes !== undefined ? teacher.classes?.map((classData) => classData.id).join(',') : undefined,
        status: teacher?.status,
      });
      setFormData(newFormData);
    }
  }, [teacher, open]);

  const handleChange = <K extends keyof UpdateClassTeacherRequest>(key: K, value: UpdateClassTeacherRequest[K]) => {
    setFormData((prev) => new UpdateClassTeacherRequest({ ...prev, [key]: value }));
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

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6" component="div">
          Update Teacher
        </Typography>
        <Box>
          <IconButton onClick={() => setFullScreen((prev) => !prev)}>
            {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={fullScreen ? (window.innerWidth < 600 ? 0.8 : 2.6) : 4}>
          <Grid item xs={12} mt={1}>
            <UserSelectDialog
              userUsecase={userUsecase}
              value={formData.userID ?? ''}
              onChange={(val) => handleChange('userID', val)}
              disabled={isSubmitting}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomTextField
              label="Mô tả"
              value={formData.description || ''}
              onChange={(val) => handleChange('description', val)}
              multiline
              rows={detailRows}
              disabled={false}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CourseMultiSelectDialog
              courseUsecase={courseUsecase}
              value={formData.courseID ? formData.courseID.split(',').filter((id) => id) : []}
              onChange={(value: string[]) => handleChange('courseID', value.join(','))}
              disabled={isSubmitting}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <ClassMultiSelectDialog
              classUsecase={classUsecase}
              value={formData.classID ? formData.classID.split(',').filter((id) => id) : []}
              onChange={(val) => handleChange('classID', val.join(','))}
              disabled={isSubmitting}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomSelectDropDown<string>
              label="Trạng thái"
              value={formData.status!}
              onChange={(val) => handleChange('status', val)}
              options={[
                { value: ActiveEnum[ActiveEnum.Active], label: 'Kích hoạt' },
                { value: ActiveEnum[ActiveEnum.Inactive], label: 'Tạm khóa' },
              ]}
            />
          </Grid>
        </Grid>
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
