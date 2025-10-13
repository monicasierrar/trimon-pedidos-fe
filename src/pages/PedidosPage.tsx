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
  const [enviandoPedido, setEnviandoPedido] = useState(false);
  const [abrirDialogo, setAbrirDialogo] = useState(false);

  const [fechaPedido, setFechaPedido] = useState('');
  const [notificacion, setNotificacion] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info',
  });

  // 🔹 Cargar clientes
  useEffect(() => {
    getClients(localStorage.getItem("session_token") || "" )
      .then((clients) => setListaClientes(clients))
      .catch((err) => console.error('Error fetching clients:', err));
  }, []);

  // 🔹 Cargar productos según cliente
  useEffect(() => {
    if (clienteSeleccionado) {
      setCargandoProductos(true);
      setListaProductos([]);
      setProductosDelPedido([]);

      getProducts(localStorage.getItem('session_token') || '', clienteSeleccionado.nit, clienteSeleccionado.sucursal.toString())
        .then((productos) => {
          setListaProductos(productos);
          setNotificacion({
            open: true,
            message: '✅ Productos cargados correctamente',
            severity: 'success',
          });
        })
        .catch(() => {
          setNotificacion({
            open: true,
            message: '❌ Error al cargar productos',
            severity: 'error',
          });
        })
        .finally(() => setCargandoProductos(false));
    } else {
      setListaProductos([]);
      setProductosDelPedido([]);
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

  // 🔹 Agregar producto con validación de duplicados y stock
  const handleAddProducto = (producto: Producto | null) => {
    if (!producto) return;

    const existe = productosDelPedido.some((p) => p.id === producto.id);
    if (existe) {
      setNotificacion({
        open: true,
        message: `⚠️ El producto ${producto.nombre} ya fue agregado.`,
        severity: 'info',
      });
      return;
    }

    if (producto.stock <= 0) {
      setNotificacion({
        open: true,
        message: `❌ El producto ${producto.nombre} no tiene stock disponible.`,
        severity: 'error',
      });
      return;
    }

    setProductosDelPedido([...productosDelPedido, { ...producto, cantidad: 1 }]);
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
        message: `⚠️ No puedes pedir más de ${producto.stock} unidades de ${producto.nombre}.`,
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
    (total, p) => total + p.precio * p.cantidad * (p.porcentajeImpuesto / 100),
    0
  );
  const totalPedido = subtotalPedido + ivaTotal;

  // 🔹 Confirmar envío
  const handleConfirmarEnvio = () => setAbrirDialogo(true);
  const handleCancelarEnvio = () => setAbrirDialogo(false);

  const handleEnviarPedido = async () => {
    if (!clienteSeleccionado) return;

    setEnviandoPedido(true);
    setAbrirDialogo(false);

    const fechaHoy = new Date().toISOString().split('T')[0];

    const pedidoJson = {
      nit: clienteSeleccionado.nit,
      sucursal: clienteSeleccionado.sucursal,
      fecha: fechaHoy,
      comentarios: comentarios || '',
      subtotal: subtotalPedido,
      iva: ivaTotal,
      total: totalPedido,
      detalle: productosDelPedido.map((p) => ({
        idproducto: p.codigo,
        cantidad: p.cantidad,
        valor_unitario: p.precio,
        valor_total: p.precio * p.cantidad,
        porciva: p.porcentajeImpuesto,
      })),
    };

    console.log('🚩 Pedido JSON generado:', pedidoJson);

    // 🔹 Bloque preparado para integración con n8n (comentado)
    /*
    try {
      const response = await fetch('https://tu-flujo-n8n-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedidoJson),
      });
      const result = await response.json();
      console.log('Respuesta del servidor:', result);
    } catch (error) {
      console.error('Error enviando pedido:', error);
    }
    */

    setTimeout(() => {
      setEnviandoPedido(false);
      setClienteSeleccionado(null);
      setProductosDelPedido([]);
      setComentarios('');

      setNotificacion({
        open: true,
        message: '✅ Pedido enviado correctamente al servidor.',
        severity: 'success',
      });
    }, 1500);
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
                getOptionLabel={(option) => `${option.razonSocial} - NIT: ${option.nit}`}
                onChange={(_, value) => setClienteSeleccionado(value)}
                renderInput={(params) => <TextField {...params} label="Buscar Cliente" />}
                isOptionEqualToValue={(option, value) => option.id === value.id}
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
                      {cargandoProductos ? <CircularProgress color="inherit" size={20} /> : null}
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
                            inputProps={{ min: 1, max: p.stock, style: { textAlign: 'center' } }}
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

                {/* Totales */}
                {productosDelPedido.length > 0 && (
                  <>
                    <TableRow sx={{ '& > td': { border: 0 } }}>
                      <TableCell colSpan={5} />
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>SUBTOTAL:</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {subtotalPedido.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow sx={{ '& > td': { border: 0 } }}>
                      <TableCell colSpan={5} />
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>TOTAL IVA:</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {ivaTotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow sx={{ '& > td': { border: 0 } }}>
                      <TableCell colSpan={5} />
                      <TableCell align="right">
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          TOTAL:
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {totalPedido.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Comentarios */}
          {productosDelPedido.length > 0 && (
            <TextField
              label="Comentarios"
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value.slice(0, 80))}
              helperText={`${comentarios.length}/80`}
              multiline
              rows={2}
              fullWidth
            />
          )}

          {/* Botón */}
          <Stack direction="row" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmarEnvio}
              disabled={productosDelPedido.length === 0 || !clienteSeleccionado || enviandoPedido}
              startIcon={enviandoPedido ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            >
              {enviandoPedido ? 'Enviando...' : 'Enviar Pedido'}
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Diálogo de confirmación */}
      <Dialog open={abrirDialogo} onClose={handleCancelarEnvio}>
        <DialogTitle>Confirmar Envío</DialogTitle>
        <DialogContent>
          <Typography>
            <strong>Cliente:</strong> {clienteSeleccionado?.razonSocial}
          </Typography>
          <Typography>
            <strong>Total:</strong>{' '}
            {totalPedido.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
          </Typography>
          {comentarios && <Typography><strong>Comentarios:</strong> {comentarios}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelarEnvio} color="inherit">Cancelar</Button>
          <Button onClick={handleEnviarPedido} color="primary" variant="contained">
            Confirmar Envío
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notificaciones */}
      <Snackbar
        open={notificacion.open}
        autoHideDuration={4000}
        onClose={() => setNotificacion({ ...notificacion, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={notificacion.severity} sx={{ width: '100%' }} variant="filled">
          {notificacion.message}
        </Alert>
      </Snackbar>
    </AppLayout>
  );
};

export default PedidosPage;
