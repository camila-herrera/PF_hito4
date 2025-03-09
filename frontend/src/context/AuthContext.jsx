import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); 
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verificar si ya hay un token en localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodificar el JWT para obtener datos del usuario
      setUserRole(decodedToken.rol);
      setUser(decodedToken);
    } else {
      setIsAuthenticated(false); // Si no hay token, no está autenticado
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token); 
    setIsAuthenticated(true);
    const decodedToken = JSON.parse(atob(token.split('.')[1])); 
    setUserRole(decodedToken.rol);
    setUser(decodedToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
