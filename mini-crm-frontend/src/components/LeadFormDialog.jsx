import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { createLead, fetchLead, updateLead } from '../api/leads';
import { fetchCompanies } from '../api/companies';
import { fetchUsers } from '../api/users';
import { LEAD_STATUSES } from '../constants/options';
import { useToast } from '../context/ToastContext';
import { apiMessage } from '../utils/apiMessage';

const empty = {
  name: '',
  email: '',
  phone: '',
  status: 'New',
  assignedTo: '',
  company: '',
};

export default function LeadFormDialog({ open, leadId, onClose }) {
  const isEdit = Boolean(leadId);
  const toast = useToast();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [form, setForm] = useState(empty);
  const [fieldErrors, setFieldErrors] = useState({});

  const usersQ = useQuery({ queryKey: ['users'], queryFn: fetchUsers, enabled: open });
  const companiesQ = useQuery({ queryKey: ['companies'], queryFn: fetchCompanies, enabled: open });
  const leadQ = useQuery({
    queryKey: ['lead', leadId],
    queryFn: () => fetchLead(leadId),
    enabled: open && isEdit,
  });

  useEffect(() => {
    if (!open) return;
    setFieldErrors({});
    if (!isEdit) {
      setForm(empty);
      return;
    }
    if (leadQ.data) {
      setForm({
        name: leadQ.data.name || '',
        email: leadQ.data.email || '',
        phone: leadQ.data.phone || '',
        status: leadQ.data.status || 'New',
        assignedTo: leadQ.data.assignedTo?.id || '',
        company: leadQ.data.company?.id || '',
      });
    }
  }, [open, isEdit, leadQ.data]);

  const save = useMutation({
    mutationFn: (payload) => (isEdit ? updateLead(leadId, payload) : createLead(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success(isEdit ? 'Updated successfully' : 'Added successfully');
      onClose();
    },
    onError: (err) => toast.error(apiMessage(err, 'Save failed')),
  });

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    if (!form.assignedTo) next.assignedTo = 'Assigned To is required';
    if (!form.company) next.company = 'Company is required';
    setFieldErrors(next);
    if (Object.keys(next).length) {
      toast.error('Please fill required fields');
      return false;
    }
    return true;
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" fullScreen={fullScreen}>
      <DialogTitle>{isEdit ? 'Edit Lead' : 'Add Lead'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={form.name}
          onChange={set('name')}
          error={Boolean(fieldErrors.name)}
          helperText={fieldErrors.name}
        />
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={form.email}
          onChange={set('email')}
          error={Boolean(fieldErrors.email)}
          helperText={fieldErrors.email}
        />
        <TextField label="Phone" fullWidth margin="normal" value={form.phone} onChange={set('phone')} />
        <TextField select label="Status" fullWidth margin="normal" value={form.status} onChange={set('status')}>
          {LEAD_STATUSES.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
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
          error={Boolean(fieldErrors.assignedTo)}
          helperText={fieldErrors.assignedTo}
        >
          {(usersQ.data || []).map((u) => (
            <MenuItem key={u.id} value={u.id}>
              {u.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Company"
          fullWidth
          margin="normal"
          value={form.company}
          onChange={set('company')}
          error={Boolean(fieldErrors.company)}
          helperText={fieldErrors.company}
        >
          {(companiesQ.data || []).map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.name}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" disabled={save.isPending} onClick={() => validate() && save.mutate(form)}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
