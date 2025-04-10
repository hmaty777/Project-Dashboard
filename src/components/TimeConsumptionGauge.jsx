import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';

const TimeConsumptionGauge = ({ timeData }) => {
  const timePercentage = timeData.percentageElapsed;

  const data = [
    {
      name: 'Time',
      value: timePercentage,
      fill: '#3b82f6'  // Blue color
    }
  ];

  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Time Consumption
      </Typography>
      <Box sx={{ height: 300, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={[{ value: 100 }]}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#f1f5f9"
              startAngle={180}
              endAngle={0}
            />
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              startAngle={180}
              endAngle={180 - (timePercentage * 1.8)}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            width: '100%'
          }}
        >
          <Typography variant="h4" sx={{ color: '#3b82f6' }}>
            {timePercentage.toFixed(1)}%
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Time Elapsed
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {timeData.startDate.toLocaleDateString()} - {timeData.endDate.toLocaleDateString()}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default TimeConsumptionGauge; 