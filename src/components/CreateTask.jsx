import React, { useState } from 'react';
import { styled, Box, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from '@mui/material';
import TaskForm from './TaskForm';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig.js';

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
  justifyContent: 'space-between',

  [theme.breakpoints.down('lg')]: { 
    justifyContent: 'space-evenly',
  },

  [theme.breakpoints.down('md')]: { 
    flexDirection: 'column',
    gap: '1rem',            
  },

  [theme.breakpoints.down('sm')]: { 
    flexDirection: 'column',       
    alignItems: 'stretch',          
    gap: '1rem',                    
  },
}));

const CreateTask = ({ addTask }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    date: null,
    status: 'todo',
    priority: 'low',
  });

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleCreateTask = async () => {
    try {
      const dataToSubmit = {
        ...taskData,
        date: taskData.date ? Timestamp.fromDate(new Date(taskData.date)) : null,
      };

      setIsFormOpen(false);

      const docRef = await addDoc(collection(db, 'tasks'), dataToSubmit);

      addTask({ ...dataToSubmit, id: docRef.id });
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Task Tracker
      </Typography>
      <InputWrapper>
        <Typography variant="body1">TODO APPLICATION</Typography>
        <Button variant="contained" color="secondary" onClick={handleOpenForm}>
          Create Task
        </Button>
      </InputWrapper>
      <Dialog
        open={isFormOpen}
        onClose={handleCloseForm}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <TaskForm taskData={taskData} setTaskData={setTaskData} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreateTask} variant="contained" color="secondary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreateTask;
