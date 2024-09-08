import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, IconButton, styled, Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateTask from './CreateTask';
import { Box } from '@mui/material';
import EditTask from './EditTask'; 
import { collection, query, onSnapshot, doc, deleteDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig.js';
import { format } from 'date-fns';

const CardWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '4rem',
  marginLeft: '15rem',
  marginRight: '15rem',
});

const StyledCard = styled(Card)(({ theme }) => ({
  width: '30%',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
}));

const HeadingSection = styled('div')(({ bgColor }) => ({
  backgroundColor: bgColor || 'transparent',
  padding: '1rem',
  textAlign: 'center',
  color: 'white',
  fontFamily: 'Roboto, sans-serif',
}));

const BodySection = styled(CardContent)(({ theme }) => ({
  padding: '1rem',
  backgroundColor: 'white',
  flex: 1,
}));

const TaskCard = styled(Card)(({ theme }) => ({
  border: '1px solid lightgrey',
  marginBottom: '8px',
  padding: '10px',
  borderRadius: '4px',
  textAlign: 'left',
  display: 'flex',
  flexDirection: 'column',
}));

const PriorityLabel = styled(Typography)(({ priority }) => ({
  display: 'inline',
  padding: '2px 4px',
  borderRadius: '2px', 
  backgroundColor: priority === 'high' ? 'rgba(255,0,0,0.1)' : priority === 'medium' ? 'rgba(255,165,0,0.1)' : 'rgba(0,128,0,0.1)',
  color: priority === 'high' ? 'red' : priority === 'medium' ? 'orange' : 'darkgreen',
}));

const TaskHeader = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px',
});

const TaskContent = styled(CardContent)(({ theme }) => ({
  padding: '8px',
  '&:last-child': {
    paddingBottom: '8px',
  },
}));

const DividerLine = styled(Divider)(({ theme }) => ({
  margin: '8px 0',
}));

