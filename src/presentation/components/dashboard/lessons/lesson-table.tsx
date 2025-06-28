import React from 'react';
import { UpdateLessonRequest } from '@/domain/lessons/request/update-lesson-request';
import { LessonDetailResponse } from '@/domain/lessons/response/lesson-detail-response';
import { Card, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

interface LessonTableProps {
  rows: LessonDetailResponse[];
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteLessonPaths: (ids: string[]) => Promise<void>;
  onEditLesson: (data: UpdateLessonRequest) => Promise<void>;
}

export default function LessonTable({
  rows,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onDeleteLessonPaths,
  onEditLesson,
}: LessonTableProps) {
  const rowIds = React.useMemo(() => rows.map((r) => r.id!), [rows]);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  return (
    <>
      <Card>
        <TableContainer>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Detail</TableCell>
            </TableRow>
          </TableHead>
          <TableBody></TableBody>
        </TableContainer>
      </Card>
    </>
  );
}
