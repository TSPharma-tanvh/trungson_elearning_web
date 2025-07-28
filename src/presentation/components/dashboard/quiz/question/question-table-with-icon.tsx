import * as React from 'react';
import { useState } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Box,
  Card,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

export interface Question {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'text' | 'truefalse';
  answers: {
    text: string;
    isCorrect: boolean;
  }[];
}

interface QuestionTableWithIconsProps {
  questions: Question[];
  onEdit: (question: Question) => void;
}

export function QuestionsTableWithIcon({ questions, onEdit }: QuestionTableWithIconsProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, question: Question) => {
    setAnchorEl(event.currentTarget);
    setSelectedQuestion(question);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedQuestion(null);
  };

  const handleEdit = () => {
    if (selectedQuestion) onEdit(selectedQuestion);
    handleMenuClose();
  };

  return (
    <Card>
      <Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Question</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Answers</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.map((q, index) => (
              <TableRow key={q.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Typography variant="subtitle1">{q.question}</Typography>
                </TableCell>
                <TableCell>{q.type}</TableCell>
                <TableCell>
                  <Box display="flex" flexDirection="column" gap={1}>
                    {q.answers.map((a, i) => {
                      const trimmedText = (a.text ?? '').trim();
                      const shouldShowCancelIcon = q.type !== 'text' && !a.isCorrect && trimmedText.length > 0;

                      return (
                        <Box key={i} display="flex" alignItems="center" gap={1}>
                          {a.isCorrect ? (
                            <CheckCircleIcon fontSize="small" color="success" />
                          ) : shouldShowCancelIcon ? (
                            <CancelIcon fontSize="small" color="error" />
                          ) : null}
                          <Typography>{trimmedText}</Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={(e) => {
                      handleMenuOpen(e, q);
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleEdit}>Edit</MenuItem>
        </Menu>
      </Box>
    </Card>
  );
}
