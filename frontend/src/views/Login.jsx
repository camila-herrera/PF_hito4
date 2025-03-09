import React, { useState } from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../assets/styles.css';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/login`, formData);
      if (response.status === 200) {
        const { token, rol } = response.data;
        login(token, rol); 
        navigate('/profile');
      } else {
        setMensaje(response.data.mensaje || 'Error al iniciar sesión');
      }
    } catch (error) {
      setMensaje(error.response?.data?.mensaje || 'Error al iniciar sesión');
    }
  };

  return (
    <>
      <Navbar />
      <Container className="mt-5 d-flex justify-content-center">
        <Card style={{ width: '48rem', margin: '50px' }} className="shadow-lg">
          <Card.Body>
          <Card.Title className="text-center" style={{ color: '#4C5425', fontSize: '2.5rem' }}>Bienvenido</Card.Title>
            {mensaje && <p className="text-center text-danger">{mensaje}</p>}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword" className="mt-3">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                />
              </Form.Group>

              <div className="text-center mt-3">
                <p className="mb-1" style={{ color: '#4C5425' }}>¿No tienes cuenta?</p>
                <Link 
                  to="/register" 
                  style={{ textDecoration: 'none', color: '#4C5425', fontWeight: 'bold' }}
                >
                  Regístrate aquí
                </Link>
              </div>

              <div className="d-flex justify-content-center mt-4">
                <Button variant="custom" type="submit">Ingresar</Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </>
  );
};

export default Login;
