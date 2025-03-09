const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const pedidosRoutes = require('./routes/pedidosRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const app = express();
const cors = require('cors');
app.use(cors({ origin: '*' }));

dotenv.config();

app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes); 
app.use('/api/productos', productRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/transacciones', transactionRoutes);




module.exports = app;
