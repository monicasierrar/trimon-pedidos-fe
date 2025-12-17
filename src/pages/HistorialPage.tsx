import { useState, useEffect } from "react";
import { AppLayout } from "../components/AppLayout";
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
  IconButton,
  Box,
  Grow,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/es";
import SearchIcon from "@mui/icons-material/Search";
import { getHistorialPedidos } from "../api/apiClient";
import type { HistorialPedidos } from "../api/types";
import { useNavigate } from "react-router-dom";

const HistorialPage = () => {
  const [fechaInicio, setFechaInicio] = useState<Dayjs | null>(null);
  const [fechaFin, setFechaFin] = useState<Dayjs | null>(null);
  const [pedidosFiltrados, setPedidosFiltrados] = useState<HistorialPedidos[]>(
    [],
  );
  const [animarChips, setAnimarChips] = useState(false);
  const navigate = useNavigate();
  // Validación de fechas
  const fechasValidas =
    !!fechaInicio &&
    !!fechaFin &&
    (fechaFin.isSame(fechaInicio, "day") ||
      fechaFin.isAfter(fechaInicio, "day"));

  // Limpia la tabla automáticamente si las fechas no son válidas
  useEffect(() => {
    if (fechaInicio && fechaFin && fechaFin.isBefore(fechaInicio, "day")) {
      setPedidosFiltrados([]);
    }
  }, [fechaInicio, fechaFin]);

  const getStatusChip = (estado: HistorialPedidos["estado"], index: number) => {
    const colorMap: Record<
      HistorialPedidos["estado"],
      "success" | "info" | "error" | "warning"
    > = {
      Abierto: "success",
      Cerrado: "info",
      Facturado: "error",
      Parcial: "warning",
      Pendiente: "warning",
    };

    return (
      <Grow in={animarChips} timeout={500 + index * 100} key={index}>
        <Chip
          label={estado}
          size="small"
          variant="filled"
          color={colorMap[estado]}
          sx={
            estado === "Pendiente"
              ? { backgroundColor: "#FFD700", color: "black", fontWeight: 500 }
              : estado === "Facturado"
                ? {
                    backgroundColor: "#9C27B0",
                    color: "white",
                    fontWeight: 500,
                  }
                : {}
          }
        />
      </Grow>
    );
  };

  const handleBuscar = async () => {
    if (!fechasValidas) {
      setPedidosFiltrados([]);
      return;
    }

    const inicioStr = fechaInicio!.format("YYYY-MM-DD");
    const finStr = fechaFin!.format("YYYY-MM-DD");

    setPedidosFiltrados([]);

    try {
      const pedidosResultado = await getHistorialPedidos(inicioStr, finStr);

      // Filtrado por día usando dayjs
      const filtrados = pedidosResultado.filter((pedido) => {
        const fechaPedido = dayjs(pedido.fecha);
        return (
          fechaPedido.isSame(fechaInicio!, "day") ||
          fechaPedido.isSame(fechaFin!, "day") ||
          (fechaPedido.isAfter(fechaInicio!, "day") &&
            fechaPedido.isBefore(fechaFin!, "day"))
        );
      });

      setPedidosFiltrados(filtrados);

      setAnimarChips(false);
      setTimeout(() => setAnimarChips(true), 50);
    } catch (error: any) {
      console.error(`Error buscando pedidos: ${error}`);
      if (error.status === 401) {
        navigate("/login");
      }
      setPedidosFiltrados([]);
    }
  };

  return (
    <AppLayout>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Stack spacing={3}>
          <Typography variant="h4">Historial de Pedidos</Typography>

          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems="center"
            >
              <DatePicker
                label="Fecha de Inicio"
                value={fechaInicio}
                onChange={(newValue) => setFechaInicio(newValue)}
                format="YYYY-MM-DD"
              />
              <DatePicker
                label="Fecha de Fin"
                value={fechaFin}
                onChange={(newValue) => setFechaFin(newValue)}
                format="YYYY-MM-DD"
              />
              <IconButton
                color="primary"
                onClick={handleBuscar}
                disabled={!fechasValidas}
              >
                <SearchIcon />
              </IconButton>
            </Stack>
          </LocalizationProvider>

          {fechaInicio && fechaFin && fechaFin.isBefore(fechaInicio, "day") && (
            <Typography variant="body2" color="error">
              La fecha de fin debe ser igual o mayor a la fecha de inicio
            </Typography>
          )}

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
                {pedidosFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Grow in={true} timeout={500}>
                        <Box sx={{ py: 2, color: "#FFD700", fontWeight: 500 }}>
                          No hay pedidos para las fechas seleccionadas
                        </Box>
                      </Grow>
                    </TableCell>
                  </TableRow>
                ) : (
                  pedidosFiltrados.map((pedido, index) => (
                    <TableRow key={pedido.id}>
                      <TableCell align="center">{pedido.fecha}</TableCell>
                      <TableCell align="center">{pedido.id}</TableCell>
                      <TableCell>{pedido.cliente}</TableCell>
                      <TableCell align="right">
                        {pedido.total.toLocaleString("es-CO", {
                          style: "currency",
                          currency: "COP",
                        })}
                      </TableCell>
                      <TableCell align="center">
                        {getStatusChip(pedido.estado, index)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Paper>
    </AppLayout>
  );
};

export default HistorialPage;
