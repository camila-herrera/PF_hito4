const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ mensaje: 'Producto creado exitosamente', product });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.update(req.params.id_producto, req.body);
    res.json({ mensaje: 'Producto actualizado exitosamente', product });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.delete(req.params.id_producto);
    res.json({ mensaje: 'Producto eliminado exitosamente', product });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};

const actualizarStock = async (req, res) => {
  try {
    // Verificar si se proporciona el stock en el cuerpo de la solicitud
    const { stock } = req.body;
    if (stock === undefined || stock < 0) {
      return res.status(400).json({ error: 'El campo stock es obligatorio y no puede ser negativo.' });
    }

    // Actualizar el stock del producto basado en el id proporcionado en la URL
    const updatedProduct = await Product.updateStock(req.params.id, stock);

    // Verificar si se actualizó el producto
    if (updatedProduct) {
      return res.json({
        mensaje: 'Stock actualizado exitosamente',
        product: updatedProduct,
      });
    }

    return res.status(404).json({ error: 'Producto no encontrado' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al actualizar el stock del producto' });
  }
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct, actualizarStock };
