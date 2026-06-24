document.addEventListener('DOMContentLoaded', () => {
    const pantallas = document.querySelectorAll(".pantalla");

    function mostrarPantalla(idPantalla) {
        pantallas.forEach(pantalla => {
            pantalla.classList.add("oculto");
        });

        document.getElementById(idPantalla)
            .classList.remove("oculto");
    }


    // Configurar navegación con objeto botonesPantalla
    const botonesPantalla = {
        btnRegistrarPedido: "contenido__registroPedido",
        btnMostrarPedidos: "contenido__mostrarPedidos",
        btnActualizarPedido: "contenido__actualizarPedido",
        btnEliminarPedido: "contenido__eliminarPedido"
    };

    for (const [botonId, pantallaId] of Object.entries(botonesPantalla)) {
        const boton = document.getElementById(botonId);
        if (boton) {
            boton.addEventListener("click", () => {
                mostrarPantalla(pantallaId);
            });
        }
    }

    const btnRegresarMenu = document.getElementById("btnRegresa-menuPrincipal");

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

    // Función reutilizable para mostrar confirmación
    function mostrarConfirmacion(boton) {
        const pantalla = boton.closest(".pantalla");
        const confirmacion = pantalla.querySelector(".confirmacionDatos");
        if (confirmacion) {
            confirmacion.classList.remove("oculto");
        }
    }

    // Event listener para botón de Siguiente
    const btnSiguienteRegistro = document.getElementById("btnSiguienteRegistro");

    if (btnSiguienteRegistro) {
        btnSiguienteRegistro.addEventListener("click", () => {
            mostrarConfirmacion(btnSiguienteRegistro);
        });
    }
});
