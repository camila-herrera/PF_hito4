const pool = require('../config/db');

const crearPedido = async (req, res) => {
  const { id_usuario, productos, total, metodo_pago } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN'); 

    const usuarioResult = await client.query('SELECT * FROM usuarios WHERE id = $1', [id_usuario]);
    if (usuarioResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const pedidoResult = await client.query(
      'INSERT INTO pedidos (id_usuario, estado, total) VALUES ($1, $2, $3) RETURNING id_pedido',
      [id_usuario, 'pendiente', total]
    );
    const id_pedido = pedidoResult.rows[0].id_pedido;

    productos.forEach(producto => {
      if (!producto.id_producto) {
        throw new Error("Producto sin ID encontrado");
      }
    });

    const insertProductos = productos.map(async (producto) => {
      const productoResult = await client.query('SELECT * FROM productos WHERE id_producto = $1', [producto.id_producto]);
      if (productoResult.rows.length === 0) {
        throw new Error(`Producto con ID ${producto.id_producto} no encontrado`);
      }

      return client.query(
        'INSERT INTO detalle_pedidos (id_pedido, id_producto, cantidad, subtotal) VALUES ($1, $2, $3, $4)',
        [id_pedido, producto.id_producto, producto.cantidad, producto.precio * producto.cantidad]
      );
    });

    await Promise.all(insertProductos);  

    await client.query('COMMIT'); 
    res.json({ mensaje: 'Pedido creado exitosamente', id_pedido });  

  } catch (error) {
    await client.query('ROLLBACK'); 
    console.error('Error al crear pedido:', error);
    res.status(500).json({ error: `Error al procesar el pedido: ${error.message}` });
  } finally {
    client.release();
  }
};

const obtenerPedidosUsuario = async (req, res) => {
  const { id_usuario } = req.params; 

  try {
    const pedidos = await pool.query(
      `SELECT  
          p.id_pedido, 
          p.fecha_pedido, 
          p.total, 
          p.estado, 
          d.id_producto, 
          prod.nombre AS nombre_producto, 
          d.cantidad, 
          d.subtotal,
          prod.imagen_url,
          p.id_usuario
      FROM pedidos p
      JOIN detalle_pedidos d ON p.id_pedido = d.id_pedido
      JOIN productos prod ON d.id_producto = prod.id_producto
      WHERE p.id_usuario = $1
      ORDER BY p.fecha_pedido DESC;`, 
      [id_usuario] 
    );

    if (pedidos.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontraron pedidos para este usuario' });
    }

    const orders = pedidos.rows.reduce((acc, curr) => {
      let order = acc.find((order) => order.id_pedido === curr.id_pedido);
      if (!order) {
        order = {
          id_pedido: curr.id_pedido,
          fecha_pedido: curr.fecha_pedido,
          total: curr.total,
          estado: curr.estado, 
          productos: []
        };
        acc.push(order);
      }

      order.productos.push({
        nombre_producto: curr.nombre_producto,
        cantidad: curr.cantidad,
        subtotal: curr.subtotal,
        imagen_url: curr.imagen_url
      });

      return acc;
    }, []);

    res.json(orders);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error al obtener los pedidos' });
  }
};

