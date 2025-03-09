import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomNavbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_URL = import.meta.env.VITE_API_URL;

const Pedidos = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/pedidos/historial`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    console.log('Fetching details for order:', orderId);
    try {
      const response = await axios.get(`${API_URL}/pedidos/${orderId}`);
      setSelectedOrder(response.data);
    } catch (error) {
      console.error("Error al obtener detalles del pedido:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div className="text-center mt-5">Cargando pedidos...</div>;

  return (
    <div className="container mt-5">
      <CustomNavbar />
      <h1>Todos los Pedidos</h1>
      {orders.length === 0 ? (
        <p>No hay pedidos disponibles.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id_pedido}>
                <td>{order.usuario?.nombre || "Desconocido"}</td>
                <td>{new Date(order.fecha_pedido).toLocaleDateString()}</td>
                <td>
                  {new Intl.NumberFormat("es-CL", {
                    style: "currency",
                    currency: "CLP",
                  }).format(order.total)}
                </td>
                <td>{order.estado}</td>
                <td>
                <button
                  onClick={() => navigate(`/pedidodetail/${order.id_pedido}`)} 
                  className="btn btn-custom"
                >
                  Ver detalles
                </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedOrder && (
        <div className="mt-4 p-3 border rounded">
          <h2>Detalle del Pedido #{selectedOrder.id_pedido}</h2>
          <p><strong>Usuario:</strong> {selectedOrder.usuario?.nombre}</p>
          <p><strong>Teléfono:</strong> {selectedOrder.usuario?.celular}</p>
          <p><strong>Dirección:</strong> {selectedOrder.usuario?.direccion}</p>
          <p><strong>Fecha:</strong> {new Date(selectedOrder.fecha_pedido).toLocaleDateString()}</p>
          <p>
            <strong>Total:</strong> {new Intl.NumberFormat("es-CL", {
              style: "currency",
              currency: "CLP",
            }).format(selectedOrder.total)}
          </p>
          <p><strong>Estado:</strong> {selectedOrder.estado}</p>
          <p><strong>Método de Pago:</strong> {selectedOrder.metodo_pago}</p>

          <h3>Productos</h3>
          <ul>
            {selectedOrder.productos.map((producto, index) => (
              <li key={index}>
                {producto.nombre_producto} - {producto.cantidad} x {new Intl.NumberFormat("es-CL", {
                  style: "currency",
                  currency: "CLP",
                }).format(producto.subtotal)}
              </li>
            ))}
          </ul>

          <button className="btn btn-secondary mt-3" onClick={() => setSelectedOrder(null)}>
            Cerrar detalles
          </button>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Pedidos;