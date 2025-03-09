import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL; 
      const response = await axios.get(`${API_URL}/pedidos/historial`); 
      setOrders(response.data); 
    } catch (error) {
      console.error('Error al obtener los pedidos:', error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []); 

  return (
    <OrdersContext.Provider value={{ orders, loading, fetchOrders }}>
      {children}
    </OrdersContext.Provider>
  );
};


export const useOrders = () => useContext(OrdersContext);
