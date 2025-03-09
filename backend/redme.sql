marketplace_seguridad

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,    
    celular VARCHAR(20) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    rut VARCHAR(12) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    rol VARCHAR(20) DEFAULT 'usuario'
);

CREATE TABLE productos (
  id_producto SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio NUMERIC(10, 2) NOT NULL,
  categoria VARCHAR(50),
  stock INT NOT NULL,
  imagen_url VARCHAR(255),
  fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pedidos (
  id_pedido SERIAL PRIMARY KEY,
  id_usuario INT NOT NULL,
  estado VARCHAR(20) CHECK (estado IN ('pendiente', 'enviado', 'entregado')) NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE detalle_pedidos (
  id_detalle SERIAL PRIMARY KEY,
  id_pedido INT NOT NULL,
  id_producto INT NOT NULL,
  cantidad INT NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  CONSTRAINT fk_pedido FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
  CONSTRAINT fk_producto FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE
);

CREATE TABLE transacciones (
  id_transaccion SERIAL PRIMARY KEY,
  id_pedido INT NOT NULL,
  fecha_transaccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  monto NUMERIC(10, 2) NOT NULL,
  metodo_pago VARCHAR(20) CHECK (metodo_pago IN ('tarjeta', 'transferencia', 'otros')) NOT NULL,
  estado VARCHAR(20) CHECK (estado IN ('completada', 'fallida')) NOT NULL,
  CONSTRAINT fk_pedido_transaccion FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE
);