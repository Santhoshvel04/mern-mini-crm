import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  MenuItem,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { deleteLead, fetchLeads } from '../api/leads';
import { LEAD_STATUSES } from '../constants/options';
import ResponsiveTable from '../components/ResponsiveTable';
import LeadFormDialog from '../components/LeadFormDialog';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../context/ToastContext';
import { apiMessage } from '../utils/apiMessage';

export default function LeadsList() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState({ open: false, leadId: null });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const queryKey = useMemo(() => ['leads', { page, search, status }], [page, search, status]);

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => fetchLeads({ page, limit: 10, search, status }),
  });

  useEffect(() => {
    if (error) toast.error(apiMessage(error, 'Failed to load leads'));
  }, [error, toast]);

  const remove = useMutation({
    mutationFn: deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Deleted successfully');
      setDeleteTarget(null);
    },
    onError: (err) => toast.error(apiMessage(err, 'Delete failed')),
  });

  const rows = data?.data || [];
  const meta = data?.meta || { page: 1, pages: 1, total: 0 };

  const applySearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'stretch', sm: 'center' },
          mb: 2,
          gap: 1.5,
          flexWrap: 'wrap',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          Leads
        </Typography>
        <Box
          component="form"
          onSubmit={applySearch}
          sx={{
            display: 'flex',
            gap: 1,
            flexWrap: 'wrap',
            flexGrow: 1,
            '& .MuiTextField-root': { flex: { xs: '1 1 140px', sm: '0 1 180px' } },
          }}
        >
          <TextField
            size="small"
            label="Search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <TextField
            size="small"
            select
            label="Status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            sx={{ minWidth: { xs: 0, sm: 140 } }}
          >
            <MenuItem value="">All</MenuItem>
            {LEAD_STATUSES.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
          <Button type="submit" variant="outlined">
            Search
          </Button>
          <Button
            variant="text"
            onClick={() => {
              setSearchInput('');
              setSearch('');
              setStatus('');
              setPage(1);
            }}
          >
            Clear
          </Button>
        </Box>
        <Button
          variant="contained"
          onClick={() => setDialog({ open: true, leadId: null })}
          sx={{ alignSelf: { xs: 'stretch', md: 'center' } }}
        >
          + Add Lead
        </Button>
      </Box>

      <ResponsiveTable>
        <Table size="small" sx={{ minWidth: 640 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5}>Loading…</TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>No leads found</TableCell>
              </TableRow>
            ) : (
              rows.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>{lead.name}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.status}</TableCell>
                  <TableCell>{lead.assignedTo?.name || '—'}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => setDialog({ open: true, leadId: lead.id })}>
                      Edit
                    </Button>
                    <Button size="small" color="error" onClick={() => setDeleteTarget(lead)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ResponsiveTable>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination
          count={meta.pages || 1}
          page={page}
          onChange={(_, next) => setPage(next)}
          size="small"
          siblingCount={0}
        />
      </Box>

      <LeadFormDialog
        open={dialog.open}
        leadId={dialog.leadId}
        onClose={() => setDialog({ open: false, leadId: null })}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete lead"
        message={deleteTarget ? `Delete ${deleteTarget.name}? This will hide the lead from the list.` : ''}
        confirmLabel="Delete"
        loading={remove.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && remove.mutate(deleteTarget.id)}
      />
    </>
  );
}
