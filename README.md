### backend deploy: https://pf-hito4.onrender.com/api


## 📌 API Endpoints: 

- Despues de descargar el programa, clonar o forkear este repositorio debes saber que tienes que: 

### SE DEBE EJECUTAR LOS CODIGOS DESDE LA CARPETA BACKEND EN LA TERMINAL

### Instalar dependencias con:
npm install

### Configurar sus variables de entorno para que corra el programa, lo minimo necesario intalado sera así:

### **.env (archivo por crear en backend)**
- DB_USER=DB_USER=postgres
- DB_HOST=localhost
- DB_NAME= ***
- DB_PASSWORD= ***
- DB_PORT= 5432
- JWT_SECRET= ***


### Luego de ello para poder ejecurtar el back puede hacerlo con :
- npm run dev
- npm start


### Dejo los datos para el frontend donde igual hay que instalar dependencias (npm install)y crear el archivo .env dentro del frontend.

### **.env frontend**
- VITE_API_URL=http://localhost:5000/api



### **🔐 Autenticación (`/api/auth`)**  
- **POST `/register`** → Registra un nuevo usuario.  
- **POST `/login`** → Inicia sesión y devuelve un token.  
- **GET `/`** → Obtiene detalles del usuario autenticado. *(Requiere token: `usuario` o `admin`)*  
- **PUT `/modificar`** → Modifica datos del usuario autenticado. *(Requiere token: `usuario`)*  
- **GET `/:id`** → Obtiene detalles de un usuario por ID. *(Requiere autenticación)*  

<br>

### **👤 Usuarios (`/api/usuarios`)**  
- **GET `/`** → Obtiene detalles del usuario autenticado. *(Requiere token: `usuario` o `admin`)*  
- **PUT `/modificar`** → Modifica datos del usuario autenticado. *(Requiere token: `usuario`)*  
- **GET `/:id`** → Obtiene detalles de un usuario por ID. *(Requiere autenticación)*  

<br>

### **🛍️ Productos (`/api/productos`)**  
- **GET `/`** → Obtiene todos los productos.  
- **POST `/`** → Crea un nuevo producto. *(Requiere token: `admin`)*  
- **PUT `/:id_producto`** → Actualiza un producto. *(Requiere token: `admin`)*  
- **DELETE `/:id_producto`** → Elimina un producto. *(Requiere token: `admin`)*  

<br>

### **📦 Pedidos (`/api/pedidos`)**  
- **POST `/`** → Crea un nuevo pedido.  
- **GET `/historial`** → Obtiene todos los pedidos.  
- **GET `/:id_usuario`** → Obtiene los pedidos de un usuario específico.  
- **GET `/historial/:id`** → Obtiene el detalle de un pedido específico.  
- **PUT `/actualizar`** → Actualiza el estado de un pedido.  

<br>

### **💳 Transacciones (`/api/transacciones`)**  
- **POST `/`** → Completa una transacción y devuelve un mensaje de éxito. 

<br>


(en el backend puedes hacer correr el index que esta en public, esto te muestra un poco la composicion del backend) DEBES TENER EL SERVIDOR LEVANTADO PARA VER LA INTERFAZ

### backend deploy: https://pf-hito4.onrender.com/api
