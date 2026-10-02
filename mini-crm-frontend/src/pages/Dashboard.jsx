import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { fetchDashboardStats } from '../api/dashboard';
import { useToast } from '../context/ToastContext';
import { apiMessage } from '../utils/apiMessage';

const cards = [
  { key: 'totalLeads', label: 'Total Leads' },
  { key: 'qualifiedLeads', label: 'Qualified Leads' },
  { key: 'tasksDueToday', label: 'Tasks Due Today' },
  { key: 'completedTasks', label: 'Completed Tasks' },
];

export default function Dashboard() {
  const toast = useToast();
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
  });

  useEffect(() => {
    if (error) toast.error(apiMessage(error, 'Failed to load stats'));
  }, [error, toast]);

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Dashboard
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
        }}
      >
        {cards.map((card) => (
          <Card key={card.key}>
            <CardContent>
              <Typography color="text.secondary">{card.label}</Typography>
              <Typography variant="h3" sx={{ fontSize: { xs: '2rem', sm: '3rem' } }}>
                {isLoading || error ? '—' : data?.[card.key] ?? 0}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </>
  );
}
