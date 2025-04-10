import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';

const ConsumptionGauge = ({ budgetData, timeData }) => {
  const { totalBudget, actualCost } = budgetData;
  const costPercentage = (actualCost / totalBudget) * 100;
  const timePercentage = timeData.percentageElapsed;

  // Calculate consumption ratio (cost percentage relative to time percentage)
  const consumptionRatio = timePercentage > 0 ? (costPercentage / timePercentage) : 0;

  // Determine status color based on consumption ratio
  const getStatusColor = (ratio) => {
    if (ratio > 1.5) return '#dc2626'; // Red for high consumption relative to time
    if (ratio > 1) return '#f97316'; // Orange for moderate overconsumption
    return '#22c55e'; // Green for good consumption rate
  };

  const getStatusText = (ratio) => {
    if (ratio > 1.5) return 'High Consumption Rate';
    if (ratio > 1) return 'Elevated Consumption Rate';
    return 'Efficient Consumption Rate';
  };

  const statusColor = getStatusColor(consumptionRatio);

  const costData = [
    {
      name: 'Cost',
      value: costPercentage,
      fill: statusColor
    }
  ];

  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Budget Consumption
      </Typography>
      <Grid container justifyContent="center" sx={{ mb: 2 }}>
        <Grid item xs={12} textAlign="center">
          <Typography variant="subtitle2" color="text.secondary">
            Budget Used
          </Typography>
          <Typography variant="h6" color={statusColor}>
            {costPercentage.toFixed(1)}%
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            (at {timePercentage.toFixed(1)}% of timeline)
          </Typography>
        </Grid>
      </Grid>
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
              data={costData}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              startAngle={180}
              endAngle={180 - (costPercentage * 1.8)}
            >
              {costData.map((entry, index) => (
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
          <Typography variant="h4" sx={{ color: statusColor }}>
            {costPercentage.toFixed(1)}%
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Budget Consumed
          </Typography>
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Status:
            </Typography>
            <Typography variant="body1" sx={{ color: statusColor, fontWeight: 'medium' }}>
              {getStatusText(consumptionRatio)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default ConsumptionGauge; 