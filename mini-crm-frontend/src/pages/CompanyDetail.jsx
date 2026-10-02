import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Box, Button, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { fetchCompany } from '../api/companies';
import ResponsiveTable from '../components/ResponsiveTable';
import { useToast } from '../context/ToastContext';
import { apiMessage } from '../utils/apiMessage';

export default function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { data, isLoading, error } = useQuery({
    queryKey: ['company', id],
    queryFn: () => fetchCompany(id),
  });

  useEffect(() => {
    if (error) toast.error(apiMessage(error, 'Failed to load company'));
  }, [error, toast]);

  if (isLoading) return <Typography>Loading…</Typography>;
  if (error) return <Button onClick={() => navigate('/companies')}>Back to companies</Button>;

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'stretch', sm: 'center' },
          mb: 2,
          gap: 1,
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          Company Detail
        </Typography>
        <Button onClick={() => navigate('/companies')}>Back</Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3, overflowWrap: 'anywhere' }}>
        <Typography><strong>Company Name:</strong> {data.name}</Typography>
        <Typography><strong>Industry:</strong> {data.industry}</Typography>
        <Typography><strong>Location:</strong> {data.location}</Typography>
      </Paper>

      <Typography variant="h6" sx={{ mb: 1 }}>
        Associated Leads
      </Typography>
      <ResponsiveTable>
        <Table size="small" sx={{ minWidth: 560 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned To</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(data.leads || []).length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>No associated leads</TableCell>
              </TableRow>
            ) : (
              data.leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>{lead.name}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.status}</TableCell>
                  <TableCell>{lead.assignedTo?.name || '—'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ResponsiveTable>
    </>
  );
}
