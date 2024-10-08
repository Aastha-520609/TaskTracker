import React from 'react';
import { TextField, Typography, Box, FormControl, InputLabel, MenuItem, Select, styled } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const FormContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '16px',
  maxWidth: '100%',
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

const TaskForm = ({ taskData, setTaskData }) => {
  const handleChange = (field, value) => {
    setTaskData(prevState => ({
      ...prevState,
      [field]: value
    }));
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
            value={taskData.date}
            onChange={(newDate) => handleChange('date', newDate)}
            slotProps={{
              textField: {
                fullWidth: true,
                id: "date-picker",
                name: "date",
                label: "Select a date",
              }
            }}
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
            <MenuItem value="inprogress">InProgress</MenuItem>
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
    </FormContainer>
  );
};

export default TaskForm;
