const request = require('supertest');
const app = require('../app');
const dotenv = require('dotenv');
dotenv.config();
const pool = require('../config/db');
const jwt = require('jsonwebtoken');

let server;

beforeAll(async () => {
  server = app.listen(5000, () => {console.log('Servidor corriendo en puerto 5000');});
  await pool.query('DELETE FROM usuarios WHERE email LIKE $1', ['test%@example.com']);}, 10000); 

afterAll(async () => {
  await pool.end(); 
  await new Promise(resolve => server.close(resolve));}, 10000); 
  
describe('🔹 Pruebas de usuario', () => {
  const email = 'test@example.com';
  const password = 'Test1234!';
  const rut = '11555888-9';
  const celular = '+56912345678';
  const direccion = 'Calle Falsa 123';
  const ciudad = 'Santiago';
  const region = 'RM';

  test('✅ Registrar un nuevo usuario', async () => {
    const res = await request(server).post('/api/auth/register').send({
      nombre: 'Test',
      apellido: 'User',
      email,
      password,
      celular,
      rut,
      direccion,
      ciudad,
      region,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('mensaje', 'Usuario registrado correctamente');
  });
  
  test('✅ Iniciar sesión con usuario registrado', async () => {
    const res = await request(server).post('/api/auth/login').send({ email, password });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');

    const decodedToken = jwt.decode(res.body.token);
    const userId = decodedToken?.id;
    expect(userId).toBeDefined();
  });

  test('❌ No permitir registrar un usuario con el mismo email', async () => {
    const userData = {
        nombre: 'Test',
        apellido: 'User',
        email,
        password,
        celular,
        rut,
        direccion,
        ciudad,
        region,
    };

    await request(server).post('/api/auth/register').send(userData);
    const res = await request(server).post('/api/auth/register').send(userData); 

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('mensaje', 'El email o el RUT ya están registrados');
  });

  test('✅ Modificar el teléfono de un usuario', async () => {
    await request(server).post('/api/auth/register').send({
      nombre: 'Test',
      apellido: 'User',
      email,
      password,
      celular,
      direccion,
      ciudad,
      region,
      rut,
    });

    const loginRes = await request(server).post('/api/auth/login').send({ email, password });

    const token = loginRes.body.token;
    expect(token).toBeDefined();

    const res = await request(server)
      .put('/api/usuarios/modificar')
      .set('Authorization', `Bearer ${token}`)
      .send({ celular: '+56999999999' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('mensaje', 'Usuario actualizado correctamente');
  });

  test('✅ Ver productos disponibles', async () => {
    const loginRes = await request(server).post('/api/auth/login').send({ email, password });

    const token = loginRes.body.token;
    expect(token).toBeDefined();

    const res = await request(server)
      .get('/api/productos/')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('✅ Cliente puede ver su historial de pedidos', async () => {
    const loginRes = await request(server).post('/api/auth/login').send({ email, password });

    const token = loginRes.body.token;
    const decodedToken = jwt.decode(token);
    const userId = decodedToken?.id;
    expect(token).toBeDefined();
    expect(userId).toBeDefined();

    const res = await request(server)
      .get(`/api/pedidos/historial/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
