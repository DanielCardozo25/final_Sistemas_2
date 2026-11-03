import mongoose from 'mongoose';

const contadorSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
}, {
  collection: 'contadores'
});

const Contador = mongoose.model('Contador', contadorSchema);
export default Contador;

