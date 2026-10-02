import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const DRAWER_WIDTH = 220;

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/leads', label: 'Leads' },
  { to: '/companies', label: 'Companies' },
  { to: '/tasks', label: 'Tasks' },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const initial = (user?.name || 'U').charAt(0).toUpperCase();

  const onLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login', { replace: true });
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar
        sx={{
          px: 2,
          background: 'linear-gradient(135deg, #12324f 0%, #1e3a5f 55%, #2a6f97 100%)',
          color: '#fff',
        }}
      >
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            bgcolor: '#7dd3fc',
            mr: 1.25,
            boxShadow: '0 0 0 4px rgba(125, 211, 252, 0.25)',
          }}
        />
        <Typography variant="subtitle1" fontWeight={800} letterSpacing={0.4} sx={{ color: '#e8f4fc' }}>
          Mini CRM
        </Typography>
      </Toolbar>
      <List sx={{ px: 1, py: 1.5, flexGrow: 1 }}>
        {links.map((link) => (
          <ListItemButton
            key={link.to}
            component={NavLink}
            to={link.to}
            onClick={() => setMobileOpen(false)}
            sx={{
              mb: 0.5,
              borderRadius: 1.5,
              color: '#d7e4ef',
              '&.active': {
                bgcolor: 'rgba(125, 211, 252, 0.18)',
                color: '#fff',
                fontWeight: 700,
                borderLeft: '3px solid #7dd3fc',
              },
              '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
            }}
          >
            <ListItemText primary={link.label} primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', minWidth: 0 }}>
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: { md: DRAWER_WIDTH },
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: '#10263c',
            color: '#fff',
            borderRight: 'none',
          },
        }}
      >
        {drawer}
      </Drawer>
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0, width: '100%' }}>
        <AppBar position="sticky" elevation={1}>
          <Toolbar sx={{ gap: 1, minHeight: { xs: 56, sm: 64 } }}>
            {isMobile ? (
              <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(true)} aria-label="Open menu">
                <MenuIcon />
              </IconButton>
            ) : null}
            <Typography sx={{ flexGrow: 1, display: { xs: 'block', md: 'none' } }} fontWeight={700} noWrap>
              Mini CRM
            </Typography>
            <Box sx={{ flexGrow: { xs: 0, md: 1 } }} />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: 'rgba(255,255,255,0.12)',
                px: { xs: 0.75, sm: 1.25 },
                py: 0.5,
                borderRadius: 5,
                maxWidth: { xs: 150, sm: 260 },
              }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontSize: 14 }}>{initial}</Avatar>
              <Typography noWrap sx={{ fontWeight: 600, display: { xs: 'none', sm: 'block' } }}>
                {user?.name}
              </Typography>
            </Box>
            <Tooltip title="Logout">
              <IconButton color="inherit" onClick={onLogout} aria-label="Logout">
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 1.5, sm: 2, md: 3 },
            bgcolor: 'background.default',
            minWidth: 0,
            width: '100%',
            overflowX: 'hidden',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
