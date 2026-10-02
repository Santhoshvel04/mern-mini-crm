import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
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
import { createTask, fetchTasks, updateTaskStatus } from '../api/tasks';
import { fetchLeads } from '../api/leads';
import { fetchUsers } from '../api/users';
import { useAuth } from '../context/AuthContext';
import ResponsiveTable from '../components/ResponsiveTable';
import { useToast } from '../context/ToastContext';
import { apiMessage } from '../utils/apiMessage';

const empty = { title: '', lead: '', assignedTo: '', dueDate: '' };

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

export default function TasksPage() {
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);

  const tasksQ = useQuery({ queryKey: ['tasks'], queryFn: fetchTasks });
  const usersQ = useQuery({ queryKey: ['users'], queryFn: fetchUsers });
  const leadsQ = useQuery({
    queryKey: ['leads-options'],
    queryFn: () => fetchLeads({ page: 1, limit: 50 }),
  });

  useEffect(() => {
    if (tasksQ.error) toast.error(apiMessage(tasksQ.error, 'Failed to load tasks'));
  }, [tasksQ.error, toast]);

  const create = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Added successfully');
      setOpen(false);
      setForm(empty);
    },
    onError: (err) => toast.error(apiMessage(err, 'Create failed')),
  });

  const markDone = useMutation({
    mutationFn: (id) => updateTaskStatus(id, 'Done'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Updated successfully');
    },
    onError: (err) => toast.error(apiMessage(err, 'Status update failed')),
  });

  const leads = useMemo(() => leadsQ.data?.data || [], [leadsQ.data]);
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
          Tasks
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            setForm(empty);
            setOpen(true);
          }}
        >
          + Add Task
        </Button>
      </Box>

      <ResponsiveTable>
        <Table size="small" sx={{ minWidth: 720 }}>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Lead</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasksQ.isLoading ? (
              <TableRow>
                <TableCell colSpan={6}>Loading…</TableCell>
              </TableRow>
            ) : (tasksQ.data || []).length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>No tasks</TableCell>
              </TableRow>
            ) : (
              (tasksQ.data || []).map((task) => {
                const canUpdate = task.assignedTo?.id === user?.id;
                return (
                  <TableRow key={task.id}>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.lead?.name || '—'}</TableCell>
                    <TableCell>{task.assignedTo?.name || '—'}</TableCell>
                    <TableCell>{formatDate(task.dueDate)}</TableCell>
                    <TableCell>{task.status}</TableCell>
                    <TableCell>
                      {task.status === 'Done' ? (
                        '—'
                      ) : canUpdate ? (
                        <Button size="small" onClick={() => markDone.mutate(task.id)}>
                          Done
                        </Button>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </ResponsiveTable>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm" fullScreen={fullScreen}>
        <DialogTitle>Create task</DialogTitle>
        <DialogContent>
          <TextField label="Title" fullWidth margin="normal" value={form.title} onChange={set('title')} />
          <TextField select label="Lead" fullWidth margin="normal" value={form.lead} onChange={set('lead')}>
            {leads.map((l) => (
              <MenuItem key={l.id} value={l.id}>
                {l.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Assigned To"
            fullWidth
            margin="normal"
            value={form.assignedTo}
            onChange={set('assignedTo')}
          >
            {(usersQ.data || []).map((u) => (
              <MenuItem key={u.id} value={u.id}>
                {u.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Due Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={form.dueDate}
            onChange={set('dueDate')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={create.isPending}
            onClick={() => {
              if (!form.title.trim() || !form.lead || !form.assignedTo || !form.dueDate) {
                toast.error('All task fields are required');
                return;
              }
              create.mutate({
                title: form.title,
                lead: form.lead,
                assignedTo: form.assignedTo,
                dueDate: new Date(form.dueDate).toISOString(),
              });
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
