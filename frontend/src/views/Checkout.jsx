import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [metodoPago, setMetodoPago] = useState('');

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/');
    }
  }, [cart, navigate]);

  const totalPrice = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const handlePayment = async () => {
    if (!metodoPago) {
      alert('Por favor, selecciona un método de pago.');
      return;
    }
  
    alert('Redirigiendo a la plataforma de pago...');
  
    setTimeout(async () => {
      if (!user || !user.id) {
        alert('Error: No se pudo obtener el usuario autenticado.');
        return;
      }
  
      const estadoTransaccion = metodoPago === 'otros' ? 'completada' : 'completada'; // Ajusta si necesitas manejar fallos
  
      const pedido = {
        id_usuario: user.id,
        productos: cart.map((item) => ({
          id_producto: item.id_producto,
          cantidad: item.cantidad,
          precio: item.precio,
        })),
        total: totalPrice,
        metodo_pago: metodoPago,
        estado_transaccion: estadoTransaccion, // Agregar estado de la transacción
      };
  
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/pedidos/`, pedido, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.status === 200) {
          alert('Pago exitoso. Pedido registrado.');
          clearCart();
          navigate('/perfil');
        } else {
          alert(`Hubo un error: ${response.data.message || 'No se pudo registrar el pedido.'}`);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error en el servidor. Inténtalo de nuevo.');
      }
    }, 3000);
  };
  
  

  return (
    <div style={{ backgroundColor: '#4C5425', height: '100vh' }} className="d-flex justify-content-center align-items-center">
      <Card style={{ width: '48rem', margin: '50px' }} className="shadow-lg">
        <Card.Body>
          <Card.Title className="text-center" style={{ color: 'black', fontSize: '2.5rem' }}>Resumen de la Compra</Card.Title>
          <ul className="list-group">
            {cart.map((item) => (
              <li key={item.id_producto} className="list-group-item d-flex justify-content-between">
                <span>{item.nombre} x {item.cantidad}</span>
                <span>
                  {(item.precio * item.cantidad).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}
                </span>
              </li>
            ))}
          </ul>
          <h3 className="mt-3 text-center" style={{ color: 'black' }}>
            Total a pagar: {totalPrice.toLocaleString("es-CL", { style: "currency", currency: "CLP" })}
          </h3>

          <Form.Group controlId="formMetodoPago">
            <Form.Label className="mt-4" style={{ color: 'black' }}>Método de Pago</Form.Label>
            <Form.Control 
              as="select" 
              value={metodoPago} 
              onChange={(e) => setMetodoPago(e.target.value)} 
              style={{ color: 'black' }}>

              <option value="">Selecciona un método de pago</option>
              <option value="tarjeta">tarjeta</option>
              <option value="transferencia">transferencia</option>
              <option value="otros">otros</option>

            </Form.Control>
          </Form.Group>

          <div className="d-flex justify-content-center mt-4">
            <Button className="btn-custom" onClick={handlePayment}>Confirmar Pago</Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Checkout;

