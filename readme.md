# Tienda de Insumos Informáticos — Monografía Cloud & E-Commerce

**Lenguaje:** JavaScript (Node.js & Express)

**Repositorio GitHub:** [__________________]

Aplicación web full-stack de comercio electrónico desarrollada como caso de estudio práctico para una monografía académica. Su objetivo principal es demostrar la implementación real y la convergencia de los tres modelos de computación en la nube (**SaaS, PaaS e IaaS**) en un entorno de producción simulado.

---

## ☁️ 1. Arquitectura y Modelos de Nube Aplicados

```
+---------------------------------------------------------------+
|                      CAPA SaaS (Software)                     |
|         PDFMonkey (Generación automatizada de tickets PDF)    |
+---------------------------------------------------------------+
                                |
                                v
+---------------------------------------------------------------+
|                      CAPA PaaS (Plataforma)                   |
|     Render (Hosting Node.js/Express) + MongoDB Atlas (DBaaS)  |
+---------------------------------------------------------------+
                                |
                                v
+---------------------------------------------------------------+
|                     CAPA IaaS (Infraestructura)               |
|      Entorno local / VPS Linux (Control de red y SO base)    |
+---------------------------------------------------------------+
```

* **SaaS (Software as a Service):** **PDFMonkey** provee el servicio listo para usar de renderizado y conversión de datos en documentos PDF oficiales para los tickets de compra.
* **PaaS (Platform as a Service):** **Render** automatiza el despliegue del código backend y la gestión del servidor web Node.js/Express. En paralelo, **MongoDB Atlas** gestiona la base de datos documental en la nube.
* **IaaS (Infrastructure as a Service):** Entorno operativo local o máquina virtual VPS (Linux), donde se configuran manualmente las interfaces de red, variables de entorno, puertos y la ejecución del demonio del sistema.

---

## 📂 2. Estructura de Archivos del Proyecto

```text
tienda-insumos-informaticos/
├── public/
│   ├── index.html        # Vista principal del catálogo y carrito
│   ├── css/
│   │   └── style.css     # Estilos CSS vainilla minimalistas
│   └── js/
│       └── app.js        # Lógica del cliente, carrito y peticiones Fetch
├── models/
│   ├── Cliente.js        # Esquema de Mongoose para clientes y saldo
│   ├── Producto.js       # Esquema de Mongoose para inventario y stock
│   ├── Ticket.js         # Esquema de Mongoose para comprobantes
│   └── Contador.js       # Contador de numeración de tickets
├── controllers/          # Lógica de negocio (producto, cliente, compra, ticket, auth, pdf)
├── routes/               # Rutas Express (productos, clientes, compra, tickets, auth, pdf)
├── middlewares/
├── config/
│   └── db.js             # Conexión a MongoDB Atlas
├── .env                  # Variables de entorno secretas (Ocultas en Git)
├── .gitignore            # Archivos excluidos del control de versiones
├── package.json          # Dependencias y scripts de Node.js
└── server.js             # Punto de entrada principal de la aplicación Express
```

---

## 🗄️ 3. Esquema de Base de Datos (`tienda_insumos_db`)

### Colección: `productos`
```json
{
  "_id": "ObjectId('...')",
  "nombre": "Placa de Video NVIDIA RTX 3060",
  "precio": 250000.00,
  "stock": 12,
  "imagen": "https://ejemplo.com/rtx3060.jpg"
}
```

### Colección: `clientes`
```json
{
  "_id": "ObjectId('...')",
  "nombre": "Carlos",
  "apellido": "Gómez",
  "mail": "carlos.gomez@mail.com",
  "formaPago": "saldo",
  "saldo": 500000.00,
  "clave": "pass1234"
}
```

### Colección: `tickets`
```json
{
  "_id": "ObjectId('...')",
  "nroTicket": 10042,
  "clienteId": "ObjectId('...')",
  "clienteNombre": "Carlos Gómez",
  "fecha": "03/11/2026",
  "hora": "12:00:00",
  "formaPago": "saldo",
  "items": [
    { "nombre": "Memoria RAM 8GB", "cantidad": 2, "precioUnitario": 35000, "subtotalLinea": 70000 }
  ],
  "totalArticulos": 2,
  "total": 70000.00
}
```

---

## 🚀 4. Despliegue en Producción (PaaS - Render)

* **URL oficial en producción:** [__________________]

---

## 🧪 5. Pruebas del Sistema (Flujo de Compra)

1. **Consulta inicial:** Al cargar la raíz (`/`), el cliente obtiene la lista de insumos informáticos desde MongoDB Atlas reflejando los precios y el `stock` en tiempo real.
2. **Selección:** El usuario interactúa con el carrito agregando unidades.
3. **Validación y Ejecución:** Al presionar el botón de pago, el backend valida de forma atómica:
   * Que el saldo del cliente sea mayor o igual al total de la compra.
   * Que exista suficiente `stock` en inventario para cada ítem seleccionado.
4. **Finalización:** Si las validaciones son exitosas, se descuenta el stock, se actualiza el saldo del cliente, se registra el ticket en la BD y se dispara la solicitud al SaaS de PDFMonkey para la descarga del comprobante.

---