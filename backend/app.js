const express = require('express');
const dotenv = require('dotenv');
const path = require('path'); // Importamos path para servir archivos estáticos
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const pedidosRoutes = require('./routes/pedidosRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

const cors = require('cors');
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes); 
app.use('/api/productos', productRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/transacciones', transactionRoutes);

// Servir archivos estáticos (como el HTML)
app.use(express.static(path.join(__dirname, 'public')));

// Ruta predeterminada (opcional)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); 
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

module.exports = app;
