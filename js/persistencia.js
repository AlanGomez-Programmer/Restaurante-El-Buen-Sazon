// Archivo de persistencia para la base de datos
// Este archivo es la única capa de acceso a localStorage para inventario, platillos y pedidos

// ================== INVENTARIO ==================
const STORAGE_KEY_INVENTARIO = 'el_buen_sazon_inventario';

// Normaliza nombres: trim, colapsa espacios y capitaliza cada palabra
function normalizarNombre(nombre) {
    const base = (nombre || '').trim().replace(/\s+/g, ' ');
    return base.split(' ').map(p => p ? p.charAt(0).toUpperCase() + p.slice(1).toLowerCase() : '').join(' ');
}

// Cargar datos del inventario del localStorage
function cargarDatosInventario() {
    const datosGuardados = localStorage.getItem(STORAGE_KEY_INVENTARIO);
    if (datosGuardados) {
        return JSON.parse(datosGuardados);
    }
    // Si no hay datos, sembrar desde el catálogo base de Insumos.js
    const datosInsumos = obtenerDatosInsumos();
    const tiposNormalizados = {};
    Object.entries(datosInsumos).forEach(([codigoTipo, tipo]) => {
        const prefijo = (codigoTipo || '').toString().replace(/[^A-Za-z0-9]/g, '').toUpperCase();
        const insumos = Array.isArray(tipo.insumos) ? tipo.insumos : [];
        tiposNormalizados[codigoTipo] = {
            tipo: codigoTipo,
            nombre: tipo.nombre,
            unidadMedida: tipo.unidadMedida || 'unidad',
            insumos: insumos.map((insumo, idx) => ({
                codigo: `${prefijo}-${String(idx + 1).padStart(2, '0')}`,
                nombre: insumo.nombre || `Insumo ${idx + 1}`
            }))
        };
    });
    return {
        tiposInsumos: tiposNormalizados,
        insumosRegistrados: []
    };
}

// Guardar datos del inventario en localStorage
function guardarDatosInventario(datos) {
    localStorage.setItem(STORAGE_KEY_INVENTARIO, JSON.stringify(datos));
}

// Obtener todos los tipos de insumos
function obtenerTiposInsumos() {
    const datos = cargarDatosInventario();
    return datos.tiposInsumos;
}

// Obtener insumos por tipo
function obtenerInsumosPorTipo(codigoTipo) {
    const datos = cargarDatosInventario();
    const tipo = datos.tiposInsumos[codigoTipo];
    return tipo ? tipo.insumos : [];
}

// Obtener la unidad de medida según el tipo de insumo
function obtenerUnidadMedida(codigoTipo) {
    const datos = cargarDatosInventario();
    const tipo = datos.tiposInsumos[codigoTipo];
    return tipo ? tipo.unidadMedida || 'unidad' : 'unidad';
}

// Obtener nombre del tipo de insumo
function obtenerNombreTipo(codigoTipo) {
    const datos = cargarDatosInventario();
    const tipo = datos.tiposInsumos[codigoTipo];
    return tipo ? tipo.nombre : '';
}

// Obtener nombre del insumo
function obtenerNombreInsumo(codigoTipo, codigoInsumo) {
    const datos = cargarDatosInventario();
    const tipo = datos.tiposInsumos[codigoTipo];
    if (!tipo) return '';
    
    const insumo = tipo.insumos.find(i => i.codigo === codigoInsumo);
    return insumo ? insumo.nombre : '';
}

// Agregar nuevo tipo de insumo (evita duplicados por código o nombre). Retorna true si creó, false si ya existe.
function agregarTipoInsumo(codigo, nombre, unidadMedida) {
    const datos = cargarDatosInventario();
    const tipos = datos.tiposInsumos || {};
    // Validar duplicado por código
    if (tipos[codigo]) {
        return false;
    }
    // Validar duplicado por nombre (insensible a mayúsculas/minúsculas)
    const nombreNorm = (nombre || '').trim().toLowerCase();
    const duplicadoNombre = Object.values(tipos).some(t => (t.nombre || '').trim().toLowerCase() === nombreNorm);
    if (duplicadoNombre) {
        return false;
    }
    const nombreFmt = normalizarNombre(nombre);
    tipos[codigo] = {
        tipo: codigo,
        nombre: nombreFmt,
        unidadMedida: unidadMedida,
        insumos: []
    };
    datos.tiposInsumos = tipos;
    guardarDatosInventario(datos);
    return true;
}

