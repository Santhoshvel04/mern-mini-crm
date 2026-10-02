import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { createCompany, fetchCompanies } from '../api/companies';
import ResponsiveTable from '../components/ResponsiveTable';
import { useToast } from '../context/ToastContext';
import { apiMessage } from '../utils/apiMessage';

const empty = { name: '', industry: '', location: '' };

export default function CompaniesList() {
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);

  const { data = [], isLoading, error: loadError } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies,
  });

  useEffect(() => {
    if (loadError) toast.error(apiMessage(loadError, 'Failed to load companies'));
  }, [loadError, toast]);

  const save = useMutation({
    mutationFn: createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Added successfully');
      setOpen(false);
      setForm(empty);
    },
    onError: (err) => toast.error(apiMessage(err, 'Create failed')),
  });

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'stretch', sm: 'center' },
          mb: 2,
          gap: 1.5,
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          Companies
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            setForm(empty);
            setOpen(true);
          }}
        >
          + Add Company
        </Button>
      </Box>

      <ResponsiveTable>
        <Table size="small" sx={{ minWidth: 480 }}>
          <TableHead>
            <TableRow>
              <TableCell>Company Name</TableCell>
              <TableCell>Industry</TableCell>
              <TableCell>Location</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3}>Loading…</TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>No companies</TableCell>
              </TableRow>
            ) : (
              data.map((c) => (
                <TableRow
                  key={c.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/companies/${c.id}`)}
                >
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.industry}</TableCell>
                  <TableCell>{c.location}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ResponsiveTable>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm" fullScreen={fullScreen}>
        <DialogTitle>Create company</DialogTitle>
        <DialogContent>
          <TextField label="Company Name" fullWidth margin="normal" value={form.name} onChange={set('name')} />
          <TextField label="Industry" fullWidth margin="normal" value={form.industry} onChange={set('industry')} />
          <TextField label="Location" fullWidth margin="normal" value={form.location} onChange={set('location')} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (!form.name.trim() || !form.industry.trim() || !form.location.trim()) {
                toast.error('All fields are required');
                return;
              }
              save.mutate(form);
            }}
            disabled={save.isPending}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
