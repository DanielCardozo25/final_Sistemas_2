import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  nroTicket: { type: Number, required: true, unique: true },
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  clienteNombre: { type: String, required: true },
  fecha: { type: String, required: true },
  hora: { type: String, required: true },
  formaPago: { type: String, required: true },
  items: [{
    productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
    nombre: String,
    cantidad: Number,
    precioUnitario: Number,
    subtotalLinea: Number
  }],
  totalArticulos: { type: Number, required: true },
  total: { type: Number, required: true }
}, {
  collection: 'tickets'
});

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;
