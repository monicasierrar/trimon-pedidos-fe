import { useState, useEffect } from 'react';
import { AppLayout } from '../components/AppLayout';
import {
  Autocomplete,
  TextField,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Snackbar,
  Alert,
  Paper,
  Stack,
  Box,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { Cliente, PedidoProducto, Producto } from '../api/types';
import { getClients, getProducts } from '../api/apiClient';

const PedidosPage = () => {
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [productosDelPedido, setProductosDelPedido] = useState<PedidoProducto[]>([]);
  const [listaClientes, setListaClientes] = useState<Cliente[]>([]);
  const [listaProductos, setListaProductos] = useState<Producto[]>([]);
  const [cargandoProductos, setCargandoProductos] = useState(false);
  const [comentarios, setComentarios] = useState('');
  const [openConfirm, setOpenConfirm] = useState(false);

  const [fechaPedido, setFechaPedido] = useState('');
  const [notificacion, setNotificacion] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // 🔹 Cargar clientes
  useEffect(() => {
    getClients(localStorage.getItem("session_token") || "")
      .then((clients) => setListaClientes(clients))
      .catch((err) => console.error('Error fetching clients:', err));
  }, []);

  // 🔹 Cargar productos según cliente
  useEffect(() => {
    setCargandoProductos(true);
    if (clienteSeleccionado) {
      getProducts(localStorage.getItem('session_token') || '', clienteSeleccionado.nit, clienteSeleccionado.sucursal.toString())
        .then((products) => setListaProductos(products))
        .catch((err) => console.error('Error fetching products:', err))
        .finally(()=>setCargandoProductos(false));
    } else {
      setListaProductos([]);
      setProductosDelPedido([]);
      setCargandoProductos(false);
    }
  }, [clienteSeleccionado]);

  // 🔹 Fecha del pedido
  useEffect(() => {
    setFechaPedido(
      new Date().toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    );
  }, []);

  // 🔹 Agregar producto con validación de stock
  const handleAddProducto = (producto: Producto | null) => {
    if (producto && !productosDelPedido.find((p) => p.id === producto.id)) {
      if (producto.stock <= 0) {
        setNotificacion({
          open: true,
          message: `❌ El producto ${producto.nombre} no tiene stock disponible`,
          severity: 'error',
        });
        return;
      }
      setProductosDelPedido([...productosDelPedido, { ...producto, cantidad: 1 }]);
    }
  };

  // 🔹 Actualizar cantidad con validación
  const handleUpdateCantidad = (id: number, cantidad: number) => {
    const producto = productosDelPedido.find((p) => p.id === id);
    if (!producto) return;

    let nuevaCantidad = Math.max(1, cantidad);
    if (nuevaCantidad > producto.stock) {
      nuevaCantidad = producto.stock;
      setNotificacion({
        open: true,
        message: `⚠️ No puedes pedir más de ${producto.stock} unidades de ${producto.nombre}`,
        severity: 'error',
      });
    }

    setProductosDelPedido(
      productosDelPedido.map((p) =>
        p.id === id ? { ...p, cantidad: nuevaCantidad } : p
      )
    );
  };

  const handleRemoveProducto = (id: number) => {
    setProductosDelPedido(productosDelPedido.filter((p) => p.id !== id));
  };

  // 🔹 Totales
  const subtotalPedido = productosDelPedido.reduce(
    (total, p) => total + p.precio * p.cantidad,
    0
  );
  const ivaTotal = productosDelPedido.reduce(
    (total, p) => total + (p.precio * p.cantidad * (p.porcentajeImpuesto / 100)),
    0
  );
  const totalPedido = subtotalPedido + ivaTotal;

  // 🔹 Limpiar formulario
  const resetForm = () => {
    setClienteSeleccionado(null);
    setProductosDelPedido([]);
    setComentarios('');
  };

  // 🔹 Confirmación y envío del pedido
  const handleEnviarPedidoConfirmado = async () => {
    try {
      const pedidoJson = {
        fecha: new Date().toISOString().split('T')[0],
        nit: clienteSeleccionado?.nit || '',
        sucursal: clienteSeleccionado?.sucursal || '',
        comentarios: comentarios.trim(),
        subtotal: subtotalPedido,
        iva: ivaTotal,
        total: totalPedido,
        detalle: productosDelPedido.map((p, idx) => ({
          cantidad: p.cantidad,
          idproducto: p.codigo,
          precio: p.precio,
          codimp: p.codImpuesto,
          idunidad: p.unidad,
          porciva: p.porcentajeImpuesto,
          subtotal: p.precio * p.cantidad,
          iva: p.precio * p.cantidad * (p.porcentajeImpuesto / 100),
          pos: idx + 1,
        })),
      };

      console.log('✅ Pedido listo para enviar a n8n:', pedidoJson);

      // 🔹 Simulación de envío exitoso (con pequeño delay)
      await new Promise((resolve) => setTimeout(resolve, 800));

      setNotificacion({
        open: true,
        message: `✅ Pedido enviado correctamente al servidor\nCliente: ${clienteSeleccionado?.razonSocial}\nTotal: ${totalPedido.toLocaleString('es-CO', {
          style: 'currency',
          currency: 'COP',
        })}`,
        severity: 'success',
      });
      resetForm();
    } catch (error: any) {
      setNotificacion({
        open: true,
        message: `❌ Error al enviar el pedido\n${error?.message || 'Error desconocido'}`,
        severity: 'error',
      });
    } finally {
      setOpenConfirm(false);
    }
  };

  return (
    <AppLayout>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Stack spacing={3}>
          <Typography variant="h4">Crear Nuevo Pedido</Typography>

          {/* Cliente y Fecha */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <Box sx={{ width: { xs: '100%', md: '66.67%' } }}>
              <Autocomplete
                options={listaClientes}
                getOptionLabel={(option) =>
                  `${option.razonSocial} - NIT: ${option.nit}`
                }
                onChange={(_, value) => setClienteSeleccionado(value)}
                renderInput={(params) => (
                  <TextField {...params} label="Buscar Cliente" />
                )}
                isOptionEqualToValue={(option, value) =>
                  option.id === value.id
                }
                value={clienteSeleccionado}
              />
            </Box>
            <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
              <TextField
                label="Fecha del Pedido"
                value={fechaPedido}
                fullWidth
                InputProps={{ readOnly: true }}
              />
            </Box>
          </Stack>

          {/* Info cliente */}
          {clienteSeleccionado && (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {clienteSeleccionado.razonSocial}
                </Typography>
                <Typography color="textSecondary" variant="body2">
                  <strong>NIT:</strong> {clienteSeleccionado.nit}
                </Typography>
                <Typography color="textSecondary" variant="body2">
                  <strong>Sucursal:</strong> {clienteSeleccionado.sucursal}
                </Typography>
                <Typography color="textSecondary" variant="body2">
                  <strong>Dirección:</strong> {clienteSeleccionado.direccion}
                </Typography>
                <Typography color="textSecondary" variant="body2">
                  <strong>Ubicación:</strong> {clienteSeleccionado.ciudad}, {clienteSeleccionado.departamento}
                </Typography>
              </CardContent>
            </Card>
          )}

          <Divider />

          {/* Productos */}
          <Autocomplete
            options={listaProductos}
            getOptionLabel={(option) => option.codigo}
            onChange={(_, value) => handleAddProducto(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Agregar Producto al Pedido"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {cargandoProductos ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            disabled={!clienteSeleccionado || cargandoProductos}
          />

          {/* Tabla */}
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell align="right">Valor Unit.</TableCell>
                  <TableCell align="center">Cantidad</TableCell>
                  <TableCell align="right">Valor Total</TableCell>
                  <TableCell align="right">IVA</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                  <TableCell align="center">Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productosDelPedido.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Agrega productos para comenzar
                    </TableCell>
                  </TableRow>
                ) : (
                  productosDelPedido.map((p) => {
                    const valorTotal = p.precio * p.cantidad;
                    const ivaProd = valorTotal * (p.porcentajeImpuesto / 100);
                    return (
                      <TableRow key={p.id}>
                        <TableCell>{p.codigo} - {p.nombre}</TableCell>
                        <TableCell align="right">
                          {p.precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            type="number"
                            value={p.cantidad}
                            onChange={(e) =>
                              handleUpdateCantidad(p.id, parseInt(e.target.value, 10))
                            }
                            inputProps={{
                              min: 1,
                              max: p.stock,
                              style: { textAlign: 'center' },
                            }}
                            sx={{ width: '80px' }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {valorTotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                        </TableCell>
                        <TableCell align="right">
                          {ivaProd.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                        </TableCell>
                        <TableCell align="right">
                          {(valorTotal + ivaProd).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton color="error" onClick={() => handleRemoveProducto(p.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Totales y comentarios */}
          {productosDelPedido.length > 0 && (
            <>
              <Box textAlign="right" sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  SUBTOTAL: {subtotalPedido.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  TOTAL IVA: {ivaTotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  TOTAL: {totalPedido.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                </Typography>
              </Box>

              <TextField
                label="Comentarios (opcional)"
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value.slice(0, 80))}
                helperText={`${comentarios.length}/80 caracteres`}
                fullWidth
                multiline
              />
            </>
          )}

          {/* Botón enviar */}
          <Stack direction="row" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenConfirm(true)}
              disabled={productosDelPedido.length === 0 || !clienteSeleccionado}
              startIcon={<SendIcon />}
            >
              Enviar Pedido
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Confirmación */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirmar envío</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Deseas enviar este pedido al servidor?  
            Una vez enviado, no podrás modificarlo.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancelar</Button>
          <Button onClick={handleEnviarPedidoConfirmado} variant="contained" color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notificaciones */}
      <Snackbar
        open={notificacion.open}
        autoHideDuration={5000}
        onClose={() => setNotificacion({ ...notificacion, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={notificacion.severity} sx={{ whiteSpace: 'pre-line', width: '100%' }} variant="filled">
          {notificacion.message}
        </Alert>
      </Snackbar>
    </AppLayout>
  );
};

export default PedidosPage;
