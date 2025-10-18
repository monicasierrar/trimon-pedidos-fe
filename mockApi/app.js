const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000; // You can choose any available port

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors());


// Route 1: A simple GET request
app.get('/', (req, res) => {
    res.send('Welcome to your Express API!');
});

app.get('/clientes', (req, res) => {
    const clientes = [
        {
            id: 1,
            nit: '900339960',
            razonSocial: 'AMERICANA DE LUJOS',
            sucursal: '0',
            telefono: '3101234567',
            direccion: 'CARRERA 17 Nº 8-08 BARRIO LA ESTANZUELA',
            departamento: 'Cundinamarca',
            ciudad: 'Bogotá',
            idformapago: 1
        },
        {
            id: 2,
            nit: '900339960',
            razonSocial: 'AMERICANA DE LUJOS',
            sucursal: '1',
            telefono: '3101234567',
            direccion: 'DIAGONAL 16 N°96G-18 FONTIBON',
            departamento: 'Cundinamarca',
            ciudad: 'Bogotá',
            idformapago: 4
        },
        {
            id: 3,
            nit: '800789123',
            razonSocial: 'Comercializadora Beta Ltda.',
            sucursal: '1',
            telefono: '3207891234',
            direccion: 'Avenida Siempre Viva 742',
            departamento: 'Antioquia',
            ciudad: 'Medellín',
            idformapago: 1
        },
        {
            id: 4,
            nit: '860075208',
            razonSocial: 'Industrias Gamma',
            sucursal: '2',
            telefono: '3019876543',
            direccion: 'Transversal 50 # 100-20',
            departamento: 'Atlántico',
            ciudad: 'Barranquilla',
            idformapago: 5
        },
    ]
    return res.json({
        clientes
    })
})

app.get('/productos', (req, res) => {
    const productos = [
        {
            id: 201, 
            codigo: 'FR-BOS-01',
            nombre: 'Pastillas de Freno Delanteras', 
            familia: 'Sistema de Frenos', 
            grupo: 'Componentes de Fricción', 
            marca: 'Bosch', 
            modelo: 'Ceramic Pro', 
            stock: 45, 
            precio: 180000,
            unidad: 'Und',
            porcentajeImpuesto: '19',
            codimp: 'IVA01'
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
            precio: 35000,
            unidad: 'Und',
            porcentajeImpuesto: '10',
            codigoImpuesto: 'IVA01'
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
            precio: 45000,
            unidad: 'Und',
            porcentajeImpuesto: '19',
            codigoImpuesto: 'IVA01'
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
            precio: 220000,
            unidad: 'Und',
            porcentajeImpuesto: '19',
            codigoImpuesto: 'IVA01'
        },
    ]
    return res.json({
        productos
    })
})

app.post('/pedidos', (req, res) => {
    return res.json({
        pedido: {
            id: 5999999
        }
    })
}
)

// Start the server
app.listen(port, () => {
    console.log(`Express API listening at http://localhost:${port}`);
});
