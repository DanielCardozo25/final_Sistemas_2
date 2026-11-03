import express from 'express';
import { generarPDF } from '../controllers/pdf.controller.js';

const router = express.Router();
router.get('/:id', generarPDF);
export default router;
