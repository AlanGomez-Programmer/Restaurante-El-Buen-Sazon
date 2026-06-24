document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const btnClaro = document.getElementById('btnClaro');
    const btnOscuro = document.getElementById('btnOscuro');

    // Cargar tema guardado
    cargarTema();

    // Event listeners para cambio de tema
    btnClaro.addEventListener('click', () => mostrarTema('claro'));
    btnOscuro.addEventListener('click', () => mostrarTema('oscuro'));
});


function mostrarTema(tema) {
    localStorage.setItem('el_buen_sazon_tema', tema);
    aplicarTema(tema);
}

function cargarTema() {
    const tema = localStorage.getItem('el_buen_sazon_theme') || 'claro';
    aplicarTema(tema);
}


function aplicarTema(tema) {
    const root = document.documentElement;
    const contenedor = document.querySelector('.contenedor');
    
    if (tema === 'oscuro') {
        root.style.setProperty('--background-principal', '#1a1a1a');
        root.style.setProperty('--background-secundario', '#ffffff');
        root.style.setProperty('--text-color', '#ffffff');
        root.style.setProperty('--input-background', '#2d2d2d');
        root.style.setProperty('--input-border', '#444');
        contenedor.style.backgroundImage = "url('../img/fondos/fondo_oscuro.png')";
    } else {
        root.style.setProperty('--background-principal', '#ffffff');
        root.style.setProperty('--background-secundario', '#000000');
        root.style.setProperty('--text-color', '#000000');
        root.style.setProperty('--input-background', '#f5f5f5');
        root.style.setProperty('--input-border', '#ddd');
        contenedor.style.backgroundImage = "url('../img/fondos/fondo_claro.png')";
    }
}

let btnIniciarSesion = document.getElementById('btnIniciarSesion');

btnIniciarSesion.addEventListener('click', () => {
    window.location.href = 'menu.html';
});
