const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');

router.post('/', pedidosController.crearPedido);

router.get('/historial', pedidosController.pedidosTodos);

router.get('/:id_usuario', pedidosController.obtenerPedidosUsuario);

router.get('/historial/:id', pedidosController.detallePedidos); 

router.put('/actualizar', pedidosController.actualizarEstadoPedido);

module.exports = router;
