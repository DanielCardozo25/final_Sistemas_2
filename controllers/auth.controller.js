import Cliente from '../models/Cliente.js';

function normalize(str) {
  return (str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export async function login(req, res) {
  const { usuario, password } = req.body;
  try {
    const clientes = await Cliente.find();
    const cliente = clientes.find(c => (normalize(c.mail) === normalize(usuario) || normalize(`${c.nombre}.${c.apellido}`) === normalize(usuario)) && normalize(c.clave) === normalize(password));
    if (!cliente) return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    res.json({ clienteId: cliente._id, nombre: cliente.nombre });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al iniciar sesión', error: error.message });
  }
}
