export interface Cliente {
  id: number;
  nit: string;
  razonSocial: string;
  sucursal: number;
  telefono: string;
  direccion: string;
  departamento: string;
  ciudad: string;
}

export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  familia: string;
  grupo: string;
  marca: string;
  modelo: string;
  stock: number;
  precio: number;
  codImpuesto: string;
  porcentajeImpuesto: number;
  unidad: string;
}

export interface PedidoProducto extends Producto {
  cantidad: string;
  error?: string;
}

export interface HistorialPedidos {
  id: string;
  fecha: string; // Usaremos formato ISO "YYYY-MM-DD" para facilitar el filtrado
  cliente: string;
  total: number;
  estado: "Abierto" | "Cerrado" | "Facturado" | "Parcial" | "Pendiente";
}

export interface Transaccion {
  id: string; // Corresponde al número del pedido
  fecha: string; // Formato "YYYY-MM-DD"
  estado: "Procesado" | "Error" | "Pendiente";
  mensaje?: string;
}

export interface ProductoPedido {
  cantidad: string;
  idProducto: string;
  error?: string;
}

export interface CrearPedido {
  comentarios: string;
  idsuc: number;
  nit: string;
  productos: ProductoPedido[];
}
