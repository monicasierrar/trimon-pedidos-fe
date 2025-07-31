import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Divider,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import logo from '../assets/logo.png';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import HistoryIcon from '@mui/icons-material/History';
import SyncAltIcon from '@mui/icons-material/SyncAlt'; 

const drawerWidth = 240;

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // const [user] = useAuthState(auth);
  const user = {
    displayName: 'John Doe',
    photoURL: ''
  }
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  
  // Hooks para la navegación
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <img src={logo} alt="Logo Corporativo" style={{ height: 40, marginRight: '1rem' }} />
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Gestión de Pedidos
          </Typography>
          {user && (
            <div>
              <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                <Avatar alt={user.displayName || ''} src={user.photoURL || ''} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{ mt: '45px' }}
              >
                <MenuItem disabled>
                  <Typography variant="body1">{user.displayName}</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {/* Menú de Pedidos */}
            <ListItemButton selected={location.pathname === '/'} onClick={() => navigate('/')}>
              <ListItemIcon>
                <PointOfSaleIcon />
              </ListItemIcon>
              <ListItemText primary="Pedidos" />
            </ListItemButton>
            
            {/* Menú de Historial */}
            <ListItemButton selected={location.pathname === '/historial'} onClick={() => navigate('/historial')}>
              <ListItemIcon>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText primary="Historial" />
            </ListItemButton>
            
            {/* 2. Añade el nuevo botón para el Log de Transacciones */}
            <ListItemButton selected={location.pathname === '/log-transacciones'} onClick={() => navigate('/log-transacciones')}>
              <ListItemIcon><SyncAltIcon /></ListItemIcon>
              <ListItemText primary="Log de Transacciones" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};