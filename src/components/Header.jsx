import React from 'react';
import { Typography, Box } from '@mui/material';

function Header() {
  return (
    <Box sx={{ py: 3, textAlign: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Project Management Dashboard
      </Typography>
    </Box>
  );
}

export default Header; 