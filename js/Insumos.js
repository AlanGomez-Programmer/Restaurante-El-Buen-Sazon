// Archivo para gestionar los datos de insumos y sus unidades de medida
// Este archivo solo contiene el catálogo base (semilla) para inicializar localStorage

// Datos de insumos con sus unidades de medida predeterminadas
const datosInsumos = {
    CB: {
        codigo: 'CB',
        nombre: 'CB - Carnes Blancas',
        unidadMedida: 'libras',
        insumos: [
            { codigo: 'CB-1', nombre: 'Pollo' },
            { codigo: 'CB-2', nombre: 'Pescado' },
            { codigo: 'CB-3', nombre: 'Cerdo' }
        ]
    },
    CR: {
        codigo: 'CR',
        nombre: 'CR - Carnes Rojas',
        unidadMedida: 'libras',
        insumos: [
            { codigo: 'CR-1', nombre: 'Carne de res' },
            { codigo: 'CR-2', nombre: 'Ternera' },
            { codigo: 'CR-3', nombre: 'Cordero' }
        ]
    },
    F: {
        codigo: 'F',
        nombre: 'F - Frutas',
        unidadMedida: 'libras',
        insumos: [
            { codigo: 'F-1', nombre: 'Manzana' },
            { codigo: 'F-2', nombre: 'Banano' },
            { codigo: 'F-3', nombre: 'Naranja' }
        ]
    },
    V: {
        codigo: 'V',
        nombre: 'V - Verduras',
        unidadMedida: 'libras',
        insumos: [
            { codigo: 'V-1', nombre: 'Tomate' },
            { codigo: 'V-2', nombre: 'Lechuga' },
            { codigo: 'V-3', nombre: 'Zanahoria' }
        ]
    },
    'P&M': {
        codigo: 'P&M',
        nombre: 'P&M - Pescado y Mariscos',
        unidadMedida: 'libras',
        insumos: [
            { codigo: 'PM-1', nombre: 'Camaron' },
            { codigo: 'PM-2', nombre: 'Langosta' },
            { codigo: 'PM-3', nombre: 'Pulpo' }
        ]
    },
    L: {
        codigo: 'L',
        nombre: 'L - Lacteos',
        unidadMedida: 'litros',
        insumos: [
            { codigo: 'L-1', nombre: 'Leche' },
            { codigo: 'L-2', nombre: 'Queso' },
            { codigo: 'L-3', nombre: 'Yogurt' }
        ]
    },
    'G&C': {
        codigo: 'G&C',
        nombre: 'G&C - Granos y Cereales',
        unidadMedida: 'libras',
        insumos: [
            { codigo: 'GC-1', nombre: 'Arroz' },
            { codigo: 'GC-2', nombre: 'Frijoles' },
            { codigo: 'GC-3', nombre: 'Maiz' }
        ]
    },
    'A&G': {
        codigo: 'A&G',
        nombre: 'A&G - Aceites y Grasas',
        unidadMedida: 'litros',
        insumos: [
            { codigo: 'AG-1', nombre: 'Aceite de oliva' },
            { codigo: 'AG-2', nombre: 'Mantequilla' },
            { codigo: 'AG-3', nombre: 'Aceite vegetal' }
        ]
    },
    E: {
        codigo: 'E',
        nombre: 'E - Embutidos',
        unidadMedida: 'libras',
        insumos: [
            { codigo: 'E-1', nombre: 'Salchicha' },
            { codigo: 'E-2', nombre: 'Jamón' },
            { codigo: 'E-3', nombre: 'Chorizo' }
        ]
    }
};

// Obtener todos los datos de insumos (catálogo base)
function obtenerDatosInsumos() {
    return datosInsumos;
}
