import React from 'react';
import { TextField, Typography, Box, FormControl, InputLabel, MenuItem, Select, styled, Button } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

// Styled components
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

const FormSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
}));

const FormControlStyled = styled(FormControl)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const SmallTextField = styled(TextField)(({ theme }) => ({
  // Styling as needed
}));

const EditTask = ({ task, onSave, onCancel }) => {
  // Ensure that the date is a valid dayjs object
  const [taskData, setTaskData] = React.useState({
    ...task,
    date: task.date ? dayjs(task.date) : null,  // Convert to dayjs
  });

  const handleChange = (field, value) => {
    setTaskData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // Convert dayjs date back to a JavaScript Date object before saving
    const updatedTask = {
      ...taskData,
      date: taskData.date ? taskData.date.toDate() : null, // Convert dayjs to Date
    };
    onSave(updatedTask);
  };

  return (
    <FormContainer>
      <FormSection>
        <Typography variant="subtitle1">Title</Typography>
        <SmallTextField
          fullWidth
          variant="outlined"
          id="title"
          name="title"
          value={taskData.title}
          label="Enter Title Here"
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </FormSection>

      <FormSection>
        <Typography variant="subtitle1">Description</Typography>
        <SmallTextField
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
      </FormSection>

      <FormSection>
        <Typography variant="subtitle1">Select Date</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={taskData.date}  // Ensure taskData.date is a dayjs object
            onChange={(newDate) => handleChange('date', newDate)}
            renderInput={(params) => <SmallTextField {...params} />}
          />
        </LocalizationProvider>
      </FormSection>

      <FormSection>
        <FormControlStyled fullWidth size="small">
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            id="status-select"
            name="status"
            value={taskData.status}
            label="Status"
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <MenuItem value="todo">TODO</MenuItem>
            <MenuItem value="inprogress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControlStyled>
      </FormSection>

      <FormSection>
        <FormControlStyled fullWidth size="small">
          <InputLabel id="priority-label">Priority</InputLabel>
          <Select
            labelId="priority-label"
            id="priority-select"
            name="priority"
            value={taskData.priority}
            label="Priority"
            onChange={(e) => handleChange('priority', e.target.value)}
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
        </FormControlStyled>
      </FormSection>

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
