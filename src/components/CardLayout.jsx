import React, {useState, useEffect} from 'react';
import { Card, CardContent, Typography, styled } from '@mui/material';
import CreateTask from './CreateTask';

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

const CardLayout = () => {
  const [tasks, setTasks] = useState([]);

  const addTask = (task) => {
    setTasks([...tasks, task]);
  };

  return (
    <div>
        <CreateTask addTask={addTask} />

        <CardWrapper>
            <StyledCard>
            <HeadingSection bgColor="#8A30E5"> TODO
            </HeadingSection>
            <BodySection>
                {tasks.length > 0 ? (
                    tasks.map((task, index) => (
                    <Typography key={index} variant="body1">
                        {task}
                    </Typography>
                    ))
                ) : (
                    <Typography variant="body1">No tasks yet.</Typography>
                )}
                </BodySection>
            </StyledCard>

            <StyledCard>
            <HeadingSection bgColor="#E26310"> INPROGRESS
            </HeadingSection>
            <BodySection>
                <Typography variant="body1">
                This is the body of the In Progress card.
                </Typography>
            </BodySection>
            </StyledCard>

            <StyledCard>
            <HeadingSection bgColor="green">COMPLETED
            </HeadingSection>
            <BodySection>
                <Typography variant="body1">
                This is the body of the Completed card.
                </Typography>
            </BodySection>
            </StyledCard>
        </CardWrapper>
    </div>
  );
};

export default CardLayout;
