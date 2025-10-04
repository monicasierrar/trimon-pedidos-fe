import { useState } from 'react';
import { AppLayout } from '../components/AppLayout';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Chip,
  Button,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';
import { pedidosMock } from '../data/mocks';
import { Pedido } from '../api/types';

const HistorialPage = () => {
  // 1. Estados para manejar las fechas seleccionadas
  const [fechaInicio, setFechaInicio] = useState<Dayjs | null>(null);
  const [fechaFin, setFechaFin] = useState<Dayjs | null>(null);
  
  // 2. Estado para almacenar el resultado del filtro
  const [pedidosFiltrados, setPedidosFiltrados] = useState<Pedido[]>(pedidosMock);

  // 3. Lógica del filtro que se activa con el botón
  const handleBuscar = () => {
    const pedidosResultado = pedidosMock.filter(pedido => {
      if (!fechaInicio || !fechaFin) return true;
      
      const fechaPedido = new Date(pedido.fecha);
      return fechaPedido >= fechaInicio.startOf('day').toDate() && fechaPedido <= fechaFin.endOf('day').toDate();
    });
    setPedidosFiltrados(pedidosResultado);
  };

  const getStatusChip = (estado: 'Entregado' | 'Enviado' | 'Cancelado') => {
    const color = {
      Entregado: 'success',
      Enviado: 'info',
      Cancelado: 'error',
    }[estado];
    return <Chip label={estado} color={color as 'success' | 'info' | 'error'} size="small" />;
  };

  return (
    <AppLayout>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Stack spacing={3}>
          <Typography variant="h4">Historial de Pedidos</Typography>
          
          {/* 4. Componentes de fecha y botón "Buscar" */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <DatePicker
              label="Fecha de Inicio"
              value={fechaInicio}
              onChange={(newValue) => setFechaInicio(newValue)}
            />
            <DatePicker
              label="Fecha de Fin"
              value={fechaFin}
              onChange={(newValue) => setFechaFin(newValue)}
            />
            <Button 
              variant="contained" 
              onClick={handleBuscar}
              disabled={!fechaInicio || !fechaFin}
            >
              Buscar
            </Button>
          </Stack>

          {/* Tabla que muestra los resultados de 'pedidosFiltrados' */}
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Fecha del Pedido</TableCell>
                  <TableCell align="center">No. Pedido</TableCell>
                  <TableCell align="center">Cliente</TableCell>
                  <TableCell align="center">Total</TableCell>
                  <TableCell align="center">Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pedidosFiltrados.map((pedido) => (
                  <TableRow key={pedido.id}>
                    <TableCell align="center">{new Date(pedido.fecha).toLocaleDateString('es-CO')}</TableCell>
                    <TableCell align="center">{pedido.id}</TableCell>
                    <TableCell>{pedido.cliente}</TableCell>
                    <TableCell align="right">{pedido.total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</TableCell>
                    <TableCell align="center">{getStatusChip(pedido.estado)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Paper>
    </AppLayout>
  );
};

export default HistorialPage;