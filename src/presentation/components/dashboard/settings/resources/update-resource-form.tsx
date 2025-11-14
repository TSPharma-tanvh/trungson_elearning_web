'use client';

import { useEffect, useState } from 'react';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { UpdateFileResourcesRequest } from '@/domain/models/file/request/update-file-resource-request';
import { FileResourceListForAdminResult } from '@/domain/models/file/response/file-resource-for-admin-result';
import { FileResourcesResponseForAdmin } from '@/domain/models/file/response/file-resources-for-admin-response';
import { useDI } from '@/presentation/hooks/use-dependency-container';
import AppStrings from '@/utils/app-strings';
import { CategoryEnum } from '@/utils/enum/core-enum';
import { FileUploadAdminEnum } from '@/utils/enum/file-resource-enum';
import StoreLocalManager from '@/utils/store-manager';
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
  LinearProgress,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Image as ImageIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

import { CustomSelectDropDown } from '@/presentation/components/core/drop-down/custom-select-drop-down';
import CustomSnackBar from '@/presentation/components/core/snack-bar/custom-snack-bar';
import { CategorySelect } from '@/presentation/components/shared/category/category-select';
import { ClassMultiSelectDialog } from '@/presentation/components/shared/classes/class/class-multi-select';
import { ClassSelectDialog } from '@/presentation/components/shared/classes/class/class-select';
import { CourseMultiSelectDialog } from '@/presentation/components/shared/courses/courses/courses-multi-select';
import { CourseSelectDialog } from '@/presentation/components/shared/courses/courses/courses-select';
import { LessonMultiSelectDialog } from '@/presentation/components/shared/courses/lessons/lesson-multi-select';
import { LessonSingleSelectDialog } from '@/presentation/components/shared/courses/lessons/lesson-select';
import { CustomVideoPlayer } from '@/presentation/components/shared/file/custom-video-player';
import ImagePreviewDialog from '@/presentation/components/shared/file/image-preview-dialog';
import VideoPreviewDialog from '@/presentation/components/shared/file/video-preview-dialog';
import { QuestionMultiSelect } from '@/presentation/components/shared/quiz/question/question-multi-select';
import { QuestionSingleSelectDialog } from '@/presentation/components/shared/quiz/question/question-single-select';
import { QuizMultiSelect } from '@/presentation/components/shared/quiz/quiz/quiz-multi-select';
import { QuizSingleSelect } from '@/presentation/components/shared/quiz/quiz/quiz-select';

