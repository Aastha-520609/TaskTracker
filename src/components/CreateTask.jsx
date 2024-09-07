import React, {useState} from 'react';
import { TextField, styled, Box, Typography, Button } from '@mui/material';

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '50px',
  width: '100%',
  backgroundColor: theme.palette.background.paper,
}));

const InputWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '600px',
  padding: '16px',
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  justifyContent: 'space-between'
}));

const CreateTask = ({ addTask }) => {
    const [task, setTask] = useState('');

    const handleAddTask = () => {
        if (task.trim()) {
          addTask(task);
          setTask('');
        }
      };
    
      const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
          handleAddTask();
        }
    };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Task Tracker
      </Typography>
      <InputWrapper>
        <Typography variant="body1">
          TODO APPLICATION
        </Typography>
        <Button variant="contained" color="secondary" onClick={handleAddTask}>
          Create Task
        </Button>
      </InputWrapper>
    </Container>
  );
};

export default CreateTask;

