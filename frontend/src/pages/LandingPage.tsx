import { Stack, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';

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
        <CardContainer>
          <CardBody
            className="group/card flex h-[100px] w-[220px] cursor-pointer flex-col items-center justify-center rounded-xl bg-blue-600 text-white"
            onClick={() => navigate('/snl')}
          >
            <CardItem translateZ={50} className="text-xl font-bold">
              SNL
            </CardItem>
            <CardItem translateZ={60} className="mt-2 text-sm text-center">
              Saturday Night Lights
            </CardItem>
          </CardBody>
        </CardContainer>
        <CardContainer>
          <CardBody
            className="group/card flex h-[100px] w-[220px] cursor-pointer flex-col items-center justify-center rounded-xl bg-pink-600 text-white"
            onClick={() => navigate('/smb')}
          >
            <CardItem translateZ={50} className="text-xl font-bold">
              SMB
            </CardItem>
            <CardItem translateZ={60} className="mt-2 text-sm text-center">
              Senior Money Ball
            </CardItem>
          </CardBody>
        </CardContainer>
      </Stack>
    </Stack>
  );
}

