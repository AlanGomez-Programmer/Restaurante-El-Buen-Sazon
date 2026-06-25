const STORAGE_KEY_USUARIO = 'el_buen_sazon_usuario';

// Inicializa un usuario por defecto en localStorage si no existe
function inicializarUsuarioPorDefecto() {
    const usuarioGuardado = localStorage.getItem(STORAGE_KEY_USUARIO);
    if (!usuarioGuardado) {
        const usuarioDefault = {
            usuario: 'alan@gmail.com',
            contrasenia: '123456'
        };
        localStorage.setItem(STORAGE_KEY_USUARIO, JSON.stringify(usuarioDefault));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Asegurar que exista un usuario por defecto
    inicializarUsuarioPorDefecto();

    // Referencias a elementos del DOM
    const btnClaro = document.getElementById('btnClaro');
    const btnOscuro = document.getElementById('btnOscuro');
    const formularioLogin = document.getElementById('formularioLogin');
    const usuarioLogin = document.getElementById('usuario__login');
    const contraseniaLogin = document.getElementById('contrasenia__login');
    const errorUsuario = document.getElementById('errorUsuario');
    const errorContrasenia = document.getElementById('errorContrasenia');

    // Cargar tema guardado
    cargarTemaGuardado();

    // Event listeners para cambio de tema
    btnClaro.addEventListener('click', () => aplicarTemaClaro());
    btnOscuro.addEventListener('click', () => aplicarTemaOscuro());

    // Event listener para el formulario de login
    formularioLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Limpiar errores anteriores
        errorUsuario.textContent = '';
        errorContrasenia.textContent = '';
        
        let hayError = false;
        
        // Validar correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(usuarioLogin.value)) {
            errorUsuario.textContent = 'Por favor ingrese un correo válido';
            hayError = true;
        }
        
        // Validar que la contraseña no esté vacía
        if (contraseniaLogin.value.trim() === '') {
            errorContrasenia.textContent = 'Por favor ingrese su contraseña';
            hayError = true;
        }
        
        // Validar credenciales con el usuario guardado en localStorage
        if (!hayError) {
            const datosUsuarioStr = localStorage.getItem(STORAGE_KEY_USUARIO);
            if (datosUsuarioStr) {
                const usuarioAlmacenado = JSON.parse(datosUsuarioStr);
                if (usuarioLogin.value !== usuarioAlmacenado.usuario || contraseniaLogin.value !== usuarioAlmacenado.contrasenia) {
                    errorContrasenia.textContent = 'No se acepta ya que no coinciden';
                    hayError = true;
                }
            } else {
                errorContrasenia.textContent = 'No hay usuario registrado en el sistema';
                hayError = true;
            }
        }
        
        // Si no hay errores, redirigir al menú
        if (!hayError) {
            window.location.href = 'menu.html';
        }
    });

});

