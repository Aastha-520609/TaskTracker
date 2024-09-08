import React, { useState } from 'react';
import { TextField, Typography, Box, FormControl, InputLabel, MenuItem, Select, styled } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// Styled components
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
 
}));

const TaskForm = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(null);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');

  const handleCreate = () => {
    onClose();
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
          value={title}
          label="Enter Title Here"
          onChange={(e) => setTitle(e.target.value)}
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
          value={description}
          label="Enter Description here"
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormSection>

      <FormSection>
        <Typography variant="subtitle1">Select Date</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={date}
            onChange={(newDate) => setDate(newDate)}
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
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value)}
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
            value={priority}
            label="Priority"
            onChange={(e) => setPriority(e.target.value)}
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
