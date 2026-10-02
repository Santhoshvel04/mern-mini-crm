import { Paper, TableContainer } from '@mui/material';

export default function ResponsiveTable({ children }) {
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ overflowX: 'auto' }}>{children}</TableContainer>
    </Paper>
  );
}
