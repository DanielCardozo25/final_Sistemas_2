let clienteId = null;
let esInvitado = true;

let productos = [];
let carrito = [];

async function mostrarPerfil() {
    document.getElementById('tienda').classList.add('oculto');
    document.getElementById('carrito').classList.add('oculto');
    document.getElementById('perfil').classList.remove('oculto');
    const btn = document.querySelector('#bienvenida button');
    if (btn) { btn.textContent = 'Volver a compras'; btn.onclick = () => { document.getElementById('perfil').classList.add('oculto'); document.getElementById('tienda').classList.remove('oculto'); document.getElementById('carrito').classList.remove('oculto'); btn.textContent = 'Perfil'; btn.onclick = () => mostrarPerfil(); }; }
    const datos = document.getElementById('perfil-datos');
    datos.innerHTML = '';
    try {
        const r = await fetch('/api/clientes/' + clienteId);
        const c = await r.json();
        datos.innerHTML = '<p>Nombre: ' + c.nombre + ' ' + c.apellido + '</p><p>Mail: ' + c.mail + '</p><p>Forma de pago: ' + c.formaPago + '</p>';
    } catch (e) { console.error(e); }
    const cont = document.getElementById('tickets-lista');
    cont.innerHTML = '';
    try {
        const res = await fetch('/api/tickets/cliente/' + clienteId);
        const tickets = await res.json();
        tickets.forEach(t => {
            const div = document.createElement('div');
            div.textContent = t.fecha + ' ' + t.hora + ' - Total: $' + t.total;
            div.style.cursor = 'pointer';
            div.onclick = () => mostrarTicket(t._id);
            cont.appendChild(div);
            cont.appendChild(document.createElement('br'));
        });
    } catch (e) { console.error(e); }
}

async function mostrarTicket(id) {
    try {
        const res = await fetch('/api/tickets/' + id);
        const t = await res.json();
        const det = document.getElementById('ticket-detalle');
        det.innerHTML = '<p>Nro: ' + t.nroTicket + '</p><p>Cliente: ' + t.clienteNombre + '</p><p>Fecha: ' + t.fecha + ' ' + t.hora + '</p><p>Forma pago: ' + t.formaPago + '</p><p>Total: $' + t.total + '</p><p>Items:</p>' + t.items.map(i => '<p>' + i.nombre + ' x' + i.cantidad + ' - $' + i.precioUnitario + '</p>').join('') + '<br><button id="btn-imprimir" class="btn-comprar">Descargar ticket</button>';
        document.getElementById('btn-imprimir').onclick = () => imprimirTicket(t._id);
    } catch (e) { console.error(e); }
}
async function cargarProductos() {
    try {
        const res = await fetch('/api/productos');
        productos = await res.json();
        mostrarProductos();
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

function mostrarProductos() {
    const contenedor = document.getElementById('productos');
    contenedor.innerHTML = '';
    productos.forEach(producto => {
        const card = document.createElement('div');
        card.className = 'producto-card';
        card.innerHTML = '<img src=\"' + producto.imagen + '\" alt=\"' + producto.nombre + '\">' +
            '<h3>' + producto.nombre + '</h3>' +
            '<p class=\"precio\">$' + producto.precio + '</p>' +
            '<p class=\"stock\">Stock disponible: ' + producto.stock + '</p>' +
            '<button class=\"btn-agregar\" onclick=\"agregarAlCarrito(\'' + producto._id + '\')\">Agregar al carrito</button>';
        contenedor.appendChild(card);
    });
}

function agregarAlCarrito(productoId) {
    const producto = productos.find(p => p._id === productoId);
    const itemEnCarrito = carrito.find(item => item.productoId === productoId);
    if (itemEnCarrito) {
        if (itemEnCarrito.cantidad < producto.stock) {
            itemEnCarrito.cantidad++;
        } else {
            document.getElementById('modal-stock').classList.remove('oculto');
            return;
        }
    } else {
        if (producto.stock < 1) {
            document.getElementById('modal-stock').classList.remove('oculto');
            return;
        }
        carrito.push({ productoId: producto._id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 });
    }
    mostrarCarrito();
}

function mostrarCarrito() {
    const contenedor = document.getElementById('carrito-items');
    contenedor.innerHTML = '';
    let subtotal = 0;
    carrito.forEach((item, index) => {
        subtotal += item.precio * item.cantidad;
        const div = document.createElement('div');
        div.className = 'carrito-item';
        div.innerHTML = '<div><strong>' + item.nombre + '</strong><br><small>$' + item.precio + ' x ' + item.cantidad + '</small></div><button onclick=\"quitarDelCarrito(' + index + ')\">Quitar</button>';
        contenedor.appendChild(div);
    });
    document.getElementById('total').textContent = subtotal;
    const pago = document.getElementById('pago');
    if (pago) pago.classList.toggle('oculto', carrito.length === 0);
}

function quitarDelCarrito(index) {
    carrito.splice(index, 1);
    mostrarCarrito();
}

document.getElementById('btn-login').addEventListener('click', () => {
    document.getElementById('login').classList.toggle('oculto');
});

document.getElementById('btn-do-login').addEventListener('click', async () => {
    const msg = document.getElementById('mensaje-login');
    msg.textContent = '';
    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;
    try {
        const res = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, password })
        });
        const data = await res.json();
        if (!res.ok) { msg.textContent = data.mensaje; return; }
        clienteId = data.clienteId;
        esInvitado = false;
        msg.textContent = 'Sesión iniciada: ' + data.nombre;
        document.getElementById('login').classList.add('oculto');
        document.getElementById('btn-login').classList.add('oculto');
        const b = document.getElementById('bienvenida');
        b.textContent = 'Sesión de ' + data.nombre;
        b.classList.remove('oculto');
        const btnPerfil = document.createElement('button');
        btnPerfil.textContent = 'Perfil';
        btnPerfil.className = 'btn-comprar';
        btnPerfil.onclick = () => mostrarPerfil();
        b.appendChild(btnPerfil);
        try {
            const r = await fetch('/api/clientes/' + clienteId);
            const c = await r.json();
            const sel = document.getElementById('medio-pago');
            sel.innerHTML = "<option value=''>Seleccionar</option>";
            (c.formaPago || '').split(',').forEach(m => {
                m = m.trim();
                if (m) { const o = document.createElement('option'); o.value = m; o.textContent = m; sel.appendChild(o); }
            });
        } catch (e) { console.error(e); }
    } catch (error) {
        msg.textContent = 'Error al iniciar sesión';
        console.error(error);
    }
});

document.getElementById('btn-comprar').addEventListener('click', () => {
    const mensaje = document.getElementById('mensaje-compra');
    mensaje.textContent = '';
    if (carrito.length === 0) { mensaje.textContent = 'El carrito está vacío'; return; }
    if (esInvitado || !clienteId) { mensaje.textContent = 'Debe loggearse para comprar'; return; }
    document.getElementById('pago').classList.remove('oculto');
});

document.getElementById('btn-confirmar-pago').addEventListener('click', async () => {
    const btn = document.getElementById('btn-confirmar-pago');
    const mensaje = document.getElementById('mensaje-compra');
    mensaje.textContent = '';
    const medio = document.getElementById('medio-pago').value;
    if (!medio) { mensaje.textContent = 'Seleccione medio de pago'; return; }
    btn.disabled = true;
    try {
        const res = await fetch('/api/compra', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clienteId: clienteId, medioPago: medio, carrito: carrito.map(item => ({ productoId: item.productoId, cantidad: item.cantidad })) })
        });
        const data = await res.json();
        if (!res.ok) { mensaje.textContent = data.mensaje; btn.disabled = false; return; }
        document.getElementById('modal-exito').classList.remove('oculto');
        carrito = [];
        mostrarCarrito();
        btn.disabled = false;
    } catch (error) {
        mensaje.textContent = 'Error al procesar la compra';
        console.error(error);
        btn.disabled = false;
    }
});
document.getElementById('btn-confirmar-clave').addEventListener('click', async () => {
    const msg = document.getElementById('mensaje-clave');
    msg.textContent = '';
    const actual = document.getElementById('clave-actual').value;
    const nueva = document.getElementById('clave-nueva').value;
    try {
        const res = await fetch('/api/clientes/' + clienteId + '/clave', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ claveActual: actual, claveNueva: nueva })
        });
        const data = await res.json();
        if (!res.ok) {
            document.getElementById('modal-clave-msg').textContent = 'datos erroneos';
            document.getElementById('modal-clave').classList.remove('oculto');
            return;
        }
        document.getElementById('modal-clave-msg').textContent = 'clave cambiada con exito';
        document.getElementById('modal-clave').classList.remove('oculto');
        document.getElementById('modal-clave-ok').onclick = () => { document.getElementById('modal-clave').classList.add('oculto'); document.getElementById('cambio-clave').classList.add('oculto'); document.getElementById('btn-cambiar-clave').classList.remove('oculto'); mostrarPerfil(); };
    } catch (e) { msg.textContent = 'Error'; console.error(e); }
});
cargarProductos();

document.getElementById('modal-cerrar').addEventListener('click', () => document.getElementById('modal-exito').classList.add('oculto'));
document.getElementById('modal-ok').addEventListener('click', () => document.getElementById('modal-exito').classList.add('oculto'));

document.getElementById('modal-stock-cerrar').addEventListener('click', () => document.getElementById('modal-stock').classList.add('oculto'));
document.getElementById('modal-stock-ok').addEventListener('click', () => document.getElementById('modal-stock').classList.add('oculto'));

function imprimirTicket(id) {
  fetch('/api/pdf/' + id).then(r => r.json()).then(data => {
    if (data.downloadUrl) window.open(data.downloadUrl, '_blank');
    else alert((data.mensaje || 'Error al generar PDF') + (data.detail ? ': ' + JSON.stringify(data.detail) : '') + (data.error ? ': ' + data.error : ''));
  }).catch(e => { console.error(e); alert('Error al generar PDF'); });
}

document.getElementById('btn-cambiar-clave').addEventListener('click', () => { document.getElementById('btn-cambiar-clave').classList.add('oculto'); document.getElementById('cambio-clave').classList.remove('oculto'); });

document.getElementById('modal-clave-cerrar').addEventListener('click', () => document.getElementById('modal-clave').classList.add('oculto'));
document.getElementById('modal-clave-ok').addEventListener('click', () => document.getElementById('modal-clave').classList.add('oculto'));