// Agregar nuevo insumo a un tipo existente (código generado automáticamente, no incremental)
function agregarInsumo(codigoTipo, nombreInsumo) {
    const datos = cargarDatosInventario();
    if (datos.tiposInsumos[codigoTipo]) {
        const lista = datos.tiposInsumos[codigoTipo].insumos || [];
        const nombreNorm = (nombreInsumo || '').trim().toLowerCase();
        const duplicado = lista.some(i => (i.nombre || '').trim().toLowerCase() === nombreNorm);
        if (duplicado) {
            return false;
        }

        const prefijo = (codigoTipo || '').toString().replace(/[^A-Za-z0-9]/g, '').toUpperCase();
        let codigoGenerado = `${prefijo}-${Date.now().toString().slice(-6)}`;
        const existeCodigo = (c) => lista.some(i => i.codigo === c);
        if (existeCodigo(codigoGenerado)) {
            codigoGenerado = `${prefijo}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
        }
        const nombreFmt = normalizarNombre(nombreInsumo);
        lista.push({
            codigo: codigoGenerado,
            nombre: nombreFmt
        });
        datos.tiposInsumos[codigoTipo].insumos = lista;
        guardarDatosInventario(datos);
        return true;
    }
    return false;
}

// Registrar insumo completo (cantidad, unidad, fecha, descripción)
// Siempre crea un nuevo registro; los totales globales se agrupan aparte
function registrarInsumo(insumo) {
    const datos = cargarDatosInventario();
    datos.insumosRegistrados.push({
        id: Date.now(),
        ...insumo,
        fechaRegistro: new Date().toISOString()
    });
    guardarDatosInventario(datos);
}

// Obtener totales globales de insumos (agrupados por tipo+insumo, sumando cantidades)
function obtenerTotalesGlobalesInsumos() {
    const insumos = obtenerInsumosRegistrados();
    const totales = {};
    
    insumos.forEach(insumo => {
        const clave = `${insumo.tipoCodigo || ''}::${insumo.insumoCodigo || ''}`;
        if (!totales[clave]) {
            totales[clave] = {
                tipoCodigo: insumo.tipoCodigo,
                tipoNombre: insumo.tipoNombre,
                insumoCodigo: insumo.insumoCodigo,
                insumoNombre: insumo.insumoNombre,
                unidad: insumo.unidad,
                cantidadTotal: 0,
                registros: []
            };
        }
        const cantidad = parseFloat(insumo.cantidad) || 0;
        totales[clave].cantidadTotal += cantidad;
        totales[clave].registros.push(insumo);
    });
    
    return Object.values(totales);
}

// Obtener todos los insumos registrados
function obtenerInsumosRegistrados() {
    const datos = cargarDatosInventario();
    return datos.insumosRegistrados;
}

// Actualizar cantidad de un insumo registrado por ID
function actualizarCantidadInsumo(id, nuevaCantidad) {
    const datos = cargarDatosInventario();
    const index = datos.insumosRegistrados.findIndex(i => i.id === id);
    if (index !== -1) {
        datos.insumosRegistrados[index].cantidad = nuevaCantidad;
        guardarDatosInventario(datos);
        return true;
    }
    return false;
}

// Eliminar un insumo registrado por ID
function eliminarInsumoRegistrado(id) {
    const datos = cargarDatosInventario();
    const index = datos.insumosRegistrados.findIndex(i => i.id === id);
    if (index !== -1) {
        datos.insumosRegistrados.splice(index, 1);
        guardarDatosInventario(datos);
        return true;
    }
    return false;
}

// ================== PLATILLOS ==================
const STORAGE_KEY_PLATILLOS = 'el_buen_sazon_platillos';
const STORAGE_KEY_CONTADOR_PLATILLOS = 'el_buen_sazon_contador_platillos';

// Cargar datos de platillos del localStorage
// Siempre fusiona los tipos predefinidos para que los 10 tipos base estén disponibles
function cargarDatosPlatillos() {
    let datos = {
        tiposPlatillos: {},
        platillosRegistrados: []
    };
    
    const datosGuardados = localStorage.getItem(STORAGE_KEY_PLATILLOS);
    if (datosGuardados) {
        datos = JSON.parse(datosGuardados);
    }
    // Migración: claves de tipos por NOMBRE (ya no por código)
    if (!datos.tiposPlatillos) datos.tiposPlatillos = {};
    const mappingCodigoANombre = Object.fromEntries(
        Object.entries(datosTiposPlatillosBase).map(([cod, obj]) => [cod, obj.nombre])
    );
    let cambio = false;
    const nuevosTipos = {};
    for (const [clave, tipo] of Object.entries(datos.tiposPlatillos)) {
        const nombreTipo = (tipo && tipo.nombre) ? tipo.nombre : mappingCodigoANombre[clave] || clave;
        const nuevaClave = (typeof normalizarNombre === 'function') ? normalizarNombre(nombreTipo) : nombreTipo;
        if (!nuevosTipos[nuevaClave]) {
            nuevosTipos[nuevaClave] = {
                nombre: nombreTipo,
                platillos: Array.isArray(tipo?.platillos) ? tipo.platillos : []
            };
        }
        if (nuevaClave !== clave) cambio = true;
    }
    if (cambio) {
        datos.tiposPlatillos = nuevosTipos;
        // Migrar platillos existentes: tipoCodigo de código -> nombre
        if (Array.isArray(datos.platillosRegistrados)) {
            datos.platillosRegistrados = datos.platillosRegistrados.map(p => {
                const nuevoTipo = mappingCodigoANombre[p.tipoCodigo] || p.tipoCodigo;
                return { ...p, tipoCodigo: nuevoTipo };
            });
        }
    }

    // Asegurar que existan los tipos base por NOMBRE
    Object.keys(datosTiposPlatillosBase).forEach(codigo => {
        const nombreBase = datosTiposPlatillosBase[codigo].nombre;
        const clave = (typeof normalizarNombre === 'function') ? normalizarNombre(nombreBase) : nombreBase;
        if (!datos.tiposPlatillos[clave]) {
            datos.tiposPlatillos[clave] = { nombre: nombreBase, platillos: [] };
            cambio = true;
        }
    });

    if (cambio) {
        localStorage.setItem(STORAGE_KEY_PLATILLOS, JSON.stringify(datos));
    }
    
    return datos;
}

// Guardar datos de platillos en localStorage
// Antes de guardar, fusiona los tipos base para que nunca se pierdan
function guardarDatosPlatillos(datos) {
    if (!datos.tiposPlatillos) datos.tiposPlatillos = {};
    // Asegurar base por NOMBRE
    Object.keys(datosTiposPlatillosBase).forEach(codigo => {
        const nombreBase = datosTiposPlatillosBase[codigo].nombre;
        const clave = (typeof normalizarNombre === 'function') ? normalizarNombre(nombreBase) : nombreBase;
        if (!datos.tiposPlatillos[clave]) {
            datos.tiposPlatillos[clave] = { nombre: nombreBase, platillos: [] };
        }
    });
    localStorage.setItem(STORAGE_KEY_PLATILLOS, JSON.stringify(datos));
}

// Obtener todos los tipos de platillos
function obtenerTiposPlatillos() {
    const datos = cargarDatosPlatillos();
    return datos.tiposPlatillos;
}

// Agregar nuevo tipo de platillo identificado por nombre (no por código). Retorna true si creó, false si duplicado.
function agregarTipoPlatillo(nombre) {
    const datos = cargarDatosPlatillos();
    const tipos = datos.tiposPlatillos || {};
    const nombreNorm = (nombre || '').trim().toLowerCase();
    const existe = Object.values(tipos).some(t => (t.nombre || '').trim().toLowerCase() === nombreNorm);
    if (existe) {
        return false;
    }
    const nombreFmt = normalizarNombre ? normalizarNombre(nombre) : (nombre || '').trim();
    tipos[nombreFmt] = {
        nombre: nombreFmt,
        platillos: []
    };
    datos.tiposPlatillos = tipos;
    guardarDatosPlatillos(datos);
    return true;
}

// Obtener nombre del tipo de platillo
function obtenerNombreTipoPlatillo(codigoTipo) {
    const datos = cargarDatosPlatillos();
    const tipo = datos.tiposPlatillos[codigoTipo];
    return tipo ? tipo.nombre : '';
}

// Registrar platillo completo
function registrarPlatillo(platillo) {
    const datos = cargarDatosPlatillos();
    const codigoGenerado = obtenerSiguienteCodigoPlatillo(platillo.tipoCodigo);
    datos.platillosRegistrados.push({
        id: Date.now(),
        codigo: codigoGenerado,
        ...platillo,
        fechaRegistro: new Date().toISOString()
    });
    guardarDatosPlatillos(datos);
}

// Obtener todos los platillos registrados
function obtenerPlatillosRegistrados() {
    const datos = cargarDatosPlatillos();
    return datos.platillosRegistrados;
}

// Obtener platillos registrados por tipo
function obtenerPlatillosPorTipo(codigoTipo) {
    const datos = cargarDatosPlatillos();
    return datos.platillosRegistrados.filter(p => p.tipoCodigo === codigoTipo);
}

// Actualizar precio de un platillo por ID
function actualizarPrecioPlatillo(id, nuevoPrecio) {
    const datos = cargarDatosPlatillos();
    const index = datos.platillosRegistrados.findIndex(p => p.id === id);
    if (index !== -1) {
        datos.platillosRegistrados[index].valorVenta = nuevoPrecio;
        guardarDatosPlatillos(datos);
        return true;
    }
    return false;
}

// Eliminar un platillo por ID
function eliminarPlatillo(id) {
    const datos = cargarDatosPlatillos();
    const index = datos.platillosRegistrados.findIndex(p => p.id === id);
    if (index !== -1) {
        datos.platillosRegistrados.splice(index, 1);
        guardarDatosPlatillos(datos);
        return true;
    }
    return false;
}

// Actualizar cualquier campo de un platillo por ID
function actualizarPlatillo(id, campos) {
    const datos = cargarDatosPlatillos();
    const index = datos.platillosRegistrados.findIndex(p => p.id === id);
    if (index !== -1) {
        Object.assign(datos.platillosRegistrados[index], campos);
        guardarDatosPlatillos(datos);
        return true;
    }
    return false;
}

// Obtener siguiente código de platillo global con formato PLA-<n>
function obtenerSiguienteCodigoPlatillo(/* codigoTipo ignorado */) {
    const actual = parseInt(localStorage.getItem(STORAGE_KEY_CONTADOR_PLATILLOS) || '0');
    const siguiente = actual + 1;
    localStorage.setItem(STORAGE_KEY_CONTADOR_PLATILLOS, siguiente.toString());
    return `PLA-${siguiente}`;
}

// ================== TIPOS DE PLATILLOS PREDEFINIDOS ==================
const datosTiposPlatillosBase = {
    PAR: { codigo: 'PAR', nombre: 'Parrillada', platillos: [] },
    DES: { codigo: 'DES', nombre: 'Desayunos', platillos: [] },
    ALM: { codigo: 'ALM', nombre: 'Almuerzos', platillos: [] },
    CEN: { codigo: 'CEN', nombre: 'Cenas', platillos: [] },
    POS: { codigo: 'POS', nombre: 'Postres', platillos: [] },
    ENT: { codigo: 'ENT', nombre: 'Entradas', platillos: [] },
    SOP: { codigo: 'SOP', nombre: 'Sopas', platillos: [] },
    BEB: { codigo: 'BEB', nombre: 'Bebidas', platillos: [] },
    ESP: { codigo: 'ESP', nombre: 'Especiales', platillos: [] },
    INT: { codigo: 'INT', nombre: 'Internacional', platillos: [] }
};

// ================== PEDIDOS ==================
const STORAGE_KEY_PEDIDOS = 'el_buen_sazon_pedidos';
const STORAGE_KEY_CONTADOR_PEDIDOS = 'el_buen_sazon_contador_pedidos';

// Cargar datos de pedidos del localStorage
function cargarDatosPedidos() {
    const datosGuardados = localStorage.getItem(STORAGE_KEY_PEDIDOS);
    if (datosGuardados) {
        return JSON.parse(datosGuardados);
    }
    return {
        pedidosRegistrados: []
    };
}

// Guardar datos de pedidos en localStorage
function guardarDatosPedidos(datos) {
    localStorage.setItem(STORAGE_KEY_PEDIDOS, JSON.stringify(datos));
}

// Registrar pedido completo
function registrarPedido(pedido) {
    const datos = cargarDatosPedidos();
    const numeroPedido = obtenerSiguienteNumeroPedido();
    datos.pedidosRegistrados.push({
        id: Date.now(),
        numeroPedido: numeroPedido,
        ...pedido,
        fechaRegistro: new Date().toISOString()
    });
    guardarDatosPedidos(datos);
    return numeroPedido;
}

// Obtener siguiente número de pedido con formato PED-XXX
function obtenerSiguienteNumeroPedido() {
    const actual = parseInt(localStorage.getItem(STORAGE_KEY_CONTADOR_PEDIDOS) || '0');
    const siguiente = actual + 1;
    localStorage.setItem(STORAGE_KEY_CONTADOR_PEDIDOS, siguiente.toString());
    return `PED-${String(siguiente).padStart(3, '0')}`;
}

// Obtener todos los pedidos registrados
function obtenerPedidosRegistrados() {
    const datos = cargarDatosPedidos();
    return datos.pedidosRegistrados;
}

// Actualizar estado de un pedido por ID
function actualizarEstadoPedido(id, nuevoEstado) {
    const datos = cargarDatosPedidos();
    const index = datos.pedidosRegistrados.findIndex(p => p.id === id);
    if (index !== -1) {
        datos.pedidosRegistrados[index].estado = nuevoEstado;
        guardarDatosPedidos(datos);
        return true;
    }
    return false;
}

// Actualizar precio de un pedido por ID
function actualizarPrecioPedido(id, nuevoPrecio) {
    const datos = cargarDatosPedidos();
    const index = datos.pedidosRegistrados.findIndex(p => p.id === id);
    if (index !== -1) {
        datos.pedidosRegistrados[index].precioTotal = nuevoPrecio;
        guardarDatosPedidos(datos);
        return true;
    }
    return false;
}

// Eliminar un pedido por ID
function eliminarPedido(id) {
    const datos = cargarDatosPedidos();
    const index = datos.pedidosRegistrados.findIndex(p => p.id === id);
    if (index !== -1) {
        datos.pedidosRegistrados.splice(index, 1);
        guardarDatosPedidos(datos);
        return true;
    }
    return false;
}

// Restar cantidades de ingredientes del inventario cuando se confirma un pedido
function restarIngredientesDelInventario(pedido) {
    const datosInventario = cargarDatosInventario();
    const platillos = obtenerPlatillosRegistrados();
    const insumosRegistrados = datosInventario.insumosRegistrados;
    
    // Obtener totales globales actuales
    const totalesGlobales = {};
    insumosRegistrados.forEach(insumo => {
        const clave = `${insumo.tipoCodigo || ''}::${insumo.insumoCodigo || ''}`;
        if (!totalesGlobales[clave]) {
            totalesGlobales[clave] = 0;
        }
        totalesGlobales[clave] += parseFloat(insumo.cantidad) || 0;
    });
    
    // Calcular cantidades a restar
    const cantidadesARestar = {};
    
    for (const platilloPedido of pedido.platillos) {
        const platillo = platillos.find(p => p.id === platilloPedido.id);
        if (platillo && platillo.ingredientes) {
            for (const ingrediente of platillo.ingredientes) {
                const clave = `${ingrediente.id}`;
                if (!cantidadesARestar[clave]) {
                    cantidadesARestar[clave] = 0;
                }
                cantidadesARestar[clave] += ingrediente.cantidad * platilloPedido.cantidad;
            }
        }
    }
    
    // Restar cantidades de los insumos registrados
    let cambiosRealizados = false;
    for (const [insumoId, cantidadARestar] of Object.entries(cantidadesARestar)) {
        const idInsumo = parseInt(insumoId);
        let cantidadRestante = cantidadARestar;
        
        // Buscar insumos registrados y restar cantidades
        for (let i = 0; i < insumosRegistrados.length && cantidadRestante > 0; i++) {
            const insumo = insumosRegistrados[i];
            if (insumo.id === idInsumo) {
                const cantidadActual = parseFloat(insumo.cantidad) || 0;
                if (cantidadActual > 0) {
                    const cantidadARestarDeEste = Math.min(cantidadActual, cantidadRestante);
                    insumo.cantidad = cantidadActual - cantidadARestarDeEste;
                    cantidadRestante -= cantidadARestarDeEste;
                    cambiosRealizados = true;
                }
            }
        }
    }
    
    if (cambiosRealizados) {
        datosInventario.insumosRegistrados = insumosRegistrados;
        guardarDatosInventario(datosInventario);
        return true;
    }
    
    return false;
}
