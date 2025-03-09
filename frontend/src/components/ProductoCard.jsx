import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const ProductoCard = ({ producto }) => {
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useAuth();
  const { addToCart } = useCart();
  const [stock, setStock] = useState(producto.stock);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  const handleDetailClick = () => {
    navigate(`/detail/${producto.id_producto}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(producto);
  };

  const handleUpdateStock = async () => {
    const stockNumber = Number(stock);  
    if (isNaN(stockNumber) || stockNumber < 0) {
      setError("El stock no puede ser negativo.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/productos/actualizar/${producto.id_producto}`,
        { stock: stockNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.status === 200) {
        setIsEditing(false);
        setError(null);
        alert('Stock actualizado exitosamente');
      }
    } catch (error) {
      console.error(error);
      setError('Error al actualizar el stock. Intente de nuevo.');
    }
  };

  return (
    <div className="col-md-4 my-3" style={{ cursor: 'pointer' }}>
      <div className="card shadow-sm">
        <img
          src={producto.imagen_url}
          alt={producto.nombre}
          className="card-img-top"
          style={{ height: '200px', objectFit: 'cover' }}
        />
        <div className="card-body">
          <h5 className="card-title text-truncate" style={{ maxWidth: '100%' }}>
            {producto.nombre}
          </h5>
          <p className="card-text text-muted">{producto.descripcion}</p>

          {isAuthenticated ? (
            <div className="card-text">
              <strong>{producto.precio.toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</strong>
            </div>
          ) : (
            <div className="card-text text-muted">Inicia sesión para ver VALORES</div>
          )}

          <div className="card-text">
            {isEditing ? (
              <>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  min="0"
                  className="form-control"
                />
                <div className="d-flex justify-content-between mt-2">
                  <button className="btn btn-success" onClick={handleUpdateStock}>Guardar</button>
                </div>
              </>
            ) : (
              <>Stock: {producto.stock}</>
            )}
          </div>

          {error && <div className="text-danger mt-2">{error}</div>}

          <div className="d-flex justify-content-between mt-3">
            {userRole === 'usuario' && (
              <>
                <button className="btn btn-custom mb-4" onClick={handleAddToCart}>
                  Agregar al carrito
                </button>
                <button className="btn btn-custom mb-4" onClick={handleDetailClick}>
                  Ver detalles
                </button>
              </>
            )}

            {(userRole === 'cliente' || userRole === 'admin') && (
              <button 
                className={`btn ${isEditing ? 'btn-danger' : 'btn-warning'}`} 
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancelar' : 'Actualizar Producto'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoCard;
