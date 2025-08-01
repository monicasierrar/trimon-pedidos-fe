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
            nit: '900.123.456-7',
            razonSocial: 'Cliente Alpha S.A.S.',
            sucursal: 'Principal',
            telefono: '3101234567',
            direccion: 'Calle Falsa 123',
            departamento: 'Cundinamarca',
            ciudad: 'Bogotá'
        },
        {
            id: 2,
            nit: '800.789.123-4',
            razonSocial: 'Comercializadora Beta Ltda.',
            sucursal: 'Centro',
            telefono: '3207891234',
            direccion: 'Avenida Siempre Viva 742',
            departamento: 'Antioquia',
            ciudad: 'Medellín'
        },
        {
            id: 3,
            nit: '901.456.789-0',
            razonSocial: 'Industrias Gamma',
            sucursal: 'Norte',
            telefono: '3019876543',
            direccion: 'Transversal 50 # 100-20',
            departamento: 'Atlántico',
            ciudad: 'Barranquilla'
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
    ]
    return res.json({
        productos
    })
})


// Start the server
app.listen(port, () => {
    console.log(`Express API listening at http://localhost:${port}`);
});