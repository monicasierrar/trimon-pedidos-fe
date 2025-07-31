const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000; // You can choose any available port

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Replace with the actual URL of the app on port 3002
}));


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

// Route 2: A GET request with a dynamic parameter
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    res.json({ message: `You requested user with ID: ${userId}` });
});

// Route 3: A POST request example
app.post('/data', (req, res) => {
    const receivedData = req.body;
    console.log('Received data:', receivedData);
    res.json({ message: 'Data received successfully!', data: receivedData });
});

// Start the server
app.listen(port, () => {
    console.log(`Express API listening at http://localhost:${port}`);
});