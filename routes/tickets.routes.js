import express from 'express';
import { ticketsPorCliente, obtenerTicket } from '../controllers/ticket.controller.js';

const router = express.Router();
router.get('/cliente/:clienteId', ticketsPorCliente);
router.get('/:id', obtenerTicket);
export default router;
