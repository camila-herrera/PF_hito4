import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrdersProvider } from './context/OrdersContext';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <OrdersProvider>
          <App />
        </OrdersProvider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);
