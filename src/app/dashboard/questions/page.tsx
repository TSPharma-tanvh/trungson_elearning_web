'use client';

import { useEffect, useState } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { AddQuestionDialog } from '@/components/dashboard/question-table/add-question-dialog';
import { Question, QuestionsTable } from '@/components/dashboard/question-table/question-table';

export default function Page(): React.JSX.Element {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  // Fake data
  useEffect(() => {
    setQuestions([
      {
        id: '1',
        question: 'What is the capital of France?',
        type: 'single',
        answers: [
          { text: 'Paris', isCorrect: true },
          { text: 'London', isCorrect: false },
        ],
      },
      {
        id: '2',
        question: 'Select all prime numbers',
        type: 'multiple',
        answers: [
          { text: '2', isCorrect: true },
          { text: '3', isCorrect: true },
          { text: '4', isCorrect: false },
        ],
      },
      {
        id: '3',
        question: 'Describe your experience with React.',
        type: 'text',
        answers: [{ text: 'Hihihihi', isCorrect: true }],
      },
      {
        id: '4',
        question: 'The Earth is flat.',
        type: 'truefalse',
        answers: [
          { text: 'True', isCorrect: false },
          { text: 'False', isCorrect: true },
        ],
      },
    ]);
  }, []);

  const handleAddOrEdit = (q: Question) => {
    setQuestions((prev) => {
      const exists = prev.findIndex((x) => x.id === q.id);
      if (exists !== -1) {
        const updated = [...prev];
        updated[exists] = q;
        return updated;
      }
      return [...prev, q];
    });
  };

  const filteredQuestions = filterType === 'all' ? questions : questions.filter((q) => q.type === filterType);

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Quiz Questions</Typography>
        <Stack direction="row" spacing={2}>
          <FormControl size="small">
            <InputLabel>Filter Type</InputLabel>
            <Select
              value={filterType}
              label="Filter Type"
              onChange={(e) => setFilterType(e.target.value)}
              style={{ minWidth: 150 }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="single">Single Choice</MenuItem>
              <MenuItem value="multiple">Multiple Choice</MenuItem>
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="truefalse">True/False</MenuItem>
            </Select>
          </FormControl>
          <Button
            startIcon={<PlusIcon />}
            variant="contained"
            onClick={() => {
              setEditingQuestion(null);
              setDialogOpen(true);
            }}
          >
            Add Question
          </Button>
        </Stack>
      </Stack>

      <QuestionsTable
        questions={filteredQuestions}
        onEdit={(q) => {
          setEditingQuestion(q);
          setDialogOpen(true);
        }}
      />

      <AddQuestionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleAddOrEdit}
        initial={editingQuestion}
      />
    </Stack>
  );
}
