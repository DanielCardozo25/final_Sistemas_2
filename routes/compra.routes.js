import express from 'express';
import { realizarCompra } from '../controllers/compra.controller.js';

const router = express.Router();
router.post('/', realizarCompra);
export default router;
