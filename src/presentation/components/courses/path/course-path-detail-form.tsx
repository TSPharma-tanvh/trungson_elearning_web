import React, { useEffect, useState } from 'react';
import { CoursePathResponse } from '@/domain/models/path/response/course-path-response';
import { useDI } from '@/presentation/hooks/useDependencyContainer';
import { DateTimeUtils } from '@/utils/date-time-utils';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
  Avatar,
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';

interface Props {
  open: boolean;
  coursePathId: string | null;
  onClose: () => void;
}

export function CoursePathDetailForm({ open, coursePathId, onClose }: Props) {
  const { pathUseCase } = useDI();
  const [loading, setLoading] = useState(false);
  const [coursePath, setCoursePath] = useState<CoursePathResponse | null>(null);
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    if (open && coursePathId) {
      setLoading(true);
      pathUseCase
        .getPathDetailInfo(coursePathId)
        .then(setCoursePath)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [open, coursePathId]);

  if (!coursePathId) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6">Course Path Details</Typography>
        <Box>
          <IconButton onClick={() => setFullScreen((prev) => !prev)}>
            {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {loading || !coursePath ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {/* Header */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar src={coursePath.thumbnail?.resourceUrl} sx={{ width: 64, height: 64 }}>
                  {coursePath.name?.[0]}
                </Avatar>
                <Typography variant="h6">{coursePath.name}</Typography>
              </Box>
            </Grid>

            {/* Detail fields */}
            <Grid item xs={12} sm={fullScreen ? 3 : 6}>
              <Typography variant="subtitle2" fontWeight={500}>
                ID
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {coursePath.id}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={fullScreen ? 3 : 6}>
              <Typography variant="subtitle2" fontWeight={500}>
                Description
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {coursePath.detail ?? '-'}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={fullScreen ? 3 : 6}>
              <Typography variant="subtitle2" fontWeight={500}>
                Status
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {coursePath.status ?? '-'}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={fullScreen ? 3 : 6}>
              <Typography variant="subtitle2" fontWeight={500}>
                Is Required
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {coursePath.isRequired ? 'Yes' : 'No'}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={fullScreen ? 3 : 6}>
              <Typography variant="subtitle2" fontWeight={500}>
                Start Time
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {DateTimeUtils.formatISODate(coursePath.startTime ?? '')}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={fullScreen ? 3 : 6}>
              <Typography variant="subtitle2" fontWeight={500}>
                End Time
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {DateTimeUtils.formatISODate(coursePath.endTime ?? '')}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={fullScreen ? 3 : 6}>
              <Typography variant="subtitle2" fontWeight={500}>
                Display Type
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {coursePath.displayType ?? '-'}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={fullScreen ? 3 : 6}>
              <Typography variant="subtitle2" fontWeight={500}>
                Category
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {coursePath.category?.categoryName ?? '-'}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={fullScreen ? 3 : 6}>
              <Typography variant="subtitle2" fontWeight={500}>
                Enrollment Criteria Max Capacity
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {coursePath.enrollmentCriteria?.maxCapacity ?? '-'}
              </Typography>
            </Grid>

            {/* Courses in path */}
            {coursePath.courses?.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight={500} mb={1}>
                  Included Courses
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {coursePath.courses.map((course) => (
                    <Typography key={course.id} variant="body2" color="text.secondary">
                      • {course.name}
                    </Typography>
                  ))}
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
}
