import Ticket from '../models/Ticket.js';

export async function ticketsPorCliente(req, res) {
  try {
    const tickets = await Ticket.find({ clienteId: req.params.clienteId }).sort({ _id: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener tickets', error: error.message });
  }
}

export async function obtenerTicket(req, res) {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ mensaje: 'Ticket no encontrado' });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener ticket', error: error.message });
  }
}
