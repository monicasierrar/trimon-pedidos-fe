import { useState } from "react";
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
  Button,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import { Transaccion } from "../api/types";
import { getTransacciones } from "../api/apiClient";
import { useNavigate } from "react-router-dom";

const LogTransaccionesPage = () => {
  const [fechaInicio, setFechaInicio] = useState<Dayjs | null>(null);
  const [fechaFin, setFechaFin] = useState<Dayjs | null>(null);
  const [transaccionesFiltradas, setTransaccionesFiltradas] = useState<
    Transaccion[]
  >([]);
  const navigate = useNavigate();

  const handleBuscar = () => {
    if (fechaInicio && fechaFin) {
      setTransaccionesFiltradas([]);
      getTransacciones(
        `${fechaInicio.format("YYYY-MM-DD")}`,
        `${fechaFin.format("YYYY-MM-DD")}`,
      )
        .then((pedidos) => setTransaccionesFiltradas(pedidos))
        .catch((error) => {
          if (error.status === 401) {
            navigate("/login");
          }
        });
    }
  };

  const getStatusChip = (estado: "Procesado" | "Error" | "Pendiente") => {
    const color = {
      Procesado: "success",
      Error: "error",
      Pendiente: "warning",
    }[estado];
    return (
      <Chip
        label={estado}
        color={color as "success" | "error" | "warning"}
        size="small"
      />
    );
  };

  return (
    <AppLayout>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Stack spacing={3}>
          <Typography variant="h4">Log de Transacciones</Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
          >
            <DatePicker
              format="YYYY-MM-DD"
              label="Fecha de Inicio"
              value={fechaInicio}
              onChange={(newValue) => setFechaInicio(newValue)}
            />
            <DatePicker
              format="YYYY-MM-DD"
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
                    <TableCell>{transaccion.fecha}</TableCell>
                    <TableCell>{transaccion.id}</TableCell>
                    <TableCell align="center">
                      {getStatusChip(transaccion.estado)}
                      {transaccion.mensaje && (
                        <span>{transaccion.mensaje}</span>
                      )}
                    </TableCell>
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
