import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Card, Button } from 'react-bootstrap';

const Profile = () => {
  const { user, logout } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUserInfo, setEditedUserInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [historialCompras, setHistorialCompras] = useState([]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    const date = new Date(dateString);
    return isNaN(date) ? 'Fecha inválida' : `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  useEffect(() => {
    if (user) {
      setUserInfo(user);
      setEditedUserInfo(user);
      fetchHistorial(user.id);
    } else {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUserInfo(decodedToken);
        setEditedUserInfo(decodedToken);
        fetchHistorial(decodedToken.id);
      }
    }
  }, [user]);

  const fetchHistorial = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
  
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/pedidos/${userId}`, config);
      console.log("Datos recibidos:", response.data); 
      setHistorialCompras(response.data);
    } catch (err) {
      console.error('Error al obtener historial de compras:', err);
      setError('No se pudo cargar el historial de compras.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUserInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/usuarios/modificar`, editedUserInfo, config);
      console.log(response.data);
      if (response.status === 200 || response.status === 201) {
        setUserInfo(editedUserInfo);
        setIsEditing(false);
      } else {
        throw new Error('No se pudo actualizar la información');
      }
    } catch (err) {
      setError('Error al guardar los cambios.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo) return <div>Loading...</div>;

  return (
    <div className="min-h-screen d-flex flex-column bg-[#4C5425] text-white">
      <Navbar />
      <div className="flex-1 d-flex justify-content-center align-items-center">
        <Card style={{ width: '48rem', margin: '50px' }} className="shadow-lg">
          <Card.Body>
            <Card.Title className="text-center">Perfil de Usuario</Card.Title>
            {isEditing ? (
              <div>
                {['nombre', 'apellido', 'email', 'celular', 'rut', 'direccion'].map((field) => (
                  <input
                    key={field}
                    type="text"
                    name={field}
                    value={editedUserInfo[field] || ''}
                    onChange={handleChange}
                    className="form-control mb-2"
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  />
                ))}
                <div className="d-flex justify-content-between" style={{ marginTop: '10px' }}>
                  <Button variant="success" onClick={handleSaveChanges} disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                  <Button variant="secondary" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                {['nombre', 'apellido', 'email', 'celular', 'rut', 'direccion'].map((field) => (
                  <Card.Text key={field}>
                    <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong> {userInfo[field]}
                  </Card.Text>
                ))}
                <div className="d-flex justify-content-between" style={{ marginTop: '10px' }}>
                  <Button variant="warning" onClick={() => setIsEditing(true)}>Editar Datos</Button>
                  <Button variant="danger" onClick={logout}>Cerrar Sesión</Button>
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>

      <div className="bg-white text-black rounded-lg shadow-lg p-6 max-w-2xl mx-auto" style={{ marginTop: '20px' }}>
        <h3 className="text-xl font-semibold mb-4 text-center">Historial de Compras</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        {historialCompras.length > 0 ? (
          <ul className="space-y-4">
            {historialCompras.map((pedido) => (
              <li key={pedido.id_pedido} className="bg-gray-100 p-4 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="flex-1">
                    <p className="font-semibold text-lg">
                      Pedido #{pedido.id_pedido}
                    </p>
                    <p className="text-sm text-gray-500"> Fecha del pedido: 
                      {pedido.fecha_pedido ? formatDate(pedido.fecha_pedido) : "Fecha no disponible"} - 
                      <strong>{pedido.total ? new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(pedido.total) : "Monto no disponible"}</strong>
                    </p>
                  </div>
                </div>

                {pedido.productos && pedido.productos.length > 0 && (
                  <ul className="pl-8">
                    {pedido.productos.map((producto, index) => (
                      <li key={index} className="flex items-center space-x-2 mb-2">
                        {producto.cantidad} x 
                        <img 
                          src={producto.imagen_url || 'default-image-url'} 
                          alt={producto.nombre_producto} 
                          className="w-12 h-12 rounded-lg" 
                          style={{ width: '50px', marginRight: '10px', borderRadius: '5px' }}
                        />
                        <span className="text-sm">
                          <strong>{producto.nombre_producto}</strong> = {new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(producto.subtotal)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay compras realizadas aún.</p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
