import React from 'react';
import GaugeComponent from 'react-gauge-component';
import { Box, Typography, Paper } from '@mui/material';

const GaugeChart = ({ data, title, valuePrefix = '', valueSuffix = '', maxValue = 100 }) => {
  const calculateRatio = () => {
    if (title === 'Engagement Status' && data.totalBudget && data.actualCost) {
      return (data.actualCost / data.totalBudget) * 100;
    } else if (title === 'Time Status' && data.percentageElapsed) {
      return data.percentageElapsed;
    }
    return 0;
  };

  const ratio = calculateRatio();
  const formattedValue = `${ratio.toFixed(1)}${valueSuffix}`;

  // Calculate consumption status based on time elapsed to engagement ratio
  const getStatus = () => {
    if (data.percentageElapsed && data.totalBudget && data.actualCost) {
      const engagementRatio = (data.actualCost / data.totalBudget) * 100;
      const timeToEngagementRatio = data.percentageElapsed / engagementRatio;
      
      if (timeToEngagementRatio > 2) {
        return { text: 'Low Consumption', color: '#22c55e' }; // Time elapsed is more than twice the engagement
      } else if (timeToEngagementRatio >= 1) {
        return { text: 'Moderate Consumption', color: '#f97316' }; // Time elapsed is equal to or slightly more than engagement
      } else {
        return { text: 'High Consumption', color: '#dc2626' }; // Time elapsed is less than engagement
      }
    }
    return null;
  };

  const status = getStatus();

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom sx={{ 
          color: 'primary.main', 
          fontWeight: 'bold'
        }}>
          {title}
        </Typography>
        <GaugeComponent
          value={ratio}
          maxValue={maxValue}
          type="semicircle"
          arc={{
            colorArray: ['#22c55e', '#f97316', '#dc2626'],
            padding: 0.02,
            subArcs: [
              { limit: 50 },
              { limit: 75 },
              { limit: maxValue }
            ]
          }}
          pointer={{
            type: 'needle',
            color: '#1A5F7A',
            length: 0.8
          }}
          labels={{
            valueLabel: { 
              formatTextValue: () => formattedValue,
              style: { 
                fontSize: '24px', 
                fontWeight: 'bold'
              }
            }
          }}
        />
        <Box sx={{ mt: 2 }}>
          {status && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: status.color,
                fontWeight: 'medium',
                mb: 1
              }}
            >
              {status.text}
            </Typography>
          )}
          {data.percentageElapsed && (
            <Typography variant="body2" color="text.secondary">
              Time Elapsed: {data.percentageElapsed}%
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default GaugeChart; 