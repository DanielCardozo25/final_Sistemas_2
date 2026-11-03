import express from 'express';
import { listarClientes, obtenerCliente, crearCliente, actualizarCliente, eliminarCliente, cambiarClave } from '../controllers/cliente.controller.js';

const router = express.Router();

router.get('/', listarClientes);
router.get('/:id', obtenerCliente);
router.post('/', crearCliente);
router.put('/:id', actualizarCliente);
router.put('/:id/clave', cambiarClave);

export default router;
