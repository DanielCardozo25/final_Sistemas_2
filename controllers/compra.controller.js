import Producto from '../models/Producto.js';
import Cliente from '../models/Cliente.js';
import Ticket from '../models/Ticket.js';
import Contador from '../models/Contador.js';
import fs from 'fs';
import path from 'path';

async function obtenerSiguienteNroTicket() {
  const contador = await Contador.findOneAndUpdate(
    { _id: 'ticket' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return contador.seq;
}

export async function realizarCompra(req, res) {
  const { clienteId, carrito, medioPago } = req.body;

  if (!clienteId || !carrito || carrito.length === 0) {
    return res.status(400).json({ mensaje: 'Cliente y carrito son requeridos' });
  }

  try {
    const cliente = await Cliente.findById(clienteId);
    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }

    let subtotal = 0;
    const itemsValidados = [];

    for (const item of carrito) {
      const producto = await Producto.findById(item.productoId);
      if (!producto) {
        return res.status(404).json({ mensaje: `Producto no encontrado: ${item.productoId}` });
      }
      if (producto.stock < item.cantidad) {
        return res.status(400).json({ mensaje: `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}` });
      }
      const precioUnitario = producto.precio;
      const subtotalLinea = precioUnitario * item.cantidad;
      subtotal += subtotalLinea;
      itemsValidados.push({
        productoId: producto._id,
        nombre: producto.nombre,
        cantidad: item.cantidad,
        precioUnitario,
        subtotalLinea
      });
    }

    const total = subtotal;
    if (cliente.saldo < total) {
      return res.status(400).json({ mensaje: `Saldo insuficiente. Saldo: ${cliente.saldo}, Total: ${total}` });
    }

    const nroTicket = await obtenerSiguienteNroTicket();
    const fecha = new Date();
    const fechaStr = fecha.toLocaleDateString();
    const horaStr = fecha.toLocaleTimeString();
    const totalArticulos = itemsValidados.reduce((a, b) => a + b.cantidad, 0);

    const ticket = new Ticket({
      nroTicket,
      clienteId: cliente._id,
      clienteNombre: `${cliente.nombre} ${cliente.apellido}`,
      fecha: fechaStr,
      hora: horaStr,
      formaPago: medioPago || cliente.formaPago,
      items: itemsValidados,
      totalArticulos,
      total
    });

    await ticket.save();

    for (const item of itemsValidados) {
      await Producto.findOneAndUpdate(
        { _id: item.productoId, stock: { $gte: item.cantidad } },
        { $inc: { stock: -item.cantidad } }
      );
    }

    await Cliente.findByIdAndUpdate(clienteId, { $inc: { saldo: -total } });

    const dir = path.join(process.cwd(), 'tickets_compra');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const stamp = fecha.toISOString().replace(/[:.]/g, '-');
    const fileName = `${cliente._id}_${stamp}.txt`;
    const filePath = path.join(dir, fileName);
    const contenido = `Ticket: ${nroTicket}\nCliente: ${cliente.nombre}\nFecha: ${fecha.toLocaleString()}\nTotal: ${total}\nItems:\n` + itemsValidados.map(i => `- ${i.nombre} x${i.cantidad} = ${i.subtotalLinea}`).join('\n');
    fs.writeFileSync(filePath, contenido);

    res.json({
      mensaje: 'Compra realizada con éxito',
      ticket
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al procesar compra', error: error.message });
  }
}
