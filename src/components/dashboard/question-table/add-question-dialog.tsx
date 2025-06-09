import { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

type QuestionType = 'single' | 'multiple' | 'text' | 'truefalse';

type Answer = {
  text: string;
  isCorrect: boolean;
};

type Question = {
  id: string;
  question: string;
  type: QuestionType;
  answers: Answer[];
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (question: Question) => void;
  initial?: Question | null;
};

export function AddQuestionDialog({ open, onClose, onSubmit, initial }: Props) {
  const [questionText, setQuestionText] = useState('');
  const [type, setType] = useState<QuestionType>('single');
  const [answers, setAnswers] = useState<Answer[]>([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (initial) {
      setQuestionText(initial.question);
      setType(initial.type);
      setAnswers(initial.answers);
    } else {
      setQuestionText('');
      setType('single');
      setAnswers([]);
    }
  }, [initial]);

  const handleAnswerChange = <K extends keyof Answer>(index: number, key: K, value: Answer[K]) => {
    const newAnswers = [...answers];
    newAnswers[index] = { ...newAnswers[index], [key]: value };
    setAnswers(newAnswers);
  };

  const addAnswer = () => setAnswers([...answers, { text: '', isCorrect: false }]);

  const removeAnswer = (index: number) => {
    const newAnswers = answers.filter((_, i) => i !== index);
    setAnswers(newAnswers);
  };

  const handleTypeChange = (value: QuestionType) => {
    setType(value);
    switch (value) {
      case 'single':
      case 'multiple':
        setAnswers([]);
        break;
      case 'text':
        setAnswers([{ text: '', isCorrect: true }]); // expected text answer
        break;
      case 'truefalse':
        setAnswers([
          { text: 'True', isCorrect: true },
          { text: 'False', isCorrect: false },
        ]);
        break;
    }
  };

  const handleSubmit = () => {
    onSubmit({
      id: initial?.id ?? Date.now().toString(),
      question: questionText,
      type,
      answers,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initial ? 'Edit Question' : 'Add Question'}</DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Question Text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel>Question Type</InputLabel>
            <Select
              value={type}
              label="Question Type"
              onChange={(e) => handleTypeChange(e.target.value as QuestionType)}
            >
              <MenuItem value="single">Single Choice</MenuItem>
              <MenuItem value="multiple">Multiple Choice</MenuItem>
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="truefalse">True / False</MenuItem>
            </Select>
          </FormControl>

          {(type === 'single' || type === 'multiple') && (
            <Stack spacing={1}>
              <Typography variant="subtitle2">Answers</Typography>
              {answers.map((a, i) => (
                <Stack direction="row" spacing={1} alignItems="center" key={i}>
                  <TextField
                    fullWidth
                    label={`Answer ${i + 1}`}
                    value={a.text}
                    onChange={(e) => handleAnswerChange(i, 'text', e.target.value)}
                  />
                  <Checkbox
                    checked={a.isCorrect}
                    onChange={(e) => handleAnswerChange(i, 'isCorrect', e.target.checked)}
                  />
                  <IconButton onClick={() => removeAnswer(i)}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              ))}
              <Button onClick={addAnswer}>Add Answer</Button>
            </Stack>
          )}

          {type === 'text' && (
            <Stack spacing={1}>
              <Typography variant="subtitle2">Expected Answer</Typography>
              <TextField
                fullWidth
                label="Answer Text"
                value={answers[0]?.text || ''}
                onChange={(e) => handleAnswerChange(0, 'text', e.target.value)}
              />
            </Stack>
          )}

          {type === 'truefalse' && (
            <Stack spacing={1}>
              <Typography variant="subtitle2">Select Correct Answer</Typography>
              {answers.map((a, i) => (
                <Stack direction="row" spacing={1} alignItems="center" key={i}>
                  <Typography>{a.text}</Typography>
                  <Checkbox
                    checked={a.isCorrect}
                    onChange={() => {
                      const newAnswers = answers.map((ans, idx) => ({
                        ...ans,
                        isCorrect: idx === i,
                      }));
                      setAnswers(newAnswers);
                    }}
                  />
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
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
            mt: 2,
            ml: 2,
            mr: 2,
            mb: 2,
          }}
        >
          <Button onClick={onClose} variant="outlined" sx={{ width: isMobile ? '100%' : '180px', maxWidth: '100%' }}>
            Cancel
          </Button>{' '}
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ width: isMobile ? '100%' : '180px', maxWidth: '100%' }}
          >
            {initial ? 'Update' : 'Create'}
          </Button>
        </Box>

        {/* <Button variant="contained" onClick={handleSubmit}>
          {initial ? 'Update' : 'Create'}
        </Button> */}
      </DialogActions>
    </Dialog>
  );
}
