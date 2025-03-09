import React, { createContext, useState, useEffect, useContext } from "react";

const ProductosContext = createContext();

export const ProductosProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;

    fetch(`${apiUrl}/productos`)
      .then((response) => response.json())
      .then((data) => {

        const productosConPrecios = data.map((producto) => ({
          ...producto,
          precio: parseFloat(producto.precio),
          precioFormateado: parseFloat(producto.precio).toLocaleString("es-CL", {
            style: "decimal",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
        }));

        setProductos(productosConPrecios);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error cargando los productos:", error);
        setLoading(false);
      });
  }, []);

  return (
    <ProductosContext.Provider value={{ productos, loading }}>
      {children}
    </ProductosContext.Provider>
  );
};

export const useProductos = () => useContext(ProductosContext);

