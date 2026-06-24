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
        btnRegistrarInsumo: "contenido__registroInsumo",
        btnMostrarInsumo: "contenido__mostrarInsumos",
        btnActualizarInsumo: "contenido__actualizarInsumo",
        btnEliminarInsumo: "contenido__eliminarInsumo",
        btnCrearTipo: "contenido__crearTipo"
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

    // Event listeners para botones de Siguiente
    const btnSiguienteRegistro = document.getElementById("btnSiguienteRegistro");
    const btnSiguienteCrearInsumo = document.getElementById("btnSiguienteCrearInsumo");
    const btnSiguienteTipo = document.getElementById("btnSiguienteTipo");

    if (btnSiguienteRegistro) {
        btnSiguienteRegistro.addEventListener("click", () => {
            mostrarConfirmacion(btnSiguienteRegistro);
        });
    }

    if (btnSiguienteCrearInsumo) {
        btnSiguienteCrearInsumo.addEventListener("click", () => {
            mostrarConfirmacion(btnSiguienteCrearInsumo);
        });
    }

    if (btnSiguienteTipo) {
        btnSiguienteTipo.addEventListener("click", () => {
            mostrarConfirmacion(btnSiguienteTipo);
        });
    }
});
