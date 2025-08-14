// src/data/mocks.ts

import {Pedido, Producto, Transaccion } from "../api/types";

// export const clientesMock: Cliente[] = [
//   { 
//     id: 1, 
//     nit: '900.123.456-7', 
//     razonSocial: 'Cliente Alpha S.A.S.', 
//     sucursal: 'Principal',
//     telefono: '3101234567',
//     direccion: 'Calle Falsa 123',
//     departamento: 'Cundinamarca',
//     ciudad: 'Bogotá' 
//   },
//   { 
//     id: 2, 
//     nit: '800.789.123-4', 
//     razonSocial: 'Comercializadora Beta Ltda.', 
//     sucursal: 'Centro',
//     telefono: '3207891234',
//     direccion: 'Avenida Siempre Viva 742',
//     departamento: 'Antioquia',
//     ciudad: 'Medellín' 
//   },
//   { 
//     id: 3, 
//     nit: '901.456.789-0', 
//     razonSocial: 'Industrias Gamma', 
//     sucursal: 'Norte',
//     telefono: '3019876543',
//     direccion: 'Transversal 50 # 100-20',
//     departamento: 'Atlántico',
//     ciudad: 'Barranquilla' 
//   }, // <-- NODO AGREGADO
// ];

export const productosMock: Producto[] = [
  { 
    id: 201, 
    codigo: 'FR-BOS-01',
    nombre: 'Pastillas de Freno Delanteras', 
    familia: 'Sistema de Frenos', 
    grupo: 'Componentes de Fricción', 
    marca: 'Bosch', 
    modelo: 'Ceramic Pro', 
    stock: 45, 
    precio: 180000
  },
  { 
    id: 202, 
    codigo: 'FL-ACD-02',
    nombre: 'Filtro de Aceite', 
    familia: 'Motor', 
    grupo: 'Filtros', 
    marca: 'ACDelco', 
    modelo: 'PF47', 
    stock: 120, 
    precio: 35000
  },
  { 
    id: 203, 
    codigo: 'SP-NGK-03',
    nombre: 'Bujía de Iridio', 
    familia: 'Motor', 
    grupo: 'Sistema de Encendido', 
    marca: 'NGK', 
    modelo: 'Laser Iridium', 
    stock: 250, 
    precio: 45000
  },
  { 
    id: 204, 
    codigo: 'AM-GAB-04',
    nombre: 'Amortiguador Trasero', 
    familia: 'Suspensión', 
    grupo: 'Amortiguadores', 
    marca: 'Gabriel', 
    modelo: 'Gas Ryder', 
    stock: 30, 
    precio: 220000
  },
];

// ... (al final del archivo, después de productosMock)

// 1. Define la nueva interfaz para los Pedidos


// 2. Agrega los datos de ejemplo
export const pedidosMock: Pedido[] = [
  { id: 'PED-001', fecha: '2025-07-15', cliente: 'Cliente Alpha S.A.S.', total: 430000, estado: 'Entregado' },
  { id: 'PED-002', fecha: '2025-07-10', cliente: 'Comercializadora Beta Ltda.', total: 255000, estado: 'Entregado' },
  { id: 'PED-003', fecha: '2025-06-20', cliente: 'Industrias Gamma', total: 770000, estado: 'Enviado' },
  { id: 'PED-004', fecha: '2025-06-05', cliente: 'Cliente Alpha S.A.S.', total: 180000, estado: 'Cancelado' },
  { id: 'PED-005', fecha: '2025-05-30', cliente: 'Comercializadora Beta Ltda.', total: 35000, estado: 'Entregado' },
];

// 1. Define la nueva interfaz para las Transacciones


// 2. Agrega los datos de ejemplo
export const transaccionesMock: Transaccion[] = [
  { id: 'PED-001', fecha: '2025-07-15', estado: 'Procesado' },
  { id: 'PED-002', fecha: '2025-07-10', estado: 'Error' },
  { id: 'PED-003', fecha: '2025-06-20', estado: 'Pendiente' },
  { id: 'PED-004', fecha: '2025-06-05', estado: 'Procesado' },
  { id: 'PED-005', fecha: '2025-05-30', estado: 'Error' },
];