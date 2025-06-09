'use client';

import React, { useEffect, useRef, useState } from 'react';

import 'quill/dist/quill.snow.css';

import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import Quill from 'quill';

export default function Page(): React.JSX.Element {
  const [group, setGroup] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [surveyType, setSurveyType] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [question, setQuestion] = useState('');

  const quillRef = useRef<HTMLDivElement | null>(null);
  const editorInstance = useRef<Quill | null>(null);

  useEffect(() => {
    if (quillRef.current && !editorInstance.current) {
      editorInstance.current = new Quill(quillRef.current, {
        theme: 'snow',
        placeholder: 'Nhập câu hỏi...',
      });
    }
  }, []);

  const handleSelectChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (event: SelectChangeEvent) => {
    setter(event.target.value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleSubmit = () => {
    console.log({ group, category, subcategory, surveyType, image, question });
    alert('Saved successfully');
  };

  return (
    <Box p={4}>
      <Typography variant="h5" mb={3}>
        Thêm Ngân hàng khảo sát
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Nhóm *</InputLabel>
            <Select value={group} onChange={handleSelectChange(setGroup)} label="Nhóm *">
              <MenuItem value="group1">Nhóm 1</MenuItem>
              <MenuItem value="group2">Nhóm 2</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Danh mục *</InputLabel>
            <Select value={category} onChange={handleSelectChange(setCategory)} label="Danh mục *">
              <MenuItem value="cat1">Danh mục 1</MenuItem>
              <MenuItem value="cat2">Danh mục 2</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Danh mục con</InputLabel>
            <Select value={subcategory} onChange={handleSelectChange(setSubcategory)} label="Danh mục con">
              <MenuItem value="sub1">Danh mục con 1</MenuItem>
              <MenuItem value="sub2">Danh mục con 2</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Loại khảo sát *</InputLabel>
            <Select value={surveyType} onChange={handleSelectChange(setSurveyType)} label="Loại khảo sát *">
              <MenuItem value="type1">Loại 1</MenuItem>
              <MenuItem value="type2">Loại 2</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <Button variant="outlined" component="label">
            Tải lên ảnh
            <input type="file" hidden onChange={handleImageChange} />
          </Button>
        </Grid>

        <Grid item xs={12} md={4}>
          <Button variant="contained" color="primary">
            Tìm kiếm
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Typography mb={1}>Câu hỏi *</Typography>
          <Box sx={{ border: '1px solid #ccc', borderRadius: 2 }}>
            <div ref={quillRef} style={{ height: '200px' }} />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Lưu lại câu hỏi
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
