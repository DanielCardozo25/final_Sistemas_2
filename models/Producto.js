import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  stock: { type: Number, required: true },
  imagen: { type: String, required: true }
}, {
  collection: 'productos'
});

const Producto = mongoose.model('Producto', productoSchema);
export default Producto;

