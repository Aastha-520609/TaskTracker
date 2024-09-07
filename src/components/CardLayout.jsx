import React from 'react';
import { Card, CardContent, Typography, styled } from '@mui/material';

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
  return (
    <CardWrapper>
      <StyledCard>
        <HeadingSection bgColor="#8A30E5"> TODO
        </HeadingSection>
        <BodySection>
          <Typography variant="body1">
            This is the body of the TODO card.
          </Typography>
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
  );
};

export default CardLayout;
