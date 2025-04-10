import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import { 
  Button, Box, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Alert, Typography, Table, TableBody,
  TableCell, TableHead, TableRow, IconButton, Tooltip 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Papa from 'papaparse';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

const TEMPLATE_CSV = `date,category,type,value,metric
2024-01-01,Budget,Total,300000,Cost
2024-01-01,Budget,Actual,150000,Cost
2024-01-01,Time,Elapsed,25,Percentage`;

function CustomToolbar({ onImportCSV }) {
  const fileInputRef = useRef(null);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [errors, setErrors] = useState([]);

  const validateData = (data) => {
    const errors = [];
    const validCategories = ['Budget', 'Time'];
    const validMetrics = ['Cost', 'Percentage'];
    const validTypes = {
      'Budget': ['Total', 'Actual'],
      'Time': ['Elapsed']
    };

    const validRows = data.filter(row => 
      Object.values(row).some(value => value !== undefined && value !== '')
    );

    validRows.forEach((row, index) => {
      if (!row.date) errors.push(`Row ${index + 1}: Missing date`);
      if (!validCategories.includes(row.category)) {
        errors.push(`Row ${index + 1}: Invalid category "${row.category}". Must be either "Budget" or "Time"`);
      }
      if (!row.type || !validTypes[row.category]?.includes(row.type)) {
        errors.push(`Row ${index + 1}: Invalid type "${row.type}" for category "${row.category}"`);
      }
      if (isNaN(Number(row.value))) {
        errors.push(`Row ${index + 1}: Invalid value "${row.value}". Must be a number`);
      }
      if (!validMetrics.includes(row.metric)) {
        errors.push(`Row ${index + 1}: Invalid metric "${row.metric}". Must be either "Cost" or "Percentage"`);
      }
      if (row.category === 'Time' && (Number(row.value) < 0 || Number(row.value) > 100)) {
        errors.push(`Row ${index + 1}: Time percentage must be between 0 and 100`);
      }
    });

    return errors;
  };

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const validData = results.data.filter(row => 
            Object.values(row).some(value => value !== undefined && value !== '')
          );
          const validationErrors = validateData(validData);
          setErrors(validationErrors);
          setPreviewData(validData);
          setPreviewDialog(true);
        }
      });
    }
    event.target.value = '';
  }, []);

  const handleImport = () => {
    if (errors.length === 0) {
      const formattedData = previewData
        .filter(row => row.date && row.category && row.value)
        .map((row, index) => ({
          id: Date.now() + index,
          date: new Date(row.date + 'T00:00:00').toISOString().split('T')[0],
          category: row.category,
          value: Number(row.value),
          metric: row.metric
        }));
      onImportCSV(formattedData);
      setPreviewDialog(false);
    }
  };

  const downloadTemplate = () => {
    const blob = new Blob([TEMPLATE_CSV], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <GridToolbarContainer>
        <GridToolbarFilterButton />
        <GridToolbarExport />
        <input
          type="file"
          accept=".csv"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileUpload}
        />
        <Button
          startIcon={<UploadFileIcon />}
          onClick={() => fileInputRef.current.click()}
        >
          Import CSV
        </Button>
        <Tooltip title="Download CSV Template">
          <IconButton onClick={downloadTemplate}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      </GridToolbarContainer>

      <Dialog 
        open={previewDialog} 
        onClose={() => setPreviewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Preview CSV Data</DialogTitle>
        <DialogContent>
          {errors.length > 0 && (
            <Alert 
              severity="error" 
              sx={{ mb: 2 }}
              action={
                <Tooltip title="Download template for reference">
                  <IconButton
                    color="inherit"
                    size="small"
                    onClick={downloadTemplate}
                  >
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
              }
            >
              <Typography variant="subtitle2">Found {errors.length} errors:</Typography>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </Alert>
          )}
          
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>Metric</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {previewData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {errors.some(e => e.startsWith(`Row ${index + 1}:`)) ? (
                        <ErrorIcon color="error" />
                      ) : (
                        <CheckCircleIcon color="success" />
                      )}
                    </TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{row.value}</TableCell>
                    <TableCell>{row.metric}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleImport}
            disabled={errors.length > 0}
            variant="contained"
          >
            Import Data
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function DataGridComponent({ data, onDataUpdate }) {
  const [rows, setRows] = useState(data);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'Budget',
    type: 'Total',
    value: '',
    metric: 'Cost'
  });

  // Update local state when prop changes
  useEffect(() => {
    setRows(data);
  }, [data]);

  const handleAddEntry = () => {
    const newRow = {
      id: Date.now(),
      ...newEntry,
      value: Number(newEntry.value) || 0
    };
    const updatedRows = [...rows, newRow];
    setRows(updatedRows);
    onDataUpdate(updatedRows);
    setAddDialogOpen(false);
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      category: 'Budget',
      type: 'Total',
      value: '',
      metric: 'Cost'
    });
  };

  const handleDeleteRow = useCallback((id) => {
    const updatedRows = rows.filter(row => row.id !== id);
    setRows(updatedRows);
    onDataUpdate(updatedRows);
  }, [rows, onDataUpdate]);

  const handleImportCSV = useCallback((importedData) => {
    const updatedRows = [...rows, ...importedData];
    setRows(updatedRows);
    onDataUpdate(updatedRows);
  }, [rows, onDataUpdate]);

  const handleClearAll = useCallback(() => {
    setRows([]);
    onDataUpdate([]);
  }, [onDataUpdate]);

  const categories = [
    'Budget',
    'Time'
  ];

  const types = {
    'Budget': ['Total', 'Actual'],
    'Time': ['Elapsed']
  };

  const metrics = {
    'Budget': ['Cost'],
    'Time': ['Percentage']
  };

  // Memoize handlers to prevent unnecessary re-renders
  const handleCellEdit = useCallback((params) => {
    const updatedRows = rows.map(row => {
      if (row.id === params.id) {
        const updatedRow = { ...row };
        if (params.field === 'value') {
          updatedRow.value = Number(params.value) || 0;
        } else {
          updatedRow[params.field] = params.value;
        }
        return updatedRow;
      }
      return row;
    });
    setRows(updatedRows);
    onDataUpdate(updatedRows);
  }, [rows, onDataUpdate]);

  const handleSelectionChange = useCallback((newSelection) => {
    // Handle selection change if needed
  }, []);

  const handleDeleteSelected = useCallback(() => {
    // Handle delete selected if needed
  }, []);

  const handleDeleteAll = useCallback(() => {
    // Handle delete all if needed
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { 
      field: 'date', 
      headerName: 'Date', 
      width: 130, 
      editable: true, 
      type: 'date',
      valueFormatter: (params) => {
        if (!params.value) return '';
        return new Date(params.value).toLocaleDateString();
      }
    },
    { 
      field: 'category', 
      headerName: 'Category', 
      width: 130, 
      editable: true,
      type: 'singleSelect',
      valueOptions: categories
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 130,
      editable: true,
      type: 'singleSelect',
      valueOptions: (params) => {
        if (!params?.row?.category) return [];
        return types[params.row.category] || [];
      }
    },
    { 
      field: 'value', 
      headerName: 'Value', 
      width: 130, 
      editable: true, 
      type: 'number',
      valueFormatter: (params) => {
        if (!params.value) return '';
        if (params.row?.metric === 'Cost') {
          return `$${Number(params.value).toLocaleString()}`;
        }
        return params.value;
      }
    },
    { 
      field: 'metric', 
      headerName: 'Metric', 
      width: 130, 
      editable: true,
      type: 'singleSelect',
      valueOptions: (params) => {
        if (!params?.row?.category) return [];
        return metrics[params.row.category] || [];
      }
    },
    { 
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => {
            handleDeleteRow(params.id);
          }}
        />,
      ],
    }
  ];

  return (
    <Box sx={{ height: 400, width: '100%', bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
          variant="contained"
        >
          Add New Entry
        </Button>
        {/* Add delete selected and delete all buttons */}
      </Box>
      
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
        components={{ 
          Toolbar: (props) => <CustomToolbar {...props} onImportCSV={handleImportCSV} />
        }}
        onCellEditCommit={handleCellEdit}
        onSelectionModelChange={handleSelectionChange}
        selectionModel={[]}
        autoHeight
        density="comfortable"
        sx={{
          '& .MuiDataGrid-cell': {
            borderColor: 'rgba(224, 224, 224, 1)',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'rgba(26, 95, 122, 0.08)',
            color: '#1A5F7A',
          }
        }}
      />

      {/* Add Delete All Confirmation Dialog */}
      <Dialog
        open={false}
        onClose={() => {}}
      >
        <DialogTitle>Delete All Data</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete all data entries? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {}}>Cancel</Button>
          <Button 
            onClick={handleClearAll}
            variant="contained"
            color="error"
          >
            Delete All
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add New Data Entry</DialogTitle>
        <DialogContent>
          <TextField
            label="Date"
            type="date"
            value={newEntry.date}
            onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            select
            label="Category"
            value={newEntry.category}
            onChange={(e) => {
              const category = e.target.value;
              setNewEntry({ 
                ...newEntry, 
                category,
                type: '',
                metric: metrics[category]?.[0] || ''
              });
            }}
            fullWidth
            margin="normal"
          >
            {categories.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Type"
            value={newEntry.type}
            onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value })}
            fullWidth
            margin="normal"
            disabled={!newEntry.category}
          >
            {(types[newEntry.category] || []).map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Value"
            type="number"
            value={newEntry.value}
            onChange={(e) => setNewEntry({ ...newEntry, value: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            select
            label="Metric"
            value={newEntry.metric}
            onChange={(e) => setNewEntry({ ...newEntry, metric: e.target.value })}
            fullWidth
            margin="normal"
            disabled={!newEntry.category}
          >
            {(metrics[newEntry.category] || []).map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <Button 
            onClick={handleAddEntry} 
            variant="contained" 
            sx={{ mt: 2 }}
            fullWidth
          >
            Add Entry
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default React.memo(DataGridComponent); 