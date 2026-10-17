require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({
        mensaje: 'API Proyecto POS está funcionando correctamente'
    });
});

// Rutas
/*app.use('/api/clientes', require('./routes/clienteRoutes'));
app.use('/api/sucursales', require('./routes/sucursalRoutes'));
app.use('/api/categorias', require('./routes/categoriaRoutes'));
app.use('/api/usuarios', require('./routes/usuarioRoutes'));
app.use('/api/productos', require('./routes/productoRoutes'));
app.use('/api/ventas', require('./routes/ventaRoutes'));
app.use('/api/detalles-ventas', require('./routes/detalleVentaRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));*/

// Login público
app.use('/api/auth', require('./routes/authRoutes'));

// Desde aquí, todas las rutas /api requieren token
app.use('/api', require('./middleware/authMiddleware'));

// Rutas protegidas
app.use('/api/clientes', require('./routes/clienteRoutes'));
app.use('/api/sucursales', require('./routes/sucursalRoutes'));
app.use('/api/categorias', require('./routes/categoriaRoutes'));
app.use('/api/usuarios', require('./routes/usuarioRoutes'));
app.use('/api/productos', require('./routes/productoRoutes'));
app.use('/api/ventas', require('./routes/ventaRoutes'));
app.use('/api/detalles-ventas', require('./routes/detalleVentaRoutes'));

// Iniciar servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`API escuchando en http://localhost:${PORT}`);
});
