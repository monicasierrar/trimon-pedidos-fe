export interface Cliente {
  id: number;
  nit: string;
  razonSocial: string;
  sucursal: string;
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
  cantidad: number;
  
}

export interface Pedido {
  id: string;
  fecha: string; // Usaremos formato ISO "YYYY-MM-DD" para facilitar el filtrado
  cliente: string;
  total: number;
  estado: 'Entregado' | 'Enviado' | 'Cancelado';
}

export interface Transaccion {
  id: string; // Corresponde al número del pedido
  fecha: string; // Formato "YYYY-MM-DD"
  estado: 'Procesado' | 'Error' | 'Pendiente';
}
