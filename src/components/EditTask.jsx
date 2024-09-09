import React from 'react';
import { TextField, Typography, Box, FormControl, InputLabel, MenuItem, Select, styled, Button } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const FormContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '16px',
  maxWidth: '100%',
  border: '2px solid grey',
  borderRadius: '4px',
  backgroundColor: '#fff',
}));

const EditTask = ({ task, onSave, onCancel }) => {
  const [taskData, setTaskData] = React.useState({
    ...task,
    date: task.date ? dayjs(task.date.toDate ? task.date.toDate() : task.date) : null,
  });

  const handleChange = (field, value) => {
    setTaskData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSave = () => {
    const updatedTask = {
      ...taskData,
      date: taskData.date ? taskData.date.toDate() : null,
    };
    onSave(updatedTask);
  };

  return (
    <FormContainer>
      <Typography variant="subtitle1">Title</Typography>
      <TextField
        fullWidth
        variant="outlined"
        id="title"
        name="title"
        value={taskData.title}
        label="Enter Title Here"
        onChange={(e) => handleChange('title', e.target.value)}
      />

      <Typography variant="subtitle1">Description</Typography>
      <TextField
        fullWidth
        variant="outlined"
        multiline
        rows={4}
        id="description"
        name="description"
        value={taskData.description}
        label="Enter Description here"
        onChange={(e) => handleChange('description', e.target.value)}
      />

      <Typography variant="subtitle1">Select Date</Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          value={taskData.date}
          onChange={(newDate) => handleChange('date', newDate)}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>

      <FormControl fullWidth>
        <InputLabel>Status</InputLabel>
        <Select
          value={taskData.status}
          onChange={(e) => handleChange('status', e.target.value)}
        >
          <MenuItem value="todo">TODO</MenuItem>
          <MenuItem value="inprogress">In Progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Priority</InputLabel>
        <Select
          value={taskData.priority}
          onChange={(e) => handleChange('priority', e.target.value)}
        >
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </FormContainer>
  );
};

export default EditTask;
