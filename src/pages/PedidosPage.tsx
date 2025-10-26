// PedidosPage con búsqueda por cliente y productos
import React, { useState } from "react";
import { AppLayout } from "../components/AppLayout";
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
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Cliente,
  CrearPedido,
  PedidoProducto,
  Producto,
  ProductoPedido,
} from "../api/types";
import { getClients, getProducts, guardarPedido } from "../api/apiClient";

const PedidosPage: React.FC = () => {
  // Estados principales
  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<Cliente | null>(null);
  const [listaClientes, setListaClientes] = useState<Cliente[]>([]);
  const [listaProductos, setListaProductos] = useState<Producto[]>([]);
  const [productosDelPedido, setProductosDelPedido] = useState<
    PedidoProducto[]
  >([]);
  const [comentarios, setComentarios] = useState("");
  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [buscandoClientes, setBuscandoClientes] = useState(false);
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [buscandoProductos, setBuscandoProductos] = useState(false);
  const [mostrarListaClientes, setMostrarListaClientes] = useState(false);

  // Notificaciones
  const [notificacion, setNotificacion] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info",
  });

  // Diálogo de confirmación / envío
  const [abrirDialogo, setAbrirDialogo] = useState(false);
  const [enviandoPedido, setEnviandoPedido] = useState(false);

  // Derivado: habilitar productos sólo cuando hay cliente y listaProductos cargada
  const productosHabilitados =
    !!clienteSeleccionado && listaProductos.length > 0;

  // -------- Función: limpiar TODO al volver al estado inicial --------
  const resetToInitial = () => {
    setClienteSeleccionado(null);
    setListaClientes([]);
    setListaProductos([]);
    setProductosDelPedido([]);
    setComentarios("");
    setBusquedaCliente("");
    setBusquedaProducto("");
    setMostrarListaClientes(false);
    setNotificacion({ open: false, message: "", severity: "success" });
  };

  // -------- Buscar clientes (al presionar lupa) --------
  const handleBuscarClientes = async () => {
    const termino = busquedaCliente.trim().toUpperCase();

    if (termino.length < 3) {
      setNotificacion({
        open: true,
        message: "Ingrese al menos 3 letras para buscar.",
        severity: "info",
      });
      return;
    }

    // Limpieza completa antes de la búsqueda
    setClienteSeleccionado(null);
    setListaProductos([]);
    setProductosDelPedido([]);
    setComentarios("");
    setMostrarListaClientes(false);
    setListaClientes([]);

    setBuscandoClientes(true);
    try {
      const token = localStorage.getItem("session_token") || "";
      const clientes = await getClients(token, termino);
      setListaClientes(clientes || []);
      setMostrarListaClientes(true);

      if (!clientes || clientes.length === 0) {
        setNotificacion({
          open: true,
          message: "No se encontraron clientes con el criterio de búsqueda.",
          severity: "info",
        });
      }
    } catch (error) {
      console.error(`Error consultando clientes ${error}`);
      setNotificacion({
        open: true,
        message: "No existen clientes con el criterio de búsqueda.",
        severity: "error",
      });
    } finally {
      setBuscandoClientes(false);
    }
  };

  // -------- Al seleccionar cliente --------
  const handleSeleccionarCliente = (cliente: Cliente) => {
    setClienteSeleccionado(cliente);
    setListaClientes([]);
    setMostrarListaClientes(false);
    setBusquedaCliente(`${cliente.razonSocial} - ${cliente.nit}`);
    setListaProductos([]);
    setProductosDelPedido([]);
    setBusquedaProducto("");
    setComentarios("");
  };

  // -------- Buscar productos (al presionar lupa) --------
  const handleBuscarProductos = async () => {
    if (!clienteSeleccionado) return;

    const termino = busquedaProducto.trim().toUpperCase();
    if (termino.length < 3) {
      setNotificacion({
        open: true,
        message: "Ingrese al menos 3 letras para buscar productos.",
        severity: "info",
      });
      return;
    }

    setBuscandoProductos(true);
    setListaProductos([]);

    try {
      const token = localStorage.getItem("session_token") || "";
      const productos = await getProducts(
        token,
        clienteSeleccionado.nit,
        clienteSeleccionado.sucursal.toString(),
        termino,
      );
      setListaProductos(productos || []);
      if (!productos || productos.length === 0) {
        setNotificacion({
          open: true,
          message: "No se encontraron productos con el criterio de búsqueda.",
          severity: "info",
        });
      }
    } catch (error) {
      console.error(`Error obteniendo productos: ${error}`);
      setNotificacion({
        open: true,
        message: "No existen productos con el criterio de búsqueda.",
        severity: "error",
      });
    } finally {
      setBuscandoProductos(false);
    }
  };

  // -------- Agregar producto al pedido --------
  const handleAddProducto = (producto: Producto | null) => {
    if (!producto) return;
    const existe = productosDelPedido.some((p) => p.codigo === producto.codigo);
    if (existe) {
      setNotificacion({
        open: true,
        message: "El producto ya fue agregado.",
        severity: "info",
      });
      return;
    }

    if (producto.stock && producto.stock <= 0) {
      setNotificacion({
        open: true,
        message: "El producto no tiene stock disponible.",
        severity: "error",
      });
      return;
    }

    setProductosDelPedido([
      ...productosDelPedido,
      { ...producto, cantidad: "" },
    ]);
  };

  // -------- Actualizar cantidad --------
  const handleUpdateCantidad = (codigo: string, cantidad: string) => {
    const productosPedido = [...productosDelPedido];
    const producto = productosPedido.find((p) => p.codigo === codigo);
    if (!producto) return;
    producto.cantidad = cantidad;
    setProductosDelPedido(productosPedido);
  };

  // -------- Remover producto --------
  const handleRemoveProducto = (codigo: string) => {
    const items = productosDelPedido.filter((item) => item.codigo !== codigo);
    setProductosDelPedido(items);
  };

  const { subtotalPedido, ivaTotal } = productosDelPedido.reduce(
    (totals, item) => {
      const costoProducto = item.precio * Number(item.cantidad);
      const ivaProducto = costoProducto * (item.porcentajeImpuesto / 100);

      totals.subtotalPedido += costoProducto;
      totals.ivaTotal += ivaProducto;

      return totals;
    },
    { subtotalPedido: 0, ivaTotal: 0 },
  );

  const totalPedido = subtotalPedido + ivaTotal;

  // -------- Envío del pedido --------
  const handleConfirmarEnvio = () => setAbrirDialogo(true);
  const handleCancelarEnvio = () => setAbrirDialogo(false);

  const handleEnviarPedido = async () => {
    if (!clienteSeleccionado) {
      setNotificacion({
        open: true,
        message: "Selecciona un cliente antes de enviar.",
        severity: "info",
      });
      return;
    }

    if (productosDelPedido.length === 0) {
      setNotificacion({
        open: true,
        message: "Agrega al menos un producto al pedido.",
        severity: "info",
      });
      return;
    }

    if (
      productosDelPedido.filter((item) => Number(item.cantidad) <= 0).length
    ) {
      setNotificacion({
        open: true,
        message: "Tiene un producto con cantidad inválida",
        severity: "info",
      });
      return;
    }

    setEnviandoPedido(true);
    setAbrirDialogo(false);

    const pedido: CrearPedido = {
      comentarios: comentarios || "",
      nit: clienteSeleccionado.nit,
      idsuc: clienteSeleccionado.sucursal,
      productos: productosDelPedido.map(
        (p) =>
          ({
            idProducto: p.codigo,
            cantidad: p.cantidad,
          }) as ProductoPedido,
      ),
    };

    try {
      const token = localStorage.getItem("session_token") || "";
      const response = await guardarPedido(token, pedido);
      if (response && response.pedido) {
        resetToInitial();
        setNotificacion({
          open: true,
          message: `Pedido ${response.pedido.id} enviado correctamente.`,
          severity: "success",
        });
      } else {
        setNotificacion({
          open: true,
          message: "No se pudo enviar el pedido.",
          severity: "error",
        });
      }
    } catch (error) {
      console.error(`Error enviando el pedido ${error}`);
      setNotificacion({
        open: true,
        message: "Error al enviar el pedido.",
        severity: "error",
      });
    } finally {
      setEnviandoPedido(false);
    }
  };

  // -------- Render --------
  return (
    <AppLayout>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Stack spacing={3}>
          <Typography variant="h4">Crear Nuevo Pedido</Typography>

          {/* Mensaje guía */}
          {!clienteSeleccionado &&
            productosDelPedido.length === 0 &&
            listaClientes.length === 0 && (
              <Typography variant="body2" color="textSecondary">
                Seleccione un cliente para iniciar un pedido
              </Typography>
            )}

          {/* Búsqueda de cliente */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems="center"
          >
            <TextField
              label="Ingrese al menos 3 letras del nombre del cliente"
              value={busquedaCliente}
              onChange={(e) => setBusquedaCliente(e.target.value.toUpperCase())}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleBuscarClientes}
                      color="primary"
                      disabled={buscandoClientes}
                    >
                      {buscandoClientes ? (
                        <CircularProgress size={20} />
                      ) : (
                        <SearchIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          {/* Lista de clientes */}
          {mostrarListaClientes && listaClientes.length > 0 && (
            <Paper variant="outlined" sx={{ maxHeight: 260, overflow: "auto" }}>
              {listaClientes.map((c) => (
                <Box
                  key={`${c.id}`}
                  sx={{
                    p: 1,
                    borderBottom: "1px solid #eee",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSeleccionarCliente(c)}
                >
                  <Typography variant="subtitle2">{c.razonSocial}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    NIT: {c.nit} — Sucursal: {c.direccion}
                  </Typography>
                </Box>
              ))}
            </Paper>
          )}

          {/* Info cliente */}
          {clienteSeleccionado && (
            <Card variant="outlined">
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box>
                    <Typography variant="h6">
                      {clienteSeleccionado.direccion}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Dirección:</strong>{" "}
                      {clienteSeleccionado.direccion}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Ubicación:</strong> {clienteSeleccionado.ciudad},{" "}
                      {clienteSeleccionado.departamento}
                    </Typography>
                  </Box>
                  <IconButton onClick={resetToInitial}>
                    <ClearIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          )}

          <Divider />

          {/* Búsqueda de productos */}
          {clienteSeleccionado && (
            <TextField
              label="Ingrese al menos 3 letras del producto"
              value={busquedaProducto}
              onChange={(e) =>
                setBusquedaProducto(e.target.value.toUpperCase())
              }
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleBuscarProductos}
                      color="primary"
                      disabled={buscandoProductos}
                    >
                      {buscandoProductos ? (
                        <CircularProgress size={20} />
                      ) : (
                        <SearchIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}

          {/* Autocomplete de productos */}
          <Autocomplete
            disabled={!productosHabilitados || buscandoProductos}
            options={listaProductos}
            getOptionLabel={(option) =>
              `${option.codigo} | ${option.nombre} | Marca: ${option.marca} | Stock: ${option.stock}`
            }
            onChange={(_, value) => handleAddProducto(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Agregar Producto al Pedido"
                helperText={
                  !productosHabilitados
                    ? "Seleccione un cliente para habilitar la búsqueda de productos"
                    : ""
                }
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {buscandoProductos || buscandoProductos ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

          {/* Tabla de productos */}
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
                    const valorTotal = p.cantidad
                      ? p.precio * Number(p.cantidad)
                      : 0;
                    const ivaProd = valorTotal
                      ? valorTotal * (p.porcentajeImpuesto / 100)
                      : 0;
                    return (
                      <TableRow key={p.id}>
                        <TableCell>
                          {p.codigo} - {p.nombre}
                        </TableCell>
                        <TableCell align="right">
                          {p.precio.toLocaleString("es-CO", {
                            style: "currency",
                            currency: "COP",
                          })}
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            value={p.cantidad}
                            onChange={(e) => {
                              let value = "";
                              if (!Number.isNaN(e.target.value)) {
                                value = e.target.value;
                              }
                              handleUpdateCantidad(p.codigo, value);
                            }}
                            sx={{ width: "80px" }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {valorTotal.toLocaleString("es-CO", {
                            style: "currency",
                            currency: "COP",
                          })}
                        </TableCell>
                        <TableCell align="right">
                          {ivaProd.toLocaleString("es-CO", {
                            style: "currency",
                            currency: "COP",
                          })}
                        </TableCell>
                        <TableCell align="right">
                          {(valorTotal + ivaProd).toLocaleString("es-CO", {
                            style: "currency",
                            currency: "COP",
                          })}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveProducto(p.codigo)}
                          >
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

          {/* Botón enviar */}
          <Stack direction="row" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmarEnvio}
              disabled={
                productosDelPedido.length === 0 ||
                !clienteSeleccionado ||
                enviandoPedido
              }
              startIcon={
                enviandoPedido ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SendIcon />
                )
              }
            >
              {enviandoPedido ? "Enviando..." : "Enviar Pedido"}
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Diálogo confirmación */}
      <Dialog open={abrirDialogo} onClose={handleCancelarEnvio}>
        <DialogTitle>Confirmar Envío</DialogTitle>
        <DialogContent>
          <Typography>
            <strong>Cliente:</strong> {clienteSeleccionado?.razonSocial}
          </Typography>
          <Typography>
            <strong>Total:</strong>{" "}
            {totalPedido.toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
            })}
          </Typography>
          {comentarios && (
            <Typography>
              <strong>Comentarios:</strong> {comentarios}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelarEnvio} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleEnviarPedido}
            color="primary"
            variant="contained"
          >
            Confirmar Envío
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notificaciones */}
      <Snackbar
        open={notificacion.open}
        autoHideDuration={4000}
        onClose={() => setNotificacion({ ...notificacion, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={notificacion.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {notificacion.message}
        </Alert>
      </Snackbar>
    </AppLayout>
  );
};

export default PedidosPage;
