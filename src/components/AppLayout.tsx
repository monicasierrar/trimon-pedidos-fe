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
// Se han eliminado las importaciones de Firebase: useAuthState, signOut, auth

import logo from '../assets/logo.png';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import HistoryIcon from '@mui/icons-material/History';
import SyncAltIcon from '@mui/icons-material/SyncAlt'; 

const drawerWidth = 240;

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // En lugar de useAuthState, ahora verificamos si existe el token de sesión
  const sessionToken = localStorage.getItem('session_token');
  // Suponemos que también guardaremos datos del usuario en localStorage después del login
  const userName = localStorage.getItem('user_name');
  const userAvatar = localStorage.getItem('user_avatar');

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // La nueva función de Logout
  const handleLogout = () => {
    localStorage.removeItem('session_token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_avatar');
    handleClose();
    navigate('/'); // Redirigir a la página de inicio
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <img src={logo} alt="Logo Corporativo" style={{ height: 40, marginRight: '1rem' }} />
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Gestión de Pedidos
          </Typography>
          {/* La condición ahora se basa en la existencia del token de sesión */}
          {sessionToken && (
            <div>
              <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                {/* Usamos los datos del usuario guardados en localStorage */}
                <Avatar alt={userName || ''} src={userAvatar || ''} />
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
                  {/* Mostramos el nombre guardado */}
                  <Typography variant="body1">{userName}</Typography>
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
            <ListItemButton selected={location.pathname === '/'} onClick={() => navigate('/')}>
              <ListItemIcon>
                <PointOfSaleIcon />
              </ListItemIcon>
              <ListItemText primary="Pedidos" />
            </ListItemButton>
            
            <ListItemButton selected={location.pathname === '/historial'} onClick={() => navigate('/historial')}>
              <ListItemIcon>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText primary="Historial" />
            </ListItemButton>
            
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