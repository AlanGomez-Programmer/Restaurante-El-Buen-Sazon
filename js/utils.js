// Utils.js - Funciones compartidas para Restaurante El Buen Sazón

/**
 * Aplica tema oscuro a la página
 */
function aplicarTemaOscuro() {
    document.body.classList.add('tema-oscuro');
    localStorage.setItem('el_buen_sazon_theme', 'dark');
}

/**
 * Aplica tema claro a la página
 */
function aplicarTemaClaro() {
    document.body.classList.remove('tema-oscuro');
    localStorage.setItem('el_buen_sazon_theme', 'light');
}

/**
 * Carga el tema guardado en localStorage
 */
function cargarTemaGuardado() {
    const tema = localStorage.getItem('el_buen_sazon_theme');
    if (tema === 'dark') {
        aplicarTemaOscuro();
    } else {
        aplicarTemaClaro();
    }
}

/**
 * Obtiene el objeto de usuario almacenado en localStorage
 * @returns {Object|null} { usuario, contrasenia } o null si no existe
 */
function obtenerUsuarioAlmacenado() {
    try {
        const raw = localStorage.getItem('el_buen_sazon_usuario');
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
}

/**
 * Carga y muestra el nombre de usuario (valor 'usuario' del localStorage)
 * en el elemento h2#nombreUsuario de la interfaz.
 */
function cargarNombreUsuario() {
    const el = document.getElementById('nombreUsuario');
    if (!el) return;
    const datos = obtenerUsuarioAlmacenado();
    if (datos && datos.usuario) {
        el.textContent = datos.usuario;
    } else {
        el.textContent = 'Usuario';
    }
}

