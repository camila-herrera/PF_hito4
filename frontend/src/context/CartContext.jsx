import { createContext, useState, useContext } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const productExists = prevCart.some(item => item.id_producto === product.id_producto);
      return productExists
        ? prevCart.map(item =>
            item.id_producto === product.id_producto
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          )
        : [...prevCart, { ...product, cantidad: 1 }];
    });
  };

  const cartTotal = () => {
     const total = cart.reduce((total, item) => total + item.precio * item.cantidad, 0);
    return total; 
  };

  const decreaseQuantity = (productId) => {
    setCart(prevCart =>
      prevCart
        .map(item =>
          item.id_producto === productId && item.cantidad > 0
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
    );
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id_producto !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const createOrderFromCart = async (userId) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const orderData = {
        userId,
        productos: cart.map(item => ({
          id_producto: item.id_producto,
          cantidad: item.cantidad,
          precio: item.precio,
        })),
        total: cart.reduce((total, item) => total + item.precio * item.cantidad, 0), 
        estado: 'Pendiente',
        fecha: new Date().toISOString(),
      };
      const response = await axios.post(`${API_URL}/pedidos`, orderData);
      console.log('Pedido creado:', response.data);
      clearCart(); 
      return response.data; 
    } catch (error) {
      console.error('Error al crear el pedido:', error);
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      decreaseQuantity,
      cartTotal,
      createOrderFromCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