interface UpdateFileResourcesProps {
  disabled?: boolean;
  data: FileResourcesResponseForAdmin | null;
  onSubmit: (request: UpdateFileResourcesRequest) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

export function UpdateFileResourcesDialog({
  disabled,
  data,
  onSubmit,
  loading,
  open,
  onClose,
}: UpdateFileResourcesProps) {
  //usecase
  const { categoryUsecase, classUsecase, courseUsecase, lessonUsecase, quizUsecase, questionUsecase } = useDI();

  //translate and theme
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [fullScreen, setFullScreen] = useState(false);
  const [detailRows, setDetailRows] = useState(3);

  const userId = StoreLocalManager.getLocalData(AppStrings.USER_ID) ?? '';

  //form
  const [form, setForm] = useState<UpdateFileResourcesRequest>(
    new UpdateFileResourcesRequest({
      categoryEnum: CategoryEnum.Resource,
      userID: userId,
    })
  );

  //value
  const [isSubmitting, setIsSubmitting] = useState(false);

  //resource
  const [filePreviewOpen, setFilePreviewOpen] = useState(false);
  const [filePreviewData, setFilePreviewData] = useState<{
    url: string;
    title?: string;
    type?: string;
  } | null>(null);

  //init
  useEffect(() => {
    if (!open || !data) return;

    const userIdValue = StoreLocalManager.getLocalData(AppStrings.USER_ID) ?? '';

    setForm(
      new UpdateFileResourcesRequest({
        id: data.id,
        name: data.name,
        categoryEnum: CategoryEnum.Resource,
        userID: userIdValue,

        classIDs: data.fileClassRelation?.map((x) => x.classId).join(','),
        courseIDs: data.fileCourseRelation?.map((x) => x.courseId).join(','),
        lessonIDs: data.fileLessonRelation?.map((x) => x.lessonId).join(','),
        quizIDs: data.fileQuizRelation?.map((x) => x.quizId).join(','),
        questionIDs: data.fileQuestionRelation?.map((x) => x.questionId).join(','),
      })
    );
  }, [open, data]);

  //video

  const handleChange = <K extends keyof UpdateFileResourcesRequest>(key: K, value: UpdateFileResourcesRequest[K]) => {
    setForm((prev) => new UpdateFileResourcesRequest({ ...prev, [key]: value }));
  };

  //video

  const handleFilePreview = (url: string, title?: string, type?: string) => {
    setFilePreviewData({ url, title, type });
    setFilePreviewOpen(true);
  };

  const handleSave = async () => {
    setIsSubmitting(true);

    try {
      await onSubmit(form);

      onClose();
    } catch (error) {
      return;
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  //for open and close form
  // useEffect(() => {
  //   if (!open) return;

  //   const userIdValue = StoreLocalManager.getLocalData(AppStrings.USER_ID) ?? '';

  //   setForm(
  //     new UpdateFileResourcesRequest({
  //       categoryEnum: CategoryEnum.Resource,
  //       userID: userIdValue,
  //     })
  //   );
  // }, [open]);

  //for update file review url
  useEffect(() => {
    if (
      filePreviewData?.url &&
      filePreviewOpen &&
      !filePreviewData.type?.includes('image') &&
      !filePreviewData.type?.includes('video')
    ) {
      window.open(filePreviewData.url, '_blank', 'noopener,noreferrer');
      setFilePreviewOpen(false);
      setFilePreviewData(null);
    }
  }, [filePreviewData, filePreviewOpen]);

  //for bigger and smaller screen
  useEffect(() => {
    const updateRows = () => {
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      const aspectRatio = windowWidth / windowHeight;

      let otherElementsHeight = 300;
      if (windowHeight < 600) {
        otherElementsHeight = 250;
      } else if (windowHeight > 1000) {
        otherElementsHeight = 350;
      }

      const rowHeight = aspectRatio > 1.5 ? 22 : 24;
      const availableHeight = windowHeight - otherElementsHeight;
      const calculatedRows = Math.max(3, Math.floor(availableHeight / rowHeight));

      setDetailRows(fullScreen ? calculatedRows : 3);
    };

    updateRows();
    window.addEventListener('resize', updateRows);
    return () => {
      window.removeEventListener('resize', updateRows);
    };
  }, [fullScreen]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}>
        <Typography variant="h6" component="div">
          {t('createFileResource')}
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
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', height: fullScreen ? '100%' : 'auto', p: 2 }}>
        <Grid container spacing={fullScreen ? (window.innerWidth < 600 ? 0.8 : 2.6) : 4}>
          <Grid item xs={12} mt={1}>
            <CategorySelect
              categoryUsecase={categoryUsecase}
              value={form.categoryID}
              onChange={(value) => {
                handleChange('categoryID', value);
              }}
              categoryEnum={CategoryEnum.Resource}
              disabled={false}
            />
          </Grid>

          <Grid item xs={12}>
            <ClassMultiSelectDialog
              classUsecase={classUsecase}
              value={form.classIDs ? form.classIDs.split(',').filter((id) => id) : []}
              onChange={(val) => {
                handleChange('classIDs', val.join(','));
              }}
              disabled={isSubmitting}
            />
          </Grid>

          <Grid item xs={12}>
            <CourseMultiSelectDialog
              courseUsecase={courseUsecase}
              value={form.courseIDs ? form.courseIDs.split(',').filter((id) => id) : []}
              onChange={(value: string[]) => {
                handleChange('courseIDs', value.join(','));
              }}
              disabled={isSubmitting}
            />
          </Grid>

          <Grid item xs={12}>
            <LessonMultiSelectDialog
              lessonUsecase={lessonUsecase}
              value={form.lessonIDs ? form.lessonIDs.split(',').filter((id) => id) : []}
              onChange={(value: string[]) => {
                handleChange('lessonIDs', value.join(','));
              }}
              disabled={isSubmitting}
            />
          </Grid>

          <Grid item xs={12}>
            <QuizMultiSelect
              quizUsecase={quizUsecase}
              value={form.quizIDs ? form.quizIDs.split(',').filter((id) => id) : []}
              onChange={(val) => {
                handleChange('quizIDs', val.join(','));
              }}
              disabled={isSubmitting}
            />
          </Grid>

          <Grid item xs={12}>
            <QuestionMultiSelect
              questionUsecase={questionUsecase}
              value={form.questionIDs ? form.questionIDs.split(',').filter((id) => id) : []}
              onChange={(value: string[]) => {
                handleChange('questionIDs', value.join(','));
              }}
              disabled={isSubmitting}
              required
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
            disabled={isSubmitting || disabled}
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ width: isMobile ? '100%' : '180px' }}
            disabled={isSubmitting || disabled}
          >
            {isSubmitting || disabled ? <CircularProgress size={24} /> : t('save')}
          </Button>
        </Box>
      </DialogActions>

      {filePreviewData?.url ? (
        <>
          {filePreviewData.type?.includes('image') ? (
            <ImagePreviewDialog
              open={filePreviewOpen}
              onClose={() => {
                setFilePreviewOpen(false);
              }}
              imageUrl={filePreviewData.url}
              title={filePreviewData.title}
              fullscreen={fullScreen}
              onToggleFullscreen={() => {
                setFullScreen((prev) => !prev);
              }}
            />
          ) : filePreviewData.type?.includes('video') ? (
            <VideoPreviewDialog
              open={filePreviewOpen}
              onClose={() => {
                setFilePreviewOpen(false);
              }}
              videoUrl={filePreviewData.url}
              title={filePreviewData.title}
              fullscreen={fullScreen}
              onToggleFullscreen={() => {
                setFullScreen((prev) => !prev);
              }}
            />
          ) : null}
        </>
      ) : null}
    </Dialog>
  );
}
