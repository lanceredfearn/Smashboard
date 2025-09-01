import { Button, Stack, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <Stack
      spacing={6}
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: '100vh', color: 'white' }}
    >
      <Typography variant="h2" component="h1" textAlign="center">
        Smashboard
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ width: 220, height: 100, fontSize: '1.2rem' }}
          onClick={() => navigate('/snl')}
        >
          SNL
          <br />
          Saturday Night Lights
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          sx={{ width: 220, height: 100, fontSize: '1.2rem' }}
          onClick={() => navigate('/smb')}
        >
          SMB
          <br />
          Senior Money Ball
        </Button>
      </Stack>
    </Stack>
  );
}