const CardLayout = () => {
  const [tasks, setTasks] = useState({
    todo: [],
    inprogress: [],
    completed: []
  });

  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    const fetchTasks = () => {
      const q = query(collection(db, 'tasks'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const taskData = { todo: [], inprogress: [], completed: [] };
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.status) {
            taskData[data.status].push({ ...data, id: doc.id });
          }
        });
        setTasks(taskData);
      });
      return unsubscribe;
    };

    const unsubscribe = fetchTasks();
    return () => unsubscribe();
  }, []);

  const addTask = (task) => {
    setTasks(prevTasks => {
      const updatedTasks = { ...prevTasks };
      if (task.status === 'todo') {
        updatedTasks.todo.push(task);
      } else if (task.status === 'inprogress') {
        updatedTasks.inprogress.push(task);
      } else if (task.status === 'completed') {
        updatedTasks.completed.push(task);
      }
      return updatedTasks;
    });
  };

  const deleteTask = async (id, status) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
      setTasks(prevTasks => {
        const updatedTasks = { ...prevTasks };
        updatedTasks[status] = updatedTasks[status].filter(task => task.id !== id);
        return updatedTasks;
      });
    } catch (e) {
      console.error("Error removing document: ", e);
    }
  };

  const handleEditTask = (task, index, status) => {
    setEditTask({ task, index, status });
  };

  const handleSaveEdit = async (updatedTask) => {
    try {
      await updateDoc(doc(db, 'tasks', editTask.task.id), updatedTask);
      setTasks(prevTasks => {
        const updatedTasks = { ...prevTasks };
        updatedTasks[editTask.status][editTask.index] = updatedTask;
        return updatedTasks;
      });
      setEditTask(null);
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  const handleCancelEdit = () => {
    setEditTask(null); 
  };

  return (
    <div>
      <CreateTask addTask={addTask} />

      {editTask && (
        <Box sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000 }}>
          <EditTask task={editTask.task} onSave={handleSaveEdit} onCancel={handleCancelEdit} />
        </Box>
      )}
  
      <CardWrapper>
        {/* TODO Section */}
        <StyledCard>
          <HeadingSection bgColor="#8A30E5">TODO</HeadingSection>
          <BodySection>
            {tasks.todo.length > 0 ? (
              tasks.todo.map((task, index) => {
                // Convert Firestore Timestamp to JavaScript Date
                const date = task.date instanceof Timestamp ? task.date.toDate() : task.date;

                return (
                  <TaskCard key={index}>
                    <PriorityLabel priority={task.priority}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </PriorityLabel>
                    <TaskHeader>
                      <Typography variant="h6" sx={{ ml: 0.8 }}>{task.title}</Typography>
                      <div>
                        <IconButton onClick={() => handleEditTask(task, index, 'todo')} size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => deleteTask(task.id, 'todo')} size="small" sx={{ ml: -1 }}>
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    </TaskHeader>
                    <TaskContent>
                      <Typography variant="body2">{task.description}</Typography>
                      <DividerLine />
                      <Typography variant="caption">{date ? format(new Date(date), 'yyyy-MM-dd') : 'No date available'}</Typography>
                    </TaskContent>
                  </TaskCard>
                );
              })
            ) : (
              <Typography variant="body1">No tasks yet.</Typography>
            )}
          </BodySection>
        </StyledCard>

        {/* INPROGRESS Section */}
        <StyledCard>
          <HeadingSection bgColor="#E26310">INPROGRESS</HeadingSection>
          <BodySection>
            {tasks.inprogress.length > 0 ? (
              tasks.inprogress.map((task, index) => {
                // Convert Firestore Timestamp to JavaScript Date
                const date = task.date instanceof Timestamp ? task.date.toDate() : task.date;

                return (
                  <TaskCard key={index}>
                    <PriorityLabel priority={task.priority}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </PriorityLabel>
                    <TaskHeader>
                      <Typography variant="h6" sx={{ ml: 0.8 }}>{task.title}</Typography>
                      <div>
                        <IconButton onClick={() => handleEditTask(task, index, 'inprogress')} size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => deleteTask(task.id, 'inprogress')} size="small" sx={{ ml: -1 }}>
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    </TaskHeader>
                    <TaskContent>
                      <Typography variant="body2">{task.description}</Typography>
                      <DividerLine />
                      <Typography variant="caption">{date ? format(new Date(date), 'yyyy-MM-dd') : 'No date available'}</Typography>
                    </TaskContent>
                  </TaskCard>
                );
              })
            ) : (
              <Typography variant="body1">No tasks yet.</Typography>
            )}
          </BodySection>
        </StyledCard>

        {/* COMPLETED Section */}
        <StyledCard>
          <HeadingSection bgColor="#6FCF97">COMPLETED</HeadingSection>
          <BodySection>
            {tasks.completed.length > 0 ? (
              tasks.completed.map((task, index) => {
                // Convert Firestore Timestamp to JavaScript Date
                const date = task.date instanceof Timestamp ? task.date.toDate() : task.date;

                return (
                  <TaskCard key={index}>
                    <PriorityLabel priority={task.priority}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </PriorityLabel>
                    <TaskHeader>
                      <Typography variant="h6" sx={{ ml: 0.8 }}>{task.title}</Typography>
                      <div>
                        <IconButton onClick={() => handleEditTask(task, index, 'completed')} size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => deleteTask(task.id, 'completed')} size="small" sx={{ ml: -1 }}>
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    </TaskHeader>
                    <TaskContent>
                      <Typography variant="body2">{task.description}</Typography>
                      <DividerLine />
                      <Typography variant="caption">{date ? format(new Date(date), 'yyyy-MM-dd') : 'No date available'}</Typography>
                    </TaskContent>
                  </TaskCard>
                );
              })
            ) : (
              <Typography variant="body1">No tasks yet.</Typography>
            )}
          </BodySection>
        </StyledCard>
      </CardWrapper>
    </div>
  );
};

export default CardLayout;
