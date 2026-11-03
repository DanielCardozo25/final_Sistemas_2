import mongoose from 'mongoose';

const clienteSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  formaPago: { type: String, required: true },
  saldo: { type: Number, required: true },
  clave: { type: String, required: true },
  mail: { type: String, required: true }
}, {
  collection: 'clientes'
});

const Cliente = mongoose.model('Cliente', clienteSchema);
export default Cliente;

