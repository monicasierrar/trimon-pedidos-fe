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
import { transaccionesMock, Transaccion } from '../data/mocks';

const LogTransaccionesPage = () => {
  const [fechaInicio, setFechaInicio] = useState<Dayjs | null>(null);
  const [fechaFin, setFechaFin] = useState<Dayjs | null>(null);
  const [transaccionesFiltradas, setTransaccionesFiltradas] = useState<Transaccion[]>(transaccionesMock);

  const handleBuscar = () => {
    const resultado = transaccionesMock.filter(transaccion => {
      if (!fechaInicio || !fechaFin) return true;
      const fechaTransaccion = new Date(transaccion.fecha);
      return fechaTransaccion >= fechaInicio.startOf('day').toDate() && fechaTransaccion <= fechaFin.endOf('day').toDate();
    });
    setTransaccionesFiltradas(resultado);
  };

  const getStatusChip = (estado: 'Procesado' | 'Error' | 'Pendiente') => {
    const color = {
      Procesado: 'success',
      Error: 'error',
      Pendiente: 'warning',
    }[estado];
    return <Chip label={estado} color={color as 'success' | 'error' | 'warning'} size="small" />;
  };

  return (
    <AppLayout>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Stack spacing={3}>
          <Typography variant="h4">Log de Transacciones</Typography>
          
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

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Nº Pedido</TableCell>
                  <TableCell align="center">Estado de la Transacción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transaccionesFiltradas.map((transaccion) => (
                  <TableRow key={transaccion.id}>
                    <TableCell>{new Date(transaccion.fecha).toLocaleDateString('es-CO')}</TableCell>
                    <TableCell>{transaccion.id}</TableCell>
                    <TableCell align="center">{getStatusChip(transaccion.estado)}</TableCell>
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

export default LogTransaccionesPage;