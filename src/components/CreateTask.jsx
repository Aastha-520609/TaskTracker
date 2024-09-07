import React from 'react';
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
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  flex: 1,
  marginRight: '16px',
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius,
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
  },
}));

const CreateTask = () => {
  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Task Tracker
      </Typography>
      <InputWrapper>
        <StyledTextField
          id="outlined-task"
          label="Enter Task"
          variant="outlined"
          fullWidth
        />
        <Button variant="contained" color="secondary">
          Add Task
        </Button>
      </InputWrapper>
    </Container>
  );
};

export default CreateTask;

