// Archivo para gestionar los datos de insumos y sus unidades de medida
// Este archivo solo contiene el catálogo base (semilla) para inicializar localStorage

// Datos de insumos con sus unidades de medida predeterminadas
const datosInsumos = {
    CB: {
        nombre: 'Carnes Blancas',
        unidadMedida: 'libras',
        insumos: [
            { nombre: 'Pollo' },
            { nombre: 'Pescado' },
            { nombre: 'Cerdo' }
        ]
    },
    CR: {
        nombre: 'Carnes Rojas',
        unidadMedida: 'libras',
        insumos: [
            { nombre: 'Carne de res' },
            { nombre: 'Ternera' },
            { nombre: 'Cordero' }
        ]
    },
    F: {
        nombre: 'Frutas',
        unidadMedida: 'libras',
        insumos: [
            { nombre: 'Manzana' },
            { nombre: 'Banano' },
            { nombre: 'Naranja' }
        ]
    },
    V: {
        nombre: 'Verduras',
        unidadMedida: 'libras',
        insumos: [
            { nombre: 'Tomate' },
            { nombre: 'Lechuga' },
            { nombre: 'Zanahoria' }
        ]
    },
    'P&M': {
        nombre: 'Pescado y Mariscos',
        unidadMedida: 'libras',
        insumos: [
            { nombre: 'Camaron' },
            { nombre: 'Langosta' },
            { nombre: 'Pulpo' }
        ]
    },
    L: {
        nombre: 'Lacteos',
        unidadMedida: 'litros',
        insumos: [
            { nombre: 'Leche' },
            { nombre: 'Queso' },
            { nombre: 'Yogurt' }
        ]
    },
    'G&C': {
        nombre: 'Granos y Cereales',
        unidadMedida: 'libras',
        insumos: [
            { nombre: 'Arroz' },
            { nombre: 'Frijoles' },
            { nombre: 'Maiz' }
        ]
    },
    'A&G': {
        nombre: 'Aceites y Grasas',
        unidadMedida: 'litros',
        insumos: [
            { nombre: 'Aceite de oliva' },
            { nombre: 'Mantequilla' },
            { nombre: 'Aceite vegetal' }
        ]
    },
    E: {
        nombre: 'Embutidos',
        unidadMedida: 'libras',
        insumos: [
            { nombre: 'Salchicha' },
            { nombre: 'Jamón' },
            { nombre: 'Chorizo' }
        ]
    }
};

// Obtener todos los datos de insumos (catálogo base)
function obtenerDatosInsumos() {
    return datosInsumos;
}
