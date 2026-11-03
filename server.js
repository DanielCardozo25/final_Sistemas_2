import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import conectarDB from './config/db.js';
import productosRoutes from './routes/productos.routes.js';
import compraRoutes from './routes/compra.routes.js';
import clientesRoutes from './routes/clientes.routes.js';
import authRoutes from './routes/auth.routes.js';
import ticketsRoutes from './routes/tickets.routes.js';
import pdfRoutes from './routes/pdf.routes.js';

dotenv.config();
conectarDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/productos', productosRoutes);
app.use('/api/compra', compraRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketsRoutes);
app.use('/api/pdf', pdfRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

