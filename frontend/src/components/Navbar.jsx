import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

const CustomNavbar = () => {
  const { isAuthenticated, userRole, logout } = useAuth();
  const { cartTotal } = useCart();

  return (
    <Navbar expand="lg" style={{ backgroundColor: '#4C5425' }} className="shadow-sm p-3">
      <Container className="justify-content-between">
        <Navbar.Brand>
          <Link to="/" className="d-flex align-items-center text-decoration-none">
            <img
              src="/logo-leo.jpg"
              alt="Selk Nam Survival Store"
              height="50"
              className="me-2 rounded-circle"
            />
            <span className="fw-bold text-light">Selk Nam Store</span>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <ul className="navbar-nav text-center">
            {!isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-light hover:text-warning" to="/login">Ingresar</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-light hover:text-warning" to="/register">Registrarse</Link>
                </li>
              </>
            ) : (
              <>
                {userRole === 'usuario' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link text-light hover:text-warning" to="/profile">Perfil</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link text-light hover:text-warning" to="/carrito">
                         <>Carrito:{cartTotal().toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</>
                      </Link>
                    </li>
                  </>
                )}
                {(userRole === 'cliente' || userRole === 'admin') && (
                  <li className="nav-item">
                    <Link className="nav-link text-light hover:text-warning" to="/pedidos">Pedidos</Link>
                  </li>
                )}
                <li className="nav-item">
                  <button
                    className="btn hover:bg-warning"
                    style={{ backgroundColor: '#E5B129', color: '#000' }}
                    onClick={logout}
                  >
                    Cerrar sesion
                  </button>
                </li>
              </>
            )}
          </ul>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;


