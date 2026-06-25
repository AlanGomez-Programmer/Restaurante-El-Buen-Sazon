// Archivo de persistencia para la base de datos
// Este archivo es la única capa de acceso a localStorage para inventario, platillos y pedidos

// ================== INVENTARIO ==================
const STORAGE_KEY_INVENTARIO = 'el_buen_sazon_inventario';

// Cargar datos del inventario del localStorage
function cargarDatosInventario() {
    const datosGuardados = localStorage.getItem(STORAGE_KEY_INVENTARIO);
    if (datosGuardados) {
        return JSON.parse(datosGuardados);
    }
    // Si no hay datos, sembrar desde el catálogo base de Insumos.js
    const datosInsumos = obtenerDatosInsumos();
    return {
        tiposInsumos: JSON.parse(JSON.stringify(datosInsumos)),
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

// Agregar nuevo tipo de insumo
function agregarTipoInsumo(codigo, nombre, unidadMedida) {
    const datos = cargarDatosInventario();
    datos.tiposInsumos[codigo] = {
        codigo: codigo,
        nombre: nombre,
        unidadMedida: unidadMedida,
        insumos: []
    };
    guardarDatosInventario(datos);
}

// Agregar nuevo insumo a un tipo existente
function agregarInsumo(codigoTipo, codigoInsumo, nombreInsumo) {
    const datos = cargarDatosInventario();
    if (datos.tiposInsumos[codigoTipo]) {
        datos.tiposInsumos[codigoTipo].insumos.push({
            codigo: codigoInsumo,
            nombre: nombreInsumo
        });
        guardarDatosInventario(datos);
    }
}

// Registrar insumo completo (cantidad, unidad, fecha, descripción)
// Si ya existe un registro con el mismo tipoCodigo e insumoCodigo, suma la cantidad al existente
function registrarInsumo(insumo) {
    const datos = cargarDatosInventario();
    
    // Buscar si ya existe un registro con el mismo tipo e insumo
    const existente = datos.insumosRegistrados.find(i => 
        i.tipoCodigo === insumo.tipoCodigo && i.insumoCodigo === insumo.insumoCodigo
    );
    
    if (existente) {
        // Sumar la cantidad al registro existente
        const cantidadActual = parseFloat(existente.cantidad) || 0;
        const cantidadNueva = parseFloat(insumo.cantidad) || 0;
        existente.cantidad = cantidadActual + cantidadNueva;
        // Actualizar otros campos opcionales si se proporcionan
        if (insumo.fechaIngreso) existente.fechaIngreso = insumo.fechaIngreso;
        if (insumo.descripcion !== undefined) existente.descripcion = insumo.descripcion;
        existente.fechaRegistro = new Date().toISOString();
    } else {
        // Registrar como nuevo
        datos.insumosRegistrados.push({
            id: Date.now(),
            ...insumo,
            fechaRegistro: new Date().toISOString()
        });
    }
    
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
    
    // Asegurar que existan los tipos base (fusionar)
    if (!datos.tiposPlatillos) {
        datos.tiposPlatillos = {};
    }
    
    Object.keys(datosTiposPlatillosBase).forEach(codigo => {
        if (!datos.tiposPlatillos[codigo]) {
            datos.tiposPlatillos[codigo] = JSON.parse(JSON.stringify(datosTiposPlatillosBase[codigo]));
        }
    });
    
    return datos;
}

// Guardar datos de platillos en localStorage
// Antes de guardar, fusiona los tipos base para que nunca se pierdan
function guardarDatosPlatillos(datos) {
    if (!datos.tiposPlatillos) {
        datos.tiposPlatillos = {};
    }
    Object.keys(datosTiposPlatillosBase).forEach(codigo => {
        if (!datos.tiposPlatillos[codigo]) {
            datos.tiposPlatillos[codigo] = JSON.parse(JSON.stringify(datosTiposPlatillosBase[codigo]));
        }
    });
    localStorage.setItem(STORAGE_KEY_PLATILLOS, JSON.stringify(datos));
}

// Obtener todos los tipos de platillos
function obtenerTiposPlatillos() {
    const datos = cargarDatosPlatillos();
    return datos.tiposPlatillos;
}

// Agregar nuevo tipo de platillo
function agregarTipoPlatillo(codigo, nombre) {
    const datos = cargarDatosPlatillos();
    datos.tiposPlatillos[codigo] = {
        codigo: codigo,
        nombre: nombre,
        platillos: []
    };
    guardarDatosPlatillos(datos);
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
    datos.platillosRegistrados.push({
        id: Date.now(),
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

// ================== TIPOS DE PLATILLOS PREDEFINIDOS ==================
const datosTiposPlatillosBase = {
    PAR: { codigo: 'PAR', nombre: 'PAR - Parrillada', platillos: [] },
    DES: { codigo: 'DES', nombre: 'DES - Desayunos', platillos: [] },
    ALM: { codigo: 'ALM', nombre: 'ALM - Almuerzos', platillos: [] },
    CEN: { codigo: 'CEN', nombre: 'CEN - Cenas', platillos: [] },
    POS: { codigo: 'POS', nombre: 'POS - Postres', platillos: [] },
    ENT: { codigo: 'ENT', nombre: 'ENT - Entradas', platillos: [] },
    SOP: { codigo: 'SOP', nombre: 'SOP - Sopas', platillos: [] },
    BEB: { codigo: 'BEB', nombre: 'BEB - Bebidas', platillos: [] },
    ESP: { codigo: 'ESP', nombre: 'ESP - Especiales', platillos: [] },
    INT: { codigo: 'INT', nombre: 'INT - Internacional', platillos: [] }
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
