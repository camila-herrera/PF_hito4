import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../assets/styles.css';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    celular: '',
    direccion: '',
    ciudad: '',
    region: '',
    rut: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'confirmPassword') {
      setPasswordMatch(formData.password === value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMensaje('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/register`, formData);
      setMensaje(response.data.mensaje);
      setFormData({ nombre: '', apellido: '', email: '', password: '', confirmPassword: '', celular: '', direccion: '', ciudad: '', region: '', rut: '' });
      navigate('/login');
    } catch (error) {
      setMensaje(error.response?.data?.mensaje || 'Error en el registro');
    }
  };

  return (
    <>
      <Navbar />
      <Container className="mt-5 d-flex justify-content-center">
        <Card style={{ width: '48rem', margin: '50px' }} className="shadow-lg">
          <Card.Body>
            <Card.Title className="text-center" style={{ color: '#4C5425', fontSize: '2.5rem' }}>Registro</Card.Title>
            {mensaje && <p className="text-center text-danger">{mensaje}</p>}
            <Form onSubmit={handleSubmit}>
              <Row className="mt-3">
                <Col md={6}>
                  <Form.Group controlId="formGridFirstName">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control name="nombre" value={formData.nombre} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formGridLastName">
                    <Form.Label>Apellido</Form.Label>
                    <Form.Control name="apellido" value={formData.apellido} onChange={handleChange} required />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mt-3">
                <Col md={6}>
                  <Form.Group controlId="formGridEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formGridPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md={6}>
                  <Form.Group controlId="formGridConfirmPassword">
                    <Form.Label>Confirmar Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    {!passwordMatch && <p className="text-danger">Las contraseñas no coinciden</p>}
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md={6}>
                  <Form.Group controlId="formGridPhone">
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control name="celular" value={formData.celular} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formGridDNI">
                    <Form.Label>RUT (ID Number)</Form.Label>
                    <Form.Control name="rut" value={formData.rut} onChange={handleChange} required />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group controlId="formGridAddress" className="mt-3">
                <Form.Label>Dirección</Form.Label>
                <Form.Control name="direccion" value={formData.direccion} onChange={handleChange} required />
              </Form.Group>

              <Row className="mt-3">
                <Col md={6}>
                  <Form.Group controlId="formGridCity">
                    <Form.Label>Comuna</Form.Label>
                    <Form.Control name="ciudad" value={formData.ciudad} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formGridState">
                    <Form.Label>Región</Form.Label>
                    <Form.Control name="region" value={formData.region} onChange={handleChange} required />
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex justify-content-center mt-4">
                <Button variant="custom" type="submit" disabled={!passwordMatch}>Registrar</Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </>
  );
};

export default Register;

