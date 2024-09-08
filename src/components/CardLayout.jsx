import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, IconButton, styled, Divider, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateTask from './CreateTask';
import EditTask from './EditTask'; 
import { collection, query, onSnapshot, doc, deleteDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig.js';
import { format } from 'date-fns';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';


const CardWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '4rem',
  marginLeft: '15rem',
  marginRight: '15rem',

  [theme.breakpoints.down('lg')]: { 
    marginLeft: '5rem',
    marginRight: '5rem',
  },

  [theme.breakpoints.down('md')]: {
    marginLeft: '3rem',
    marginRight: '3rem',
    flexDirection: 'column',
  },

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',        
    marginLeft: '1rem',
    marginRight: '1rem',
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  width: '30%',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  borderRadius:  '15px',
  fontSize: '16px',
  fontWeight: '550',
  lineHeight: '24px',
  color: 'white',
  fontFamily: 'Roboto, sans-serif',

  [theme.breakpoints.down('lg')]: { 
    width: '40%',          
    marginBottom: '2rem',   
  },

  [theme.breakpoints.down('md')]: { 
    width: '45%',          
    marginBottom: '2rem',   
  },

  [theme.breakpoints.down('sm')]: { 
    width: '100%',                 
    marginBottom: '1rem',           
  },
}));

const HeadingSection = styled('div')(({ bgColor }) => ({
  backgroundColor: bgColor || 'transparent',
  padding: '1rem',
}));

const BodySection = styled(CardContent)(({ theme }) => ({
  padding: '1rem',
  backgroundColor: 'white',
  flex: 1,
}));

const TaskCard = styled(Card)(({ theme }) => ({
  border: '2px solid lightgrey',
  marginBottom: '8px',
  padding: '10px',
  borderRadius: '4px',
  textAlign: 'left',
  display: 'flex',
  flexDirection: 'column',
}));

const PriorityContainer = styled('div')({
  backgroundColor: 'white',
  marginBottom: '5px',
});

const PriorityLabel = styled(Typography)(({ priority }) => ({
  display: 'inline',
  padding: '4px 8px',
  borderRadius: '4px',
  backgroundColor: priority === 'high' ? 'rgba(255,0,0,0.1)' :
                    priority === 'medium' ? 'rgba(255,165,0,0.1)' :
                    'rgba(0,128,0,0.1)',
  color: priority === 'high' ? 'red' :
         priority === 'medium' ? 'orange' :
         'darkgreen',
  fontSize: '12px',
}));

const TaskHeader = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px',
});

const TitleTypography = styled(Typography)({
  fontFamily: 'Inter, sans-serif',
  fontSize: '18px',
  fontWeight: '600',
  lineHeight: '21.78px',
  textAlign: 'left',
  color: '#0D062D',
});

const DescriptionTypography = styled(Typography)({
  fontFamily: 'Inter, sans-serif',
  fontSize: '13px',
  fontWeight: 400,
  lineHeight: '14.52px',
  textAlign: 'left',
});

const DividerLine = styled(Divider)(({ theme }) => ({
  margin: '8px 0',
}));

const CardLayout = () => {
  const [tasks, setTasks] = useState({
    todo: [],
    inprogress: [],
    completed: [],
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

  const addTask = async (task) => {
    try {
      const docRef = doc(collection(db, 'tasks'));
      await setDoc(docRef, task);
      
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        updatedTasks[task.status].push({ ...task, id: docRef.id });
        return updatedTasks;
      });
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const deleteTask = async (id, status) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));

      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        updatedTasks[status] = updatedTasks[status].filter((task) => task.id !== id);
        return updatedTasks;
      });
    } catch (e) {
      console.error('Error removing document: ', e);
    }
  };

  const handleEditTask = (task, index, status) => {
    setEditTask({ task, index, status });
  };

  const handleSaveEdit = async (updatedTask) => {
    try {
      await updateDoc(doc(db, 'tasks', editTask.task.id), updatedTask);
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        updatedTasks[editTask.status][editTask.index] = updatedTask;
        return updatedTasks;
      });
      setEditTask(null);
    } catch (e) {
      console.error('Error updating document: ', e);
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
                const date = task.date instanceof Timestamp ? task.date.toDate() : task.date;

                return (
                  <TaskCard key={task.id}>
                     <PriorityContainer>
                      <PriorityLabel priority={task.priority}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </PriorityLabel>
                    </PriorityContainer>
                    <TaskHeader>
                      <TitleTypography variant="h6" sx={{ ml: 0.1 }}>{task.title}</TitleTypography>
                      <div>
                        <IconButton onClick={() => handleEditTask(task, index, 'todo')} size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => deleteTask(task.id, 'todo')} sx={{ ml: -2 }}>
                          <DeleteIcon sx={{ fontSize: '18px' }}/>
                        </IconButton>
                      </div>
                    </TaskHeader>
                    <DescriptionTypography variant="body2">{task.description}</DescriptionTypography>
                    <DividerLine />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CalendarTodayOutlinedIcon sx={{ fontSize: '15px' }} />
                      <Typography variant="caption">
                        {date ? format(new Date(date), 'yyyy-MM-dd') : 'No date available'}
                      </Typography>
                    </div>
                  </TaskCard>
                );
              })
            ) : (
              <Typography variant="body1">No tasks yet.</Typography>
            )}
          </BodySection>
        </StyledCard>

        {/* In Progress Section */}
        <StyledCard>
          <HeadingSection bgColor="#F6C750">INPROGRESS</HeadingSection>
          <BodySection>
            {tasks.inprogress.length > 0 ? (
              tasks.inprogress.map((task, index) => {
                const date = task.date instanceof Timestamp ? task.date.toDate() : task.date;

                return (
                  <TaskCard key={task.id}>
                    <PriorityContainer>
                      <PriorityLabel priority={task.priority}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </PriorityLabel>
                    </PriorityContainer>
                    <TaskHeader>
                      <TitleTypography variant="h6" sx={{ ml: 0.1 }}>{task.title}</TitleTypography>
                      <div>
                        <IconButton onClick={() => handleEditTask(task, index, 'inprogress')} size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => deleteTask(task.id, 'inprogress')} sx={{ ml: -2 }}>
                          <DeleteIcon sx={{ fontSize: '18px' }} />
                        </IconButton>
                      </div>
                    </TaskHeader>
                    <DescriptionTypography variant="body2">{task.description}</DescriptionTypography>
                    <DividerLine />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CalendarTodayOutlinedIcon sx={{ fontSize: '15px' }} />
                      <Typography variant="caption">
                        {date ? format(new Date(date), 'yyyy-MM-dd') : 'No date available'}
                      </Typography>
                    </div>
                  </TaskCard>
                );
              })
            ) : (
              <Typography variant="body1">No tasks yet.</Typography>
            )}
          </BodySection>
        </StyledCard>

        {/* Completed Section */}
        <StyledCard>
          <HeadingSection bgColor="#3E8E41">COMPLETED</HeadingSection>
          <BodySection>
            {tasks.completed.length > 0 ? (
              tasks.completed.map((task, index) => {
                const date = task.date instanceof Timestamp ? task.date.toDate() : task.date;

                return (
                  <TaskCard key={task.id}>
                     <PriorityContainer>
                      <PriorityLabel priority={task.priority}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </PriorityLabel>
                    </PriorityContainer>
                    <TaskHeader>
                      <TitleTypography variant="h6" sx={{ ml: 0.1 }}>{task.title}</TitleTypography>
                      <div>
                        <IconButton onClick={() => handleEditTask(task, index, 'completed')} size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => deleteTask(task.id, 'completed')} sx={{ ml: -2 }}>
                          <DeleteIcon sx={{ fontSize: '18px' }}/>
                        </IconButton>
                      </div>
                    </TaskHeader>
                    <DescriptionTypography variant="body2">{task.description}</DescriptionTypography>
                    <DividerLine />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CalendarTodayOutlinedIcon sx={{ fontSize: '15px' }} />
                      <Typography variant="caption">
                        {date ? format(new Date(date), 'yyyy-MM-dd') : 'No date available'}
                      </Typography>
                    </div>
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
