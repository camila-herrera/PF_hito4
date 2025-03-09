import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

const Carrito = () => {
  const { cart, removeFromCart, clearCart, addToCart, decreaseQuantity } = useCart();
  const navigate = useNavigate();


  const totalPrice = cart.reduce((acc, item) => acc + parseFloat(item.precio) * item.cantidad, 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Tu carrito está vacío');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h1>Carrito de Compras</h1>
        {cart.length === 0 ? (
          <p>El carrito está vacío.</p>
        ) : (
          <div>
            <ul className="list-group">
              {cart.map((item) => {
                const precioUnitario = parseFloat(item.precio);
                const subtotal = precioUnitario * item.cantidad;

                return (
                  <li key={item.id_producto} className="list-group-item d-flex justify-content-between align-items-center">
                    <span>{item.nombre}</span>
                    <span>
                      {precioUnitario.toLocaleString("es-CL", { style: "currency", currency: "CLP" })} x {item.cantidad} = {subtotal.toLocaleString("es-CL", { style: "currency", currency: "CLP" })}
                    </span>
                    <div>
                      <button className="btn btn-sm btn-outline-secondary mx-1" onClick={() => decreaseQuantity(item.id_producto)}>-</button>
                      <span className="mx-2">{item.cantidad}</span>
                      <button className="btn btn-sm btn-outline-primary mx-1" onClick={() => addToCart(item)}>+</button>
                      <button className="btn btn-sm btn-danger mx-1" onClick={() => removeFromCart(item.id_producto)}>Eliminar</button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-3 text-end">
              <h3>Total: {totalPrice.toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</h3>
              <div className="mt-4 d-flex justify-content-end">
                <button className="btn btn-outline-danger me-2" onClick={clearCart}>Vaciar Carrito</button>
                <button className="btn btn-success" onClick={handleCheckout}>Ir a pagar</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Carrito;