const actualizarEstadoPedido = async (req, res) => {
  const { id_pedido, nuevo_estado } = req.body;

  if (!id_pedido || !nuevo_estado) {
    return res.status(400).json({ error: 'Debe proporcionar un id_pedido y un nuevo_estado' });
  }

  const client = await pool.connect();
  try {
    // Verificar si el pedido existe
    const pedidoResult = await client.query('SELECT * FROM pedidos WHERE id_pedido = $1', [id_pedido]);
    if (pedidoResult.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    // Actualizar el estado del pedido sin restricciones
    await client.query('UPDATE pedidos SET estado = $1 WHERE id_pedido = $2', [nuevo_estado, id_pedido]);

    res.json({ mensaje: `Estado del pedido actualizado a "${nuevo_estado}" correctamente` });

  } catch (error) {
    console.error('Error al actualizar estado de pedido:', error);
    res.status(500).json({ error: 'Error al actualizar estado del pedido' });
  } finally {
    client.release();
  }
};

const pedidosTodos = async (req, res) => {
  try {
    const pedidos = await pool.query(
      `SELECT 
        p.id_pedido, 
        p.fecha_pedido, 
        p.total, 
        p.estado, 
        u.nombre AS nombre_usuario, 
        u.celular, 
        u.direccion
      FROM pedidos p
      JOIN usuarios u ON p.id_usuario = u.id
      ORDER BY p.fecha_pedido DESC`
    );

    if (pedidos.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontraron pedidos' });
    }

    const orders = pedidos.rows.map((pedido) => ({
      id_pedido: pedido.id_pedido,
      fecha_pedido: pedido.fecha_pedido,
      total: pedido.total,
      estado: pedido.estado,
      usuario: {
        nombre: pedido.nombre_usuario,
        celular: pedido.celular,
        direccion: pedido.direccion
      }
    }));

    res.json(orders);
  } catch (error) {
    console.error('Error al obtener todos los pedidos:', error);
    res.status(500).json({ error: 'Error al obtener los pedidos' });
  }
};

const detallePedidos = async (req, res) => {
  const { id } = req.params;

  try {
    const pedido = await pool.query(
      `SELECT 
          p.id_pedido,
          p.fecha_pedido,
          p.estado AS estado_pedido,
          p.total AS total_pedido,
          t.metodo_pago,
          t.estado AS estado_transaccion,
          u.nombre AS nombre_usuario,
          u.apellido AS apellido_usuario,
          u.celular,
          u.direccion,
          u.ciudad,
          u.region,
          d.cantidad,
          d.subtotal,
          prod.nombre AS nombre_producto,
          prod.precio AS precio_producto,
          prod.imagen_url AS imagen_producto
      FROM 
          pedidos p
      LEFT JOIN 
          detalle_pedidos d ON p.id_pedido = d.id_pedido
      LEFT JOIN 
          productos prod ON d.id_producto = prod.id_producto
      LEFT JOIN 
          usuarios u ON p.id_usuario = u.id
      LEFT JOIN 
          transacciones t ON p.id_pedido = t.id_pedido
      WHERE 
          p.id_pedido = $1
      ORDER BY 
          d.id_detalle;`,
      [id]
    );

    if (pedido.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    const usuario = {
      nombre: pedido.rows[0].nombre_usuario,
      apellido: pedido.rows[0].apellido_usuario,
      celular: pedido.rows[0].celular,
      direccion: pedido.rows[0].direccion,
      ciudad: pedido.rows[0].ciudad,
      region: pedido.rows[0].region
    };

    const productos = pedido.rows.map((producto) => ({
      nombre_producto: producto.nombre_producto,
      cantidad: producto.cantidad,
      subtotal: producto.subtotal,
      precio_producto: producto.precio_producto,
      imagen_url: producto.imagen_producto
    }));

    const respuesta = {
      id_pedido: pedido.rows[0].id_pedido,
      fecha_pedido: pedido.rows[0].fecha_pedido,
      total: pedido.rows[0].total_pedido,
      estado_pedido: pedido.rows[0].estado_pedido,
      metodo_pago: pedido.rows[0].metodo_pago,
      estado_transaccion: pedido.rows[0].estado_transaccion,
      usuario: usuario,
      productos: productos
    };
    
    res.json(respuesta);
  } catch (error) {
    console.error('Error al obtener detalles del pedido:', error);
    res.status(500).json({ 
      error: 'Error al obtener los detalles del pedido', 
      details: error.message 
    });
  }
};





module.exports = { crearPedido, obtenerPedidosUsuario, actualizarEstadoPedido, detallePedidos, pedidosTodos };
