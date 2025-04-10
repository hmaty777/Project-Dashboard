import React from 'react';
import { Box, Grid } from '@mui/material';
import GaugeChart from './GaugeChart';

const Dashboard = ({ budgetData, timeData }) => {
  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <GaugeChart 
            data={{ ...budgetData, ...timeData }} 
            title="Engagement Status" 
            valuePrefix="$"
            valueSuffix="%"
            maxValue={100}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <GaugeChart 
            data={{ ...budgetData, ...timeData }} 
            title="Time Status" 
            valueSuffix="%"
            maxValue={100}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 