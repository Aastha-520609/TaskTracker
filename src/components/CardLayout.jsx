import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, styled, Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateTask from './CreateTask';
import { Box } from '@mui/material';
import EditTask from './EditTask'; //

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

  const deleteTask = (index, status) => {
    setTasks(prevTasks => {
      const updatedTasks = { ...prevTasks };
      updatedTasks[status].splice(index, 1);
      return updatedTasks;
    });
  };

  const handleEditTask = (task, index, status) => {
    setEditTask({ task, index, status });
  };

  const handleSaveEdit = (updatedTask) => {
    setTasks(prevTasks => {
      const updatedTasks = { ...prevTasks };
      const { task, index, status } = editTask;
      updatedTasks[status][index] = updatedTask;
      return updatedTasks;
    });
    setEditTask(null);
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

        <StyledCard>
          <HeadingSection bgColor="#8A30E5">TODO</HeadingSection>
          <BodySection>
            {tasks.todo.length > 0 ? (
              tasks.todo.map((task, index) => (
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
                      <IconButton onClick={() => deleteTask(index, 'todo')} size="small" sx={{ ml: -1 }}>
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </TaskHeader>

                  {/* Task details */}
                  <TaskContent>
                    <Typography variant="body2">{task.description}</Typography>
                    <DividerLine />
                    <Typography variant="caption">{task.date?.format('YYYY-MM-DD')}</Typography>
                  </TaskContent>
                </TaskCard>
              ))
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
              tasks.inprogress.map((task, index) => (
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
                      <IconButton onClick={() => deleteTask(index, 'inprogress')} size="small" sx={{ ml: -1 }}>
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </TaskHeader>

                  {/* Task details */}
                  <TaskContent>
                    <Typography variant="body2">{task.description}</Typography>
                    <DividerLine />
                    <Typography variant="caption">{task.date?.format('YYYY-MM-DD')}</Typography>
                  </TaskContent>
                </TaskCard>
              ))
            ) : (
              <Typography variant="body1">No tasks yet.</Typography>
            )}
          </BodySection>
        </StyledCard>

        <StyledCard>
          <HeadingSection bgColor="green">COMPLETED</HeadingSection>
          <BodySection>
            {tasks.completed.length > 0 ? (
              tasks.completed.map((task, index) => (
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
                      <IconButton onClick={() => deleteTask(index, 'completed')} size="small" sx={{ ml: -1 }}>
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </TaskHeader>

                  <TaskContent>
                    <Typography variant="body2">{task.description}</Typography>
                    <DividerLine />
                    <Typography variant="caption">{task.date?.format('YYYY-MM-DD')}</Typography>
                  </TaskContent>
                </TaskCard>
              ))
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
