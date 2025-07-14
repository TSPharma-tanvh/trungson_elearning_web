// 'use client';

// import { useEffect, useState } from 'react';
// import { AddQuestionDialog } from '@/presentation/components/dashboard/question-table/add-question-dialog';
// import { Question, QuestionsTable } from '@/presentation/components/dashboard/quiz/question/question-table';
// import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
// import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

// export default function Page(): React.JSX.Element {
//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
//   const [filterType, setFilterType] = useState<string>('all');

//   // Fake data
//   useEffect(() => {
//     setQuestions([
//       {
//         id: '1',
//         question: 'What is the capital of France?',
//         type: 'single',
//         answers: [
//           { text: 'Paris', isCorrect: true },
//           { text: 'London', isCorrect: false },
//         ],
//       },
//       {
//         id: '2',
//         question: 'Select all prime numbers',
//         type: 'multiple',
//         answers: [
//           { text: '2', isCorrect: true },
//           { text: '3', isCorrect: true },
//           { text: '4', isCorrect: false },
//         ],
//       },
//       {
//         id: '3',
//         question: 'Describe your experience with React.',
//         type: 'text',
//         answers: [{ text: 'Hihihihi', isCorrect: true }],
//       },
//       {
//         id: '4',
//         question: 'The Earth is flat.',
//         type: 'truefalse',
//         answers: [
//           { text: 'True', isCorrect: false },
//           { text: 'False', isCorrect: true },
//         ],
//       },
//     ]);
//   }, []);

//   const handleAddOrEdit = (q: Question) => {
//     setQuestions((prev) => {
//       const exists = prev.findIndex((x) => x.id === q.id);
//       if (exists !== -1) {
//         const updated = [...prev];
//         updated[exists] = q;
//         return updated;
//       }
//       return [...prev, q];
//     });
//   };

//   const filteredQuestions = filterType === 'all' ? questions : questions.filter((q) => q.type === filterType);

//   return (
//     <Stack spacing={3}>
//       <Stack direction="row" justifyContent="space-between" alignItems="center">
//         <Typography variant="h4">Quiz Questions</Typography>
//         <Stack direction="row" spacing={2}>
//           <FormControl size="small">
//             <InputLabel>Filter Type</InputLabel>
//             <Select
//               value={filterType}
//               label="Filter Type"
//               onChange={(e) => setFilterType(e.target.value)}
//               style={{ minWidth: 150 }}
//             >
//               <MenuItem value="all">All</MenuItem>
//               <MenuItem value="single">Single Choice</MenuItem>
//               <MenuItem value="multiple">Multiple Choice</MenuItem>
//               <MenuItem value="text">Text</MenuItem>
//               <MenuItem value="truefalse">True/False</MenuItem>
//             </Select>
//           </FormControl>
//           <Button
//             startIcon={<PlusIcon />}
//             variant="contained"
//             onClick={() => {
//               setEditingQuestion(null);
//               setDialogOpen(true);
//             }}
//           >
//             Add Question
//           </Button>
//         </Stack>
//       </Stack>

//       <QuestionsTable
//         questions={filteredQuestions}
//         onEdit={(q) => {
//           setEditingQuestion(q);
//           setDialogOpen(true);
//         }}
//       />

//       <AddQuestionDialog
//         open={dialogOpen}
//         onClose={() => setDialogOpen(false)}
//         onSubmit={handleAddOrEdit}
//         initial={editingQuestion}
//       />
//     </Stack>
//   );
// }
'use client';

import React from 'react';
import { CreateQuestionRequest } from '@/domain/models/question/request/create-question-request';
import { GetQuestionRequest } from '@/domain/models/question/request/get-question-request';
import { UpdateQuestionRequest } from '@/domain/models/question/request/update-question-request';
import { QuestionResponse } from '@/domain/models/question/response/question-response';
import { useDI } from '@/presentation/hooks/useDependencyContainer';
import { Button, Stack, Typography } from '@mui/material';
import { Plus } from '@phosphor-icons/react';

import { QuestionFilters } from '@/presentation/components/dashboard/quiz/question/question-filter';
import QuestionTable from '@/presentation/components/dashboard/quiz/question/question-table';

export default function Page(): React.JSX.Element {
  const { questionUsecase } = useDI();

  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = React.useState(false);
  const [filters, setFilters] = React.useState<GetQuestionRequest>(
    new GetQuestionRequest({ pageNumber: 1, pageSize: 10 })
  );
  const [questions, setQuestions] = React.useState<QuestionResponse[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const fetchQuestions = React.useCallback(async () => {
    try {
      const request = new GetQuestionRequest({
        ...filters,
        pageNumber: page + 1,
        pageSize: rowsPerPage,
      });
      const { questions, totalRecords } = await questionUsecase.getQuestionListInfo(request);
      setQuestions(questions);
      setTotalCount(totalRecords);
    } catch (error) {
      setQuestions([]);
    }
  }, [filters, page, rowsPerPage, questionUsecase]);

  React.useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleFilter = (newFilters: GetQuestionRequest) => {
    setFilters(newFilters);
    setPage(0);
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(event.target.value, 10);
    setRowsPerPage(newSize);
    setPage(0);
  };

  const handleCreateQuestion = async (request: CreateQuestionRequest) => {
    try {
      await questionUsecase.createQuestion(request);
      setShowCreateDialog(false);
      await fetchQuestions();
    } catch (error) {
      console.error('Failed to create course path:', error);
    }
  };

  const handleEditQuestion = async (request: UpdateQuestionRequest) => {
    try {
      await questionUsecase.updateQuestion(request);
      await fetchQuestions();
    } catch (error) {
      console.error('Failed to update course path:', error);
    }
  };

  const handleDeleteQuestions = async (ids: string[]) => {
    try {
      setDeleteLoading(true);
      for (const id of ids) {
        const response = await questionUsecase.deleteQuestion(id);
        if (!response) {
          throw new Error(`Failed to delete path with ID: ${id}`);
        }
      }
      await fetchQuestions();
    } catch (error) {
      console.error('Failed to delete course paths:', error);
      throw error;
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4" sx={{ color: 'var(--mui-palette-secondary-main)' }}>
            Questions
          </Typography>
        </Stack>
        <Button
          startIcon={<Plus fontSize="var(--icon-fontSize-md)" />}
          variant="contained"
          onClick={() => setShowCreateDialog(true)}
        >
          Add
        </Button>
      </Stack>
      <QuestionFilters onFilter={handleFilter} />
      <QuestionTable
        rows={questions}
        count={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onDeleteQuestions={handleDeleteQuestions}
        onEditQuestion={handleEditQuestion}
      ></QuestionTable>

      {/* <CreateQuestionDialog
        onSubmit={handleCreateQuestion}
        disabled={false}
        loading={false}
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      /> */}
    </Stack>
  );
}
