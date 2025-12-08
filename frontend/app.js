const API_URL = "http://localhost:8081/api";
let cotizacionActualId = null;
let modalAgregarBootstrap = null;
let modalCotizacionBootstrap = null;
let modalStockBootstrap = null;
let modalDetalleVentaBootstrap = null;

let muebleEnEdicion = null;
let ventasGlobales = [];

document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('catalogo-list')) cargarCatalogo();
    if(document.getElementById('admin-table-body')) {
        cargarTablaAdmin();
        cargarTablaVariantes();
    }

    const modalAddEl = document.getElementById('modalAgregar');
    if(modalAddEl) modalAgregarBootstrap = new bootstrap.Modal(modalAddEl);
    const modalCotEl = document.getElementById('modalCotizacion');
    if(modalCotEl) modalCotizacionBootstrap = new bootstrap.Modal(modalCotEl);
    const modalStockEl = document.getElementById('modalStock');
    if(modalStockEl) modalStockBootstrap = new bootstrap.Modal(modalStockEl);
    const modalDetEl = document.getElementById('modalDetalleVenta');
    if(modalDetEl) modalDetalleVentaBootstrap = new bootstrap.Modal(modalDetEl);
});

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const bgClass = type === 'success' ? 'text-bg-success' : (type === 'danger' ? 'text-bg-danger' : 'text-bg-primary');
    const toastHtml = `<div class="toast align-items-center ${bgClass} border-0 mb-2 shadow" role="alert" aria-live="assertive" aria-atomic="true"><div class="d-flex"><div class="toast-body">${message}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div></div>`;
    container.insertAdjacentHTML('beforeend', toastHtml);
    const toastEl = container.lastElementChild;
    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}

async function cargarCatalogo() {
    try {
        const res = await fetch(`${API_URL}/muebles`);
        const muebles = await res.json();
        const contenedor = document.getElementById('catalogo-list');
        contenedor.innerHTML = '';
        if(muebles.length === 0) { contenedor.innerHTML = '<tr><td colspan="6" class="text-center py-5">No hay productos.</td></tr>'; return; }

        muebles.forEach(m => {
            if(m.estado === 'ACTIVO') {
                const tieneStock = m.stock > 0;
                const stockTxt = tieneStock ? m.stock : '<span class="text-danger fw-bold">Agotado</span>';
                const btnHtml = tieneStock
                    ? `<button class="btn btn-primary btn-sm" onclick="abrirModalAgregar(${m.id}, '${m.nombre}', ${m.precioBase}, ${m.stock})">Seleccionar</button>`
                    : `<button class="btn btn-secondary btn-sm" disabled>Sin Stock</button>`;

                contenedor.innerHTML += `
                <tr>
                    <td class="fw-bold">${m.nombre}</td>
                    <td>${m.tipo}</td>
                    <td>${m.material}</td>
                    <td>$${m.precioBase}</td>
                    <td>${stockTxt}</td>
                    <td class="text-end">${btnHtml}</td>
                </tr>`;
            }
        });
    } catch (e) { console.error(e); }
}

async function abrirModalAgregar(id, nombre, precio, maxStock) {
    document.getElementById('selected-mueble-id').value = id;
    document.getElementById('modal-titulo-mueble-span').innerText = nombre;
    document.getElementById('modal-precio-base').value = "$" + precio;
    document.getElementById('input-cantidad').value = 1;
    document.getElementById('input-cantidad').setAttribute('max', maxStock);
    const select = document.getElementById('select-variante');
    select.innerHTML = '<option value="">Sin variante</option>';
    try {
        const res = await fetch(`${API_URL}/variantes`);
        const variantes = await res.json();
        variantes.forEach(v => select.innerHTML += `<option value="${v.id}">${v.nombre} - $${v.incrementoPrecio}</option>`);
    } catch(e) {}
    modalAgregarBootstrap.show();
}

function adjustQty(d) {
    const i=document.getElementById('input-cantidad');
    let v=parseInt(i.value)+d;
    if(v>=1) i.value=v;
}

async function confirmarAgregarAlCarro() {
    const muebleId = document.getElementById('selected-mueble-id').value;
    const cantidad = document.getElementById('input-cantidad').value;
    const varianteVal = document.getElementById('select-variante').value;
    const varianteId = varianteVal === "" ? null : varianteVal;
    try {
        if(!cotizacionActualId) {
            const res = await fetch(`${API_URL}/cotizaciones`, { method: 'POST' });
            const data = await res.json();
            cotizacionActualId = data.id;
        }
        let url = `${API_URL}/cotizaciones/${cotizacionActualId}/items?muebleId=${muebleId}&cantidad=${cantidad}`;
        if(varianteId) url += `&varianteId=${varianteId}`;
        const resp = await fetch(url, { method: 'POST' });
        if(resp.ok) { modalAgregarBootstrap.hide(); showToast("Agregado al carrito", "success"); actualizarContadorCart(); }
        else { showToast("Error al agregar", "danger"); }
    } catch (e) { showToast("Error conexión", "danger"); }
}

