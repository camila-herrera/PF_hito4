const express = require('express');
const router = express.Router();
const { getProducts, createProduct, updateProduct, deleteProduct, actualizarStock } = require('../controllers/productController');

router.get('/', getProducts);
router.post('/', createProduct); 
router.put('/:id_producto', updateProduct); 
router.delete('/:id_producto', deleteProduct);  
router.put('/actualizar/:id', actualizarStock);  

module.exports = router;

