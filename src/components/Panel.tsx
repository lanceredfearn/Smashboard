import React, { PropsWithChildren } from 'react';
import Paper from '@mui/material/Paper';
import { SxProps, Theme } from '@mui/material/styles';

interface PanelProps extends PropsWithChildren {
  sx?: SxProps<Theme>;
}

export default function Panel({ children, sx }: PanelProps) {
  return (
    <Paper
      elevation={4}
      sx={{
        p: 2,
        borderRadius: 2,
        boxShadow: 3,
        transition: 'box-shadow 0.3s ease-in-out',
        '&:hover': { boxShadow: 6 },
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
}
