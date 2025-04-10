import { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

function DataInput({ projectData, setProjectData }) {
  const [selectedDataType, setSelectedDataType] = useState('switchOnboarding');
  const [formData, setFormData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    switch(selectedDataType) {
      case 'switchOnboarding':
        setProjectData(prev => ({
          ...prev,
          switchOnboardingData: [...(prev.switchOnboardingData || []), {
            site1: Number(formData.site1),
            site2: Number(formData.site2),
            fromDate: formData.fromDate,
            toDate: formData.toDate,
            site1Label: formData.site1Label || 'Site 1',
            site2Label: formData.site2Label || 'Site 2'
          }].sort((a, b) => new Date(a.fromDate) - new Date(b.fromDate))
        }));
        break;
      case 'upgradeTime':
        setProjectData(prev => ({
          ...prev,
          upgradeTimeData: [...(prev.upgradeTimeData || []), {
            method: formData.method,
            time: Number(formData.time),
            efficiency: Number(formData.efficiency),
            fromDate: formData.fromDate,
            toDate: formData.toDate
          }].sort((a, b) => new Date(a.fromDate) - new Date(b.fromDate))
        }));
        break;
      case 'workloadMigration':
        setProjectData(prev => ({
          ...prev,
          workloadMigrationData: [...(prev.workloadMigrationData || []), {
            workload1: Number(formData.workload1),
            workload2: Number(formData.workload2),
            fromDate: formData.fromDate,
            toDate: formData.toDate,
            workload1Label: formData.workload1Label || 'Workload 1',
            workload2Label: formData.workload2Label || 'Workload 2'
          }].sort((a, b) => new Date(a.fromDate) - new Date(b.fromDate))
        }));
        break;
    }
    setFormData({});
  };

  return (
    <Paper className="shadow-lg p-4 mb-6">
      <Typography variant="h6" className="text-gray-900 mb-4">
        Update Dashboard Data
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Data Type</InputLabel>
              <Select
                value={selectedDataType}
                label="Data Type"
                onChange={(e) => setSelectedDataType(e.target.value)}
              >
                <MenuItem value="switchOnboarding">Switch Onboarding</MenuItem>
                <MenuItem value="upgradeTime">Upgrade Time</MenuItem>
                <MenuItem value="workloadMigration">Workload Migration</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              type="date"
              label="From Date"
              value={formData.fromDate || ''}
              onChange={(e) => setFormData({...formData, fromDate: e.target.value})}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              type="date"
              label="To Date"
              value={formData.toDate || ''}
              onChange={(e) => setFormData({...formData, toDate: e.target.value})}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {selectedDataType === 'switchOnboarding' && (
            <>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Site 1 Label"
                  value={formData.site1Label || ''}
                  onChange={(e) => setFormData({...formData, site1Label: e.target.value})}
                  placeholder="Enter Site 1 name"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Site 1 Switches"
                  value={formData.site1 || ''}
                  onChange={(e) => setFormData({...formData, site1: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Site 2 Label"
                  value={formData.site2Label || ''}
                  onChange={(e) => setFormData({...formData, site2Label: e.target.value})}
                  placeholder="Enter Site 2 name"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Site 2 Switches"
                  value={formData.site2 || ''}
                  onChange={(e) => setFormData({...formData, site2: e.target.value})}
                />
              </Grid>
            </>
          )}

          {selectedDataType === 'upgradeTime' && (
            <>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Method"
                  value={formData.method || ''}
                  onChange={(e) => setFormData({...formData, method: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Time (hours)"
                  value={formData.time || ''}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Efficiency %"
                  value={formData.efficiency || ''}
                  onChange={(e) => setFormData({...formData, efficiency: e.target.value})}
                />
              </Grid>
            </>
          )}

          {selectedDataType === 'workloadMigration' && (
            <>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Workload 1 Label"
                  value={formData.workload1Label || ''}
                  onChange={(e) => setFormData({...formData, workload1Label: e.target.value})}
                  placeholder="Enter Workload 1 name"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Workload 1 Items"
                  value={formData.workload1 || ''}
                  onChange={(e) => setFormData({...formData, workload1: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Workload 2 Label"
                  value={formData.workload2Label || ''}
                  onChange={(e) => setFormData({...formData, workload2Label: e.target.value})}
                  placeholder="Enter Workload 2 name"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Workload 2 Items"
                  value={formData.workload2 || ''}
                  onChange={(e) => setFormData({...formData, workload2: e.target.value})}
                />
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <Button variant="contained" type="submit" fullWidth>
              Add Data
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default DataInput; 