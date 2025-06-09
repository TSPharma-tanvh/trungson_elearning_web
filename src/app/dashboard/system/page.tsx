'use client';

import React from 'react';
import {
  Box,
  Card,
  Checkbox,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { Download } from '@phosphor-icons/react';

const data = [
  { name: 'Course Assignment Added', email: true, browser: true, sms: false, push: true },
  { name: 'Course ExerciseFile Added', email: true, browser: true, sms: false, push: true },
  { name: 'Course Publish Successfully', email: true, browser: true, sms: false, push: true },
  { name: 'Course Unpublished', email: true, browser: true, sms: false, push: false },
  { name: 'New Course Chapter Added', email: true, browser: true, sms: false, push: true },
  { name: 'New Enroll Notification', email: true, browser: true, sms: false, push: false },
  { name: 'New Lesson Added', email: false, browser: false, sms: false, push: false },
  { name: 'New Quiz Added', email: false, browser: false, sms: false, push: false },
  { name: 'New Reply on Comment', email: true, browser: true, sms: false, push: false },
  { name: 'New Review on course', email: true, browser: true, sms: false, push: false },
];

export default function Page(): React.JSX.Element {
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [search, setSearch] = React.useState('');

  const filteredData = data.filter((row) => row.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Paper sx={{ padding: 2 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <FormControl size="small" sx={{ width: 100 }}>
          <InputLabel>Results</InputLabel>
          <Select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))} label="Results">
            {[10, 25, 50].map((val) => (
              <MenuItem key={val} value={val}>
                {val}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          size="small"
          placeholder="Tìm kiếm nhanh"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <IconButton>
          <Download />
        </IconButton>
      </div>
      <Card>
        <Box>
          {' '}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Tên</strong>
                </TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Trình duyệt</TableCell>
                <TableCell align="center">SMS</TableCell>
                <TableCell align="center">Thông báo đẩy</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.slice(0, rowsPerPage).map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell align="center">
                    <Checkbox checked={row.email} />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox checked={row.browser} />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox checked={row.sms} />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox checked={row.push} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Card>
    </Paper>
  );
}
