import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductoCard from '../components/ProductoCard';
import { useProductos } from '../context/ProductContext';


export default function Home() {
  const { productos, loading } = useProductos();
  if (loading) {
    return (
      <div>
        <Navbar />
        <h1>Cargando productos...</h1>
        <h2>La paciencia es la madre de las virtudes.</h2>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <h1 style={{ fontSize: '48px', color: 'black' }}>Productos de Seguridad</h1>
      <div className="container">
        <div className="row">
          {productos.map((producto) => (
            <ProductoCard key={producto.id_producto} producto={producto} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
