import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useProductos } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Detail = () => {
  const { id } = useParams();
  const { productos, loading } = useProductos();
  const { addToCart } = useCart();
  const { user } = useAuth(); 
  const navigate = useNavigate();
  const product = productos.find((p) => p.id_producto.toString() === id);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Producto no encontrado</div>;

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#4C5425] text-white">
      <Navbar />
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="bg-white text-black rounded-lg shadow-lg p-6 max-w-md w-full text-center">
          <img
            src={product.imagen_url}
            alt={product.nombre}
            className="w-full h-64 object-cover mb-4 rounded"
          />
          <h1 className="text-2xl font-bold mb-2">{product.nombre}</h1>
          <p className="mb-2">{product.descripcion}</p>

          {user ? (
            <>
              <p className="mb-4 font-semibold text-lg">
                {product.precio.toLocaleString("es-CL", { style: "currency", currency: "CLP" })}
              </p>
              <button
                onClick={handleAddToCart}
                className="btn btn-custom mb-4"
                style={{ margin: '10px' }}
              >
                Agregar al Carrito
              </button>
            </>
          ) : (
            <>
              <p className="text-red-500 mt-2">INICIA SESIÓN SI QUIERES COMPRAR.</p>
              <button
                onClick={handleGoLogin}
                className="btn btn-custom mb-4"
                style={{ margin: '10px' }}
              >
                Ir a Login
              </button>
            </>
          )}

          <button
            onClick={handleGoHome}
            className="btn btn-custom mb-4"
            style={{ margin: '10px' }}
          >
            Página Principal
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Detail;
