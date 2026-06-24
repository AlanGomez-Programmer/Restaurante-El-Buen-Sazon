document.addEventListener('DOMContentLoaded', () => {
    const pantallas = document.querySelectorAll(".pantalla");

    function mostrarPantalla(idPantalla) {
        pantallas.forEach(pantalla => {
            pantalla.classList.add("oculto");
        });

        document.getElementById(idPantalla)
            .classList.remove("oculto");
    }

    // Mostrar nombre del usuario
    const nombreUsuario = document.getElementById("nombreUsuario");
    nombreUsuario.textContent = 'Usuario';

    const btnRegistrar = document.getElementById("btnRegistrarPlatillo");
    const btnMostrar = document.getElementById("btnMostrarPlatillos");
    const btnActualizar = document.getElementById("btnActualizarPlatillo");
    const btnEliminar = document.getElementById("btnEliminarPlatillo");
    const btnCrearTipo = document.getElementById("btnCrearTipo");
    const btnRegresarMenu = document.getElementById("btnRegresa-menuPrincipal");

    btnRegistrar.addEventListener("click", () => {
        mostrarPantalla("contenido__registroPlatillo");
    });

    btnMostrar.addEventListener("click", () => {
        mostrarPantalla("contenido__mostrarPlatillos");
    });

    btnActualizar.addEventListener("click", () => {
        mostrarPantalla("contenido__actualizarPlatillo");
    });

    btnEliminar.addEventListener("click", () => {
        mostrarPantalla("contenido__eliminarPlatillo");
    });

    btnCrearTipo.addEventListener("click", () => {
        mostrarPantalla("contenido__crearTipo");
    });

    btnRegresarMenu.addEventListener("click", () => {
        window.location.href = "./menu.html";
    });

    const botonesRegresar = document.querySelectorAll(".btnRegresar");
    const btnSalir = document.getElementById("btnSalir");

    botonesRegresar.forEach(boton => {
        boton.addEventListener("click", () => {
            mostrarPantalla("contenido__menu");
        });
    });

    btnSalir.addEventListener('click', ()=> {
        localStorage.removeItem('el_buen_sazon_theme');
        window.location.href = "./login.html";
    });
});