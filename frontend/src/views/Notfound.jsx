import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, Button } from 'react-bootstrap';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="flex-grow-1 d-flex justify-content-center align-items-center">
        <Card style={{ width: '40rem', backgroundColor: '#4C5425', color: 'white' }} className="shadow-lg p-4 text-center">
          <Card.Img 
            variant="top" 
            src="https://i.imgur.com/qIufhof.png" 
            alt="Página no encontrada" 
            style={{ width: '200px', margin: '0 auto' }} 
          />
          <Card.Body>
            <Card.Title style={{ fontSize: '2rem', fontWeight: 'bold' }}>¡Oops! Página no encontrada</Card.Title>
            <Card.Text style={{ fontSize: '1.2rem' }}>
              Parece que te has perdido en el camino...
            </Card.Text>
            <Button 
              variant="custom" 
              onClick={() => navigate('/')} 
              style={{ backgroundColor: '#E5B129', color: '#4C5425', fontWeight: 'bold' }}
            >
              Volver a Inicio
            </Button>
          </Card.Body>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
