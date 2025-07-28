'use client';

import React from 'react';
import {
  Box,
  Button,
  Card,
  Menu,
  MenuItem,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

const rows = [
  { id: 1, title: 'Course Publish Successfully', status: true },
  { id: 2, title: 'New Course Chapter Added', status: true },
  { id: 3, title: 'New Lesson Added', status: true },
  { id: 4, title: 'New Quiz Added', status: true },
];

export default function Page(): React.JSX.Element {
  const [anchorEls, setAnchorEls] = React.useState<Record<number, HTMLElement | null>>({});

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
    setAnchorEls({ ...anchorEls, [id]: event.currentTarget });
  };

  const handleClose = (id: number) => {
    setAnchorEls({ ...anchorEls, [id]: null });
  };

  return (
    <Card>
      <Box>
        {' '}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Chủ đề</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>
                  <Switch checked={row.status} />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={(e) => {
                      handleClick(e, row.id);
                    }}
                  >
                    Hành động
                  </Button>
                  <Menu
                    anchorEl={anchorEls[row.id]}
                    open={Boolean(anchorEls[row.id])}
                    onClose={() => {
                      handleClose(row.id);
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleClose(row.id);
                      }}
                    >
                      Sửa
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleClose(row.id);
                      }}
                    >
                      Xóa
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
}
