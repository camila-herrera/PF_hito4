crear pedidos en sql

CREATE TEMP TABLE temp_pedidos (data JSONB);

INSERT INTO temp_pedidos (data)

VALUES ('
[
  {
    "id_pedido": 20,
    "fecha_pedido": "2025-03-09T01:35:43.856Z",
    "total": "371880.00",
    "estado": "pendiente",
    "usuario": {
      "nombre": "francisco",
      "celular": "993917626",
      "direccion": "sin numero 555"
    }
  },
  {
    "id_pedido": 19,
    "fecha_pedido": "2025-03-08T23:28:23.063Z",
    "total": "250990.00",
    "estado": "entregado",
    "usuario": {
      "nombre": "francisco",
      "celular": "993917626",
      "direccion": "sin numero 555"
    }
  },
  {
    "id_pedido": 18,
    "fecha_pedido": "2025-03-08T23:20:41.476Z",
    "total": "174140.00",
    "estado": "entregado",
    "usuario": {
      "nombre": "francisco",
      "celular": "993917626",
      "direccion": "sin numero 555"
    }
  },
  {
    "id_pedido": 16,
    "fecha_pedido": "2025-03-08T23:00:13.610Z",
    "total": "290970.00",
    "estado": "entregado",
    "usuario": {
      "nombre": "carmen",
      "celular": "993917626",
      "direccion": "sin salida 11"
    }
  },
  {
    "id_pedido": 15,
    "fecha_pedido": "2025-03-07T13:23:28.318Z",
    "total": "66090.00",
    "estado": "pendiente",
    "usuario": {
      "nombre": "marta",
      "celular": "98765544",
      "direccion": "calle siempre viva 123"
    }
  },
  {
    "id_pedido": 14,
    "fecha_pedido": "2025-03-06T20:39:01.973Z",
    "total": "157490.00",
    "estado": "pendiente",
    "usuario": {
      "nombre": "marta",
      "celular": "98765544",
      "direccion": "calle siempre viva 123"
    }
  },
  {
    "id_pedido": 13,
    "fecha_pedido": "2025-03-06T18:33:20.892Z",
    "total": "594590.00",
    "estado": "entregado",
    "usuario": {
      "nombre": "nicolas",
      "celular": "967263348",
      "direccion": "pintor 2930"
    }
  },
  {
    "id_pedido": 12,
    "fecha_pedido": "2025-03-06T17:15:40.006Z",
    "total": "190530.00",
    "estado": "pendiente",
    "usuario": {
      "nombre": "luis",
      "celular": "967263345",
      "direccion": "pintor 2930"
    }
  },
  {
    "id_pedido": 11,
    "fecha_pedido": "2025-03-06T00:24:19.839Z",
    "total": "9990.00",
    "estado": "entregado",
    "usuario": {
      "nombre": "luis",
      "celular": "967263345",
      "direccion": "pintor 2930"
    }
  },
  {
    "id_pedido": 9,
    "fecha_pedido": "2025-03-06T00:17:37.677Z",
    "total": "42500.00",
    "estado": "pendiente",
    "usuario": {
      "nombre": "luis",
      "celular": "967263345",
      "direccion": "pintor 2930"
    }
  },
  {
    "id_pedido": 8,
    "fecha_pedido": "2025-03-06T00:16:08.985Z",
    "total": "250990.00",
    "estado": "pendiente",
    "usuario": {
      "nombre": "luis",
      "celular": "967263345",
      "direccion": "pintor 2930"
    }
  },
  {
    "id_pedido": 7,
    "fecha_pedido": "2025-03-06T00:15:22.649Z",
    "total": "199900.00",
    "estado": "pendiente",
    "usuario": {
      "nombre": "luis",
      "celular": "967263345",
      "direccion": "pintor 2930"
    }
  },
  {
    "id_pedido": 3,
    "fecha_pedido": "2025-03-05T22:45:40.123Z",
    "total": "100.00",
    "estado": "pendiente",
    "usuario": {
      "nombre": "luis",
      "celular": "967263345",
      "direccion": "pintor 2930"
    }
  },
  {
    "id_pedido": 2,
    "fecha_pedido": "2025-03-05T22:44:34.508Z",
    "total": "100.00",
    "estado": "pendiente",
    "usuario": {
      "nombre": "camila",
      "celular": "986243345",
      "direccion": "Pintor Alberto De La Cerda"
    }
  },
  {
    "id_pedido": 1,
    "fecha_pedido": "2025-03-02T17:10:39.684Z",
    "total": "100.00",
    "estado": "pendiente",
    "usuario": {
      "nombre": "Admin",
      "celular": "+56 9 1111 1111",
      "direccion": "Calle 1"
    }
  }
]');


SELECT * FROM temp_pedidos;

CREATE TYPE pedidos_type AS (
    nombre VARCHAR,
    descripcion TEXT,
    imagen_url VARCHAR,
    stock INT,
    precio NUMERIC(10,2)
);

INSERT INTO pedidos (nombre, descripcion, imagen_url, stock, precio)
SELECT * FROM jsonb_populate_recordset(NULL::pedidos_type, (SELECT data FROM temp_pedidos));

















UPDATE usuarios
SET rol = 'cliente'
WHERE id = 3;