function verCotizacion() {
    if(!cotizacionActualId) { showToast("Carrito vacío", "primary"); return; }
    actualizarModalCotizacion();
    modalCotizacionBootstrap.show();
}

function actualizarModalCotizacion() {
    fetch(`${API_URL}/cotizaciones/${cotizacionActualId}`).then(r=>r.json()).then(c => {
        document.getElementById('cotizacion-id').innerText = c.id;
        const tb = document.getElementById('lista-items');
        tb.innerHTML = '';
        let cnt=0;

        c.items.forEach(i => {
            cnt++;
            const vT = i.variante ? i.variante.nombre : '<span class="text-muted small">Estándar</span>';

            let alertaStock = "";
            if (i.cantidad > i.mueble.stock) {
                alertaStock = ` <br><span class="text-danger small fw-bold">(Stock insuficiente: ${i.mueble.stock})</span>`;
            }

            const btnEliminar = `<button class="btn btn-sm btn-outline-secondary" onclick="borrarItem(${i.id})">Eliminar</button>`;

            tb.innerHTML += `
            <tr>
                <td>
                    <span class="fw-bold">${i.mueble.nombre}</span>
                    ${alertaStock}
                </td>
                <td>${vT}</td>
                <td class="text-center">${i.cantidad}</td>
                <td class="text-end">$${i.subtotal}</td>
                <td class="text-end">${btnEliminar}</td>
            </tr>`;
        });
        document.getElementById('total-monto').innerText = c.total;
        document.getElementById('cart-count').innerText = cnt;
    });
}

async function borrarItem(itemId) {
    if(!confirm("¿Sacar del carrito?")) return;
    try {
        const res = await fetch(`${API_URL}/cotizaciones/${cotizacionActualId}/items/${itemId}`, { method: 'DELETE' });
        if(res.ok) {
            actualizarModalCotizacion();
            showToast("Eliminado del carrito");
        } else {
            showToast("Error al eliminar", "danger");
        }
    } catch(e) { console.error(e); }
}

function actualizarContadorCart() { fetch(`${API_URL}/cotizaciones/${cotizacionActualId}`).then(r=>r.json()).then(c=>document.getElementById('cart-count').innerText=c.items.length); }

function finalizarCompra() {
    if(!confirm("¿Confirmar compra?")) return;
    fetch(`${API_URL}/ventas/confirmar?cotizacionId=${cotizacionActualId}`, { method: 'POST' }).then(async r => {
        if(r.ok) {
            modalCotizacionBootstrap.hide();
            showToast("Compra Exitosa", "success");
            setTimeout(()=>window.location.reload(), 2000);
        } else {
            const t=await r.text();
            showToast(t, "danger");
        }
    });
}

function cargarTablaAdmin() {
    const tbody = document.getElementById('admin-table-body');
    if(!tbody) return;
    fetch(`${API_URL}/muebles`).then(r=>r.json()).then(data => {
        tbody.innerHTML = '';
        data.sort((a, b) => a.id - b.id);
        data.forEach(m => {
            const act = m.estado === 'ACTIVO';
            const estadoTxt = act ? 'Activo' : 'Inactivo';
            const btnAccion = act
                ? `<button class="btn btn-outline-secondary btn-sm" onclick="cambiarEstado(${m.id}, 'desactivar')">Desactivar</button>`
                : `<button class="btn btn-outline-secondary btn-sm" onclick="cambiarEstado(${m.id}, 'activar')">Activar</button>`;

            const stockCell = `<div class="d-flex justify-content-between align-items-center"><span>${m.stock}</span><button class="btn btn-light border btn-sm" onclick="abrirModalStock(${m.id})">Actualizar Stock</button></div>`;

            tbody.innerHTML += `
            <tr>
                <td>${m.id}</td><td>${m.nombre}</td><td>${m.tipo}</td>
                <td>$${m.precioBase}</td>
                <td>${stockCell}</td>
                <td>${estadoTxt}</td><td class="text-center">${btnAccion}</td>
            </tr>`;
        });
    });
}
function cambiarEstado(id, act) { fetch(`${API_URL}/muebles/${id}/${act}`, { method: 'PATCH' }).then(() => { cargarTablaAdmin(); showToast(act==='activar'?'Activado':'Desactivado'); }); }
async function abrirModalStock(id) { try { const r=await fetch(`${API_URL}/muebles/${id}`); muebleEnEdicion=await r.json(); document.getElementById('stock-nombre-mueble').innerText=muebleEnEdicion.nombre; document.getElementById('stock-input-nuevo').value=muebleEnEdicion.stock; modalStockBootstrap.show(); } catch(e){ showToast("Error cargar", "danger"); } }
async function guardarNuevoStock() { if(!muebleEnEdicion) return; muebleEnEdicion.stock = parseInt(document.getElementById('stock-input-nuevo').value); try { const r=await fetch(`${API_URL}/muebles/${muebleEnEdicion.id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(muebleEnEdicion)}); if(r.ok) { modalStockBootstrap.hide(); cargarTablaAdmin(); showToast("Stock actualizado"); } } catch(e){ showToast("Error", "danger"); } }

function cargarTablaVariantes() {
    const tbody = document.getElementById('tabla-variantes-body');
    if(!tbody) return;
    fetch(`${API_URL}/variantes`).then(r=>r.json()).then(data => {
        tbody.innerHTML = '';
        if(data.length === 0) { tbody.innerHTML = '<tr><td colspan="3" class="text-center text-muted py-3">No hay variantes creadas.</td></tr>'; return; }
        data.forEach(v => {
            tbody.innerHTML += `<tr><td class="ps-3 fw-medium">${v.nombre}</td><td>$${v.incrementoPrecio}</td><td class="text-end pe-3"><button class="btn btn-sm btn-outline-secondary" onclick="eliminarVariante(${v.id})">Eliminar</button></td></tr>`;
        });
    }).catch(e => { tbody.innerHTML = '<tr><td colspan="3" class="text-center text-danger">Error.</td></tr>'; });
}
function eliminarVariante(id) {
    if(!confirm("¿Eliminar variante?")) return;
    fetch(`${API_URL}/variantes/${id}`, { method: 'DELETE' }).then(res => { if(res.ok) { showToast("Eliminada"); cargarTablaVariantes(); } else { showToast("Error al eliminar", "danger"); }});
}
const formMueble = document.getElementById('form-mueble');
if(formMueble) {
    formMueble.addEventListener('submit', (e) => {
        e.preventDefault();

        const precioVal = document.getElementById('precio').value;
        const stockVal = document.getElementById('stock').value;

        if (parseFloat(precioVal) < 0 || parseInt(stockVal) < 0) {
            showToast("Error: El precio y el stock no pueden ser negativos.", "danger");
            return;
        }

        const data = {
            nombre: document.getElementById('nombre').value,
            tipo: document.getElementById('tipo').value,
            tamano: document.getElementById('tamano').value,
            precioBase: precioVal,
            stock: stockVal,
            material: 'Estandar', estado: 'ACTIVO'
        };
        fetch(`${API_URL}/muebles`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
            .then(async (res) => {
                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(errorText || "Error al crear");
                }
                formMueble.reset();
                showToast("Mueble creado", "success");
            })
            .catch((err) => {
                let msg = err.message;
                if(msg.includes('"message":')) {
                    try { msg = JSON.parse(msg).message; } catch(e){}
                }
                showToast(msg, "danger");
            });
    });
}
const formVariante = document.getElementById('form-variante');
if(formVariante) {
    formVariante.addEventListener('submit', (e) => {
        e.preventDefault();

        const precioVal = document.getElementById('var-precio').value;
        if (parseFloat(precioVal) < 0) {
            showToast("Error: El precio no puede ser negativo.", "danger");
            return;
        }

        const data = { nombre: document.getElementById('var-nombre').value, incrementoPrecio: precioVal };
        fetch(`${API_URL}/variantes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
            .then(() => { formVariante.reset(); cargarTablaVariantes(); showToast("Variante creada", "success"); });
    });
}

function cargarTablaVentas() {
    const tbody = document.getElementById('ventas-table-body');
    if(!tbody) return;
    tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4"><div class="spinner-border text-secondary"></div></td></tr>';
    fetch(`${API_URL}/ventas`).then(r=>r.json()).then(data => {
        ventasGlobales = data;
        tbody.innerHTML = '';
        if(data.length === 0) { tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-muted">Sin ventas.</td></tr>'; return; }
        data.sort((a, b) => b.id - a.id);
        data.forEach(v => {
            let f = new Date(v.fechaConfirmacion).toLocaleString();
            let cId = v.cotizacion ? v.cotizacion.id : 'N/A';
            tbody.innerHTML += `<tr><td>${v.id}</td><td>${f}</td><td>Cotización ${cId}</td><td class="text-end">$${v.total}</td><td class="text-center"><button class="btn btn-sm btn-outline-secondary" onclick="verDetalleVenta(${v.id})">Ver Detalle</button></td></tr>`;
        });
    });
}
function verDetalleVenta(id) {
    const v = ventasGlobales.find(x => x.id === id);
    if(!v) return;
    document.getElementById('detalle-venta-id').innerText = id;
    document.getElementById('detalle-venta-total').innerText = v.total;
    const tb = document.getElementById('detalle-venta-body'); tb.innerHTML = '';
    v.cotizacion.items.forEach(i => {
        const vt = i.variante ? i.variante.nombre : 'Estándar';
        tb.innerHTML += `<tr><td class="ps-4">${i.mueble.nombre}</td><td>${vt}</td><td class="text-center">${i.cantidad}</td><td class="text-end pe-4">$${i.subtotal}</td></tr>`;
    });
    modalDetalleVentaBootstrap.show();
}