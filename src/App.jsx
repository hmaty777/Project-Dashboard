import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Header from './components/Header';
import DataGridComponent from './components/DataGrid';
import Dashboard from './components/Dashboard';
import { AppBar, Toolbar, Typography } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1A5F7A',
    },
    secondary: {
      main: '#157145',
    },
    background: {
      default: '#f3f4f6',
      paper: '#ffffff',
    },
  },
});

const initialData = [
  {
    id: 1,
    date: '2024-01-01',
    category: 'Budget',
    type: 'Total',
    value: 300000,
    metric: 'Cost'
  },
  {
    id: 2,
    date: '2024-01-01',
    category: 'Budget',
    type: 'Actual',
    value: 150000,
    metric: 'Cost'
  },
  {
    id: 3,
    date: '2024-01-01',
    category: 'Time',
    type: 'Elapsed',
    value: 25,
    metric: 'Percentage'
  }
];

const App = () => {
  const [data, setData] = useState(initialData);
  const [budgetData, setBudgetData] = useState([]);
  const [timeData, setTimeData] = useState([]);

  useEffect(() => {
    const { budgetMetrics, timeMetrics } = transformDataForGauges(data);
    setBudgetData(budgetMetrics);
    setTimeData(timeMetrics);
  }, [data]); // Re-run when data changes

  const handleDataUpdate = useCallback((newData) => {
    setData(newData);
  }, []);

  // Transform grid data into gauge data
  const transformDataForGauges = (data) => {
    const latestDate = data.reduce((latest, item) => {
      const itemDate = new Date(item.date);
      return latest ? (itemDate > latest ? itemDate : latest) : itemDate;
    }, null);

    const latestData = data.filter(item => 
      new Date(item.date).getTime() === latestDate?.getTime()
    );

    const budgetMetrics = {
      totalBudget: latestData.find(item => item.category === 'Budget' && item.type === 'Total')?.value || 0,
      actualCost: latestData.find(item => item.category === 'Budget' && item.type === 'Actual')?.value || 0
    };

    const timeMetrics = {
      percentageElapsed: latestData.find(item => item.category === 'Time' && item.type === 'Elapsed')?.value || 0
    };

    return { budgetMetrics, timeMetrics };
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}>
        <Container maxWidth="xl">
          <Box sx={{ py: 4 }}>
            <Header />
            <Box sx={{ mb: 4 }}>
              <DataGridComponent 
                data={data} 
                onDataUpdate={handleDataUpdate} 
              />
            </Box>
            <Dashboard 
              budgetData={budgetData}
              timeData={timeData}
            />
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App; 