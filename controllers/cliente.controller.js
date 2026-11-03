import Cliente from '../models/Cliente.js';

export async function listarClientes(req, res) {
  try {
    const clientes = await Cliente.find().select('nombre apellido');
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener clientes', error: error.message });
  }
}

export async function obtenerCliente(req, res) {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener cliente', error: error.message });
  }
}

export async function crearCliente(req, res) {
  try {
    const cliente = await Cliente.create(req.body);
    res.status(201).json(cliente);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear cliente', error: error.message });
  }
}

export async function actualizarCliente(req, res) {
  try {
    const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar cliente', error: error.message });
  }
}

export async function eliminarCliente(req, res) {
  try {
    const cliente = await Cliente.findByIdAndDelete(req.params.id);
    if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    res.json({ mensaje: 'Cliente eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar cliente', error: error.message });
  }
}

export async function cambiarClave(req, res) {
  const { claveActual, claveNueva } = req.body;
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    if (cliente.clave !== claveActual) return res.status(401).json({ mensaje: 'Clave actual incorrecta' });
    cliente.clave = claveNueva;
    await cliente.save();
    res.json({ mensaje: 'Clave actualizada' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar clave', error: error.message });
  }
}
