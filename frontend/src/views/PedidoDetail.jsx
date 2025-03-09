import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, Button, Form } from 'react-bootstrap';

const API_URL = import.meta.env.VITE_API_URL;

const PedidoDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDelivered, setIsDelivered] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await axios.get(`${API_URL}/pedidos/historial/${id}`);
        setOrder(response.data);
        setIsDelivered(response.data.estado_pedido === "entregado");
      } catch (error) {
        console.error('Error al obtener los detalles del pedido:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  const handleEstadoChange = async () => {
    setUpdating(true);
    try {
      await axios.put(`${API_URL}/pedidos/actualizar`, {
        id_pedido: id,
        nuevo_estado: "entregado"
      });

      setOrder(prev => ({ ...prev, estado_pedido: "entregado" }));
      setIsDelivered(true);
    } catch (error) {
      console.error('Error al actualizar el estado del pedido:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div>Cargando detalles...</div>;
  if (!order) return <div>Pedido no encontrado</div>;

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#4C5425' }}>
      <div className="flex-grow-1 d-flex justify-content-center align-items-start">
        <Card style={{ width: '40rem', backgroundColor: 'white', color: 'black', margin: '100px' }} className="shadow-lg p-4">
          <Card.Body>
            <Card.Title style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'left' }}>
              Detalle del Pedido #{order.id_pedido}
            </Card.Title>
            <div style={{ textAlign: 'left' }}>
              <p><strong>Usuario:</strong> {order.usuario?.nombre}</p>
              <p><strong>Teléfono:</strong> {order.usuario?.celular}</p>
              <p><strong>Dirección:</strong> {order.usuario?.direccion}</p>
              <p><strong>Fecha:</strong> {new Date(order.fecha_pedido).toLocaleDateString()}</p>
              <p>
                <strong>Total:</strong> {new Intl.NumberFormat("es-CL", {
                  style: "currency",
                  currency: "CLP",
                }).format(order.total)}
              </p>
              <p><strong>Estado:</strong> {order.estado_pedido}</p>
              <p><strong>Método de Pago:</strong> {order.metodo_pago}</p>

              <h3>Productos</h3>
              <ul>
                {order.productos.map((producto, index) => (
                  <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
                    <img 
                      src={producto.imagen_url || 'default-image-url'} 
                      alt={producto.nombre_producto} 
                      className="w-12 h-12 rounded-lg" 
                      style={{ width: '50px', marginRight: '10px', borderRadius: '5px' }}
                    />
                    {producto.nombre_producto} - {producto.cantidad} x {new Intl.NumberFormat("es-CL", {
                      style: "currency",
                      currency: "CLP",
                    }).format(producto.subtotal)}
                  </li>
                ))}
              </ul>

              {/* Checkbox para marcar como entregado */}
              {order.estado_pedido === "pendiente" && (
                <Form.Check 
                  type="checkbox"
                  label="Marcar como entregado"
                  checked={isDelivered}
                  onChange={handleEstadoChange}
                  disabled={updating}
                />
              )}
            </div>

            <Button 
              variant="secondary" 
              onClick={() => window.history.back()} 
              className="mt-3" 
              style={{ backgroundColor: '#E5B129', color: '#4C5425', fontWeight: 'bold' }}
            >
              Volver a los pedidos
            </Button>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default PedidoDetail;

