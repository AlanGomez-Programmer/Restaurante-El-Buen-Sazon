document.addEventListener('DOMContentLoaded', () => {
    // Cargar tema guardado
    cargarTemaGuardado();

    const pantallas = document.querySelectorAll(".pantalla");

    function mostrarPantalla(idPantalla) {
        pantallas.forEach(pantalla => pantalla.classList.add("oculto"));
        const destino = document.getElementById(idPantalla);
        if (destino) destino.classList.remove("oculto");
    }

    // Cargar nombre de usuario desde localStorage
    cargarNombreUsuario();

    // Navegación entre pantallas
    const botonesPantalla = {
        btnRegistrarCliente: "contenido__registroCliente",
        btnMostrarClientes: "contenido__mostrarClientes",
        btnActualizarCliente: "contenido__actualizarCliente",
        btnEliminarCliente: "contenido__eliminarCliente"
    };

    for (const [botonId, pantallaId] of Object.entries(botonesPantalla)) {
        const boton = document.getElementById(botonId);
        if (boton) {
            boton.addEventListener("click", () => {
                mostrarPantalla(pantallaId);
                if (pantallaId === "contenido__mostrarClientes") cargarTarjetasClientes();
                if (pantallaId === "contenido__actualizarCliente") cargarTarjetasActualizarCliente();
                if (pantallaId === "contenido__eliminarCliente") cargarTarjetasEliminarCliente();
            });
        }
    }

    // Regresar al menú principal
    const btnRegresarMenu = document.getElementById("btnRegresa-menuPrincipal");
    if (btnRegresarMenu) {
        btnRegresarMenu.addEventListener("click", () => {
            window.location.href = "./menu.html";
        });
    }

    // Regresar al menú del módulo
    document.querySelectorAll(".btnRegresar").forEach(boton => {
        boton.addEventListener("click", () => mostrarPantalla("contenido__menu"));
    });

    // Salir al login
    const btnSalir = document.getElementById("btnSalir");
    if (btnSalir) {
        btnSalir.addEventListener('click', () => {
            localStorage.removeItem('el_buen_sazon_theme');
            window.location.href = "./index.html";
        });
    }

    // Mostrar mensajes en pantalla
    function mostrarMensaje(idContenedor, texto, tipo = 'exito') {
        const contenedor = document.getElementById(idContenedor);
        if (contenedor) {
            contenedor.textContent = texto;
            contenedor.className = tipo === 'error' ? 'mensaje error' : 'mensaje exito';
            setTimeout(() => {
                contenedor.textContent = '';
                contenedor.className = 'mensaje';
            }, 3000);
        }
    }

    // Validacion reutilizable
    function esEmailValido(email) {
        if (!email) return true; // email vacío permitido salvo que se exija; aquí lo validamos si existe
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function soloDigitos(valor) {
        return /^\d+$/.test(valor);
    }

    // ================== REGISTRAR CLIENTE ==================
    let datosClienteTemporal = null;
    const btnSiguienteRegistroCliente = document.getElementById('btnSiguienteRegistroCliente');
    const btnGuardarCliente = document.getElementById('btnGuardarCliente');

    if (btnSiguienteRegistroCliente) {
        btnSiguienteRegistroCliente.addEventListener('click', () => {
            const identificacion = document.getElementById('identificacionCliente').value.trim();
            const nombre = document.getElementById('nombreClienteReg').value.trim();
            const telefono = document.getElementById('telefonoCliente').value.trim();
            const email = document.getElementById('emailCliente').value.trim();
            const genero = document.getElementById('generoCliente').value;

            if (!identificacion || !nombre || !telefono || !email) {
                mostrarMensaje('mensajeRegistroCliente', 'Complete todos los campos obligatorios (el género es opcional)', 'error');
                return;
            }
            if (!soloDigitos(identificacion)) {
                mostrarMensaje('mensajeRegistroCliente', 'La identificación solo debe contener números', 'error');
                return;
            }
            if (/\d/.test(nombre)) {
                mostrarMensaje('mensajeRegistroCliente', 'El nombre no debe contener números', 'error');
                return;
            }
            if (!soloDigitos(telefono)) {
                mostrarMensaje('mensajeRegistroCliente', 'El teléfono solo debe contener números', 'error');
                return;
            }
            if (!esEmailValido(email)) {
                mostrarMensaje('mensajeRegistroCliente', 'Ingrese un email válido', 'error');
                return;
            }
            if (existeClienteIdentificacion(identificacion)) {
                mostrarMensaje('mensajeRegistroCliente', 'Ya existe un cliente con esa identificación', 'error');
                return;
            }

            datosClienteTemporal = { identificacion, nombre, telefono, email, genero };

            document.getElementById('confIdentificacion').textContent = `Identificación: ${identificacion}`;
            document.getElementById('confNombre').textContent = `Nombre: ${nombre}`;
            document.getElementById('confTelefono').textContent = `Teléfono: ${telefono}`;
            document.getElementById('confEmail').textContent = `Email: ${email}`;
            document.getElementById('confGenero').textContent = `Género: ${genero || 'No especificado'}`;

            const confirmacion = document.querySelector('#contenido__registroCliente .confirmacionDatos');
            if (confirmacion) confirmacion.classList.remove('oculto');
        });
    }

    if (btnGuardarCliente) {
        btnGuardarCliente.addEventListener('click', () => {
            if (!datosClienteTemporal) {
                mostrarMensaje('mensajeRegistroCliente', 'No hay datos de cliente para guardar', 'error');
                return;
            }
            const resultado = registrarCliente(datosClienteTemporal);
            if (!resultado.ok) {
                mostrarMensaje('mensajeRegistroCliente', resultado.error, 'error');
                return;
            }
            mostrarMensaje('mensajeRegistroCliente', 'Cliente registrado exitosamente', 'exito');

            // Limpiar formulario
            document.getElementById('identificacionCliente').value = '';
            document.getElementById('nombreClienteReg').value = '';
            document.getElementById('telefonoCliente').value = '';
            document.getElementById('emailCliente').value = '';
            document.getElementById('generoCliente').value = '';

            // Limpiar confirmación
            ['confIdentificacion', 'confNombre', 'confTelefono', 'confEmail', 'confGenero'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = '';
            });
            const confirmacion = document.querySelector('#contenido__registroCliente .confirmacionDatos');
            if (confirmacion) confirmacion.classList.add('oculto');

            datosClienteTemporal = null;
            mostrarPantalla("contenido__menu");
        });
    }

    // ================== MOSTRAR CLIENTES ==================
    
    function cargarTarjetasClientes() {
        const clientes = obtenerClientes();
        const contenedor = document.getElementById('tarjetasClientes');
        if (!contenedor) return;

        contenedor.textContent = '';
        if (clientes.length === 0) {
            let parrafo = document.createElement("p")
            parrafo.style.textAlign = 'center';
            parrafo.style.color = 'red'
            parrafo.textContent = "No hay clientes registrados"
            contenedor.appendChild(parrafo);
            return;
        }

        clientes.forEach(cliente => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta__cliente';

            let tituloNombreCliente = document.createElement('h3');
            tituloNombreCliente.textContent = cliente.nombre;

            let parrafoIdentificacion = document.createElement('p');
            let spanIdentificacion = document.createElement('span');
            spanIdentificacion.className = 'info__destacada';
            spanIdentificacion.textContent = 'Identificación:';
            parrafoIdentificacion.appendChild(spanIdentificacion);
            parrafoIdentificacion.appendChild(document.createTextNode(' ' + cliente.identificacion));

            let parrafoTelefono = document.createElement('p');
            let spanTelefono = document.createElement('span');
            spanTelefono.className = 'info__destacada';
            spanTelefono.textContent = 'Teléfono:';
            parrafoTelefono.appendChild(spanTelefono);
            parrafoTelefono.appendChild(document.createTextNode(' ' + cliente.telefono));

            let parrafoEmail = document.createElement('p');
            let spanEmail = document.createElement('span');
            spanEmail.className = 'info__destacada';
            spanEmail.textContent = 'Email:';
            parrafoEmail.appendChild(spanEmail);
            parrafoEmail.appendChild(document.createTextNode(' ' + (cliente.email || 'Sin email')));

            let parrafoGenero = document.createElement('p');
            let spanGenero = document.createElement('span');
            spanGenero.className = 'info__destacada';
            spanGenero.textContent = 'Género:';
            parrafoGenero.appendChild(spanGenero);
            parrafoGenero.appendChild(document.createTextNode(' ' + (cliente.genero || 'No especificado')));

            tarjeta.appendChild(tituloNombreCliente);
            tarjeta.appendChild(parrafoIdentificacion);
            tarjeta.appendChild(parrafoTelefono);
            tarjeta.appendChild(parrafoEmail);
            tarjeta.appendChild(parrafoGenero);

            contenedor.appendChild(tarjeta);
        });
    }

    // ================== ACTUALIZAR CLIENTES ==================
    function cargarTarjetasActualizarCliente() {
        const clientes = obtenerClientes();
        const contenedor = document.getElementById('tarjetasActualizarCliente');
        const mensaje = document.getElementById('mensajeActualizarCliente');
        if (!contenedor) return;

        contenedor.textContent = '';
        if (mensaje) mensaje.textContent = '';

        if (clientes.length === 0) {
            let parrafoAdverencia = document.createElement('p');
            parrafoAdverencia.style.textAlign = 'center';
            parrafoAdverencia.style.color = 'red'
            parrafoAdverencia.textContent = "No hay clientes registrados"
            contenedor.appendChild(parrafoAdverencia)
            return;
        }

        clientes.forEach(cliente => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta__cliente';

            let tituloNombreCliente = document.createElement('h3');
            tituloNombreCliente.textContent = cliente.nombre;

            let parrafoIdentificacion = document.createElement('p');
            let spanIdentificacion = document.createElement('span');
            spanIdentificacion.className = 'info__destacada';
            spanIdentificacion.textContent = 'Identificación:';
            parrafoIdentificacion.appendChild(spanIdentificacion);
            parrafoIdentificacion.appendChild(document.createTextNode(' ' + cliente.identificacion));

            let parrafoTelefono = document.createElement('p');
            let spanTelefono = document.createElement('span');
            spanTelefono.className = 'info__destacada';
            spanTelefono.textContent = 'Teléfono:';
            parrafoTelefono.appendChild(spanTelefono);
            parrafoTelefono.appendChild(document.createTextNode(' ' + cliente.telefono));

            let parrafoEmail = document.createElement('p');
            let spanEmail = document.createElement('span');
            spanEmail.className = 'info__destacada';
            spanEmail.textContent = 'Email:';
            parrafoEmail.appendChild(spanEmail);
            parrafoEmail.appendChild(document.createTextNode(' ' + (cliente.email || 'Sin email')));

            let parrafoGenero = document.createElement('p');
            let spanGenero = document.createElement('span');
            spanGenero.className = 'info__destacada';
            spanGenero.textContent = 'Género:';
            parrafoGenero.appendChild(spanGenero);
            parrafoGenero.appendChild(document.createTextNode(' ' + (cliente.genero || 'No especificado')));

            let btnActualizar = document.createElement('button');
            btnActualizar.type = 'button';
            btnActualizar.className = 'btnActualizarTarjeta';
            btnActualizar.setAttribute('data-id', cliente.id);
            btnActualizar.textContent = 'Actualizar';

            let formulario = document.createElement('div');
            formulario.className = 'formulario__actualizarTarjeta';
            formulario.id = `formularioClienteActualizar-${cliente.id}`;

            let labelIdentificacion = document.createElement('label');
            labelIdentificacion.textContent = 'Identificación:';
            let inputIdentificacion = document.createElement('input');
            inputIdentificacion.type = 'text';
            inputIdentificacion.className = 'editIdentificacion';
            inputIdentificacion.value = cliente.identificacion;

            let labelNombre = document.createElement('label');
            labelNombre.textContent = 'Nombre:';
            let inputNombre = document.createElement('input');
            inputNombre.type = 'text';
            inputNombre.className = 'editNombre';
            inputNombre.value = cliente.nombre;

            let labelTelefono = document.createElement('label');
            labelTelefono.textContent = 'Teléfono:';
            let inputTelefono = document.createElement('input');
            inputTelefono.type = 'text';
            inputTelefono.className = 'editTelefono';
            inputTelefono.value = cliente.telefono;

            let labelEmail = document.createElement('label');
            labelEmail.textContent = 'Email:';
            let inputEmail = document.createElement('input');
            inputEmail.type = 'email';
            inputEmail.className = 'editEmail';
            inputEmail.value = cliente.email || '';

            let labelGenero = document.createElement('label');
            labelGenero.textContent = 'Género (opcional):';
            let selectGenero = document.createElement('select');
            selectGenero.className = 'editGenero';
            
            let optionSeleccione = document.createElement('option');
            optionSeleccione.value = '';
            optionSeleccione.textContent = 'Seleccione';
            selectGenero.appendChild(optionSeleccione);

            let optionFemenino = document.createElement('option');
            optionFemenino.value = 'Femenino';
            optionFemenino.textContent = 'Femenino';
            if (cliente.genero === 'Femenino') optionFemenino.selected = true;
            selectGenero.appendChild(optionFemenino);

            let optionMasculino = document.createElement('option');
            optionMasculino.value = 'Masculino';
            optionMasculino.textContent = 'Masculino';
            if (cliente.genero === 'Masculino') optionMasculino.selected = true;
            selectGenero.appendChild(optionMasculino);

            let optionOtro = document.createElement('option');
            optionOtro.value = 'Otro';
            optionOtro.textContent = 'Otro';
            if (cliente.genero === 'Otro') optionOtro.selected = true;
            selectGenero.appendChild(optionOtro);

            let btnGuardar = document.createElement('button');
            btnGuardar.type = 'button';
            btnGuardar.className = 'btnGuardarTarjeta btnVerde';
            btnGuardar.setAttribute('data-id', cliente.id);
            btnGuardar.textContent = 'Guardar';

            let btnCancelar = document.createElement('button');
            btnCancelar.type = 'button';
            btnCancelar.className = 'btnCancelarTarjeta btnRegresar';
            btnCancelar.setAttribute('data-id', cliente.id);
            btnCancelar.style.display = 'flex';
            btnCancelar.style.justifyContent = 'center';
            btnCancelar.style.alignItems = 'center';
            btnCancelar.textContent = 'Cancelar';

            formulario.appendChild(labelIdentificacion);
            formulario.appendChild(inputIdentificacion);
            formulario.appendChild(labelNombre);
            formulario.appendChild(inputNombre);
            formulario.appendChild(labelTelefono);
            formulario.appendChild(inputTelefono);
            formulario.appendChild(labelEmail);
            formulario.appendChild(inputEmail);
            formulario.appendChild(labelGenero);
            formulario.appendChild(selectGenero);
            formulario.appendChild(btnGuardar);
            formulario.appendChild(btnCancelar);

            tarjeta.appendChild(tituloNombreCliente);
            tarjeta.appendChild(parrafoIdentificacion);
            tarjeta.appendChild(parrafoTelefono);
            tarjeta.appendChild(parrafoEmail);
            tarjeta.appendChild(parrafoGenero);
            tarjeta.appendChild(btnActualizar);
            tarjeta.appendChild(formulario);
            
            contenedor.appendChild(tarjeta);
        });

        contenedor.querySelectorAll('.btnActualizarTarjeta').forEach(boton => {
            boton.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                const formulario = document.getElementById(`formularioClienteActualizar-${id}`);
                if (formulario) formulario.classList.toggle('active');
            });
        });

        contenedor.querySelectorAll('.btnGuardarTarjeta').forEach(boton => {
            boton.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                const formulario = document.getElementById(`formularioClienteActualizar-${id}`);
                const identificacion = formulario.querySelector('.editIdentificacion').value.trim();
                const nombre = formulario.querySelector('.editNombre').value.trim();
                const telefono = formulario.querySelector('.editTelefono').value.trim();
                const email = formulario.querySelector('.editEmail').value.trim();
                const genero = formulario.querySelector('.editGenero').value;

                if (!identificacion || !nombre || !telefono || !email) {
                    if (mensaje) { mensaje.textContent = 'Complete todos los campos obligatorios'; mensaje.className = 'mensaje error'; }
                    return;
                }
                if (!soloDigitos(identificacion)) {
                    if (mensaje) { mensaje.textContent = 'La identificación solo debe contener números'; mensaje.className = 'mensaje error'; }
                    return;
                }
                if (/\d/.test(nombre)) {
                    if (mensaje) { mensaje.textContent = 'El nombre no debe contener números'; mensaje.className = 'mensaje error'; }
                    return;
                }
                if (!soloDigitos(telefono)) {
                    if (mensaje) { mensaje.textContent = 'El teléfono solo debe contener números'; mensaje.className = 'mensaje error'; }
                    return;
                }
                if (!esEmailValido(email)) {
                    if (mensaje) { mensaje.textContent = 'Ingrese un email válido'; mensaje.className = 'mensaje error'; }
                    return;
                }

                const resultado = actualizarCliente(id, { identificacion, nombre, telefono, email, genero });
                if (!resultado.ok) {
                    if (mensaje) { mensaje.textContent = resultado.error; mensaje.className = 'mensaje error'; }
                    return;
                }
                if (mensaje) { mensaje.textContent = 'Cliente actualizado exitosamente'; mensaje.className = 'mensaje exito'; }
                cargarTarjetasActualizarCliente();
            });
        });

        contenedor.querySelectorAll('.btnCancelarTarjeta').forEach(boton => {
            boton.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                const formulario = document.getElementById(`formularioClienteActualizar-${id}`);
                if (formulario) formulario.classList.remove('active');
            });
        });
    }

    // ================== ELIMINAR CLIENTES ==================
    let clienteEliminarTemporal = null;

    function cargarTarjetasEliminarCliente() {
        const clientes = obtenerClientes();
        const contenedor = document.getElementById('tarjetasEliminarCliente');
        const mensaje = document.getElementById('mensajeEliminarCliente');
        if (!contenedor) return;

        contenedor.textContent = '';
        if (mensaje) mensaje.textContent = '';

        if (clientes.length === 0) {
            let parrafo = document.createElement('p');
            parrafo.style.textAlign = 'center';
            parrafo.style.color = 'red';
            parrafo.textContent = 'No hay clientes registrados';
            contenedor.appendChild(parrafo);
            return;
        }

        clientes.forEach(cliente => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta__cliente';

            let tituloNombreCliente = document.createElement('h3');
            tituloNombreCliente.textContent = cliente.nombre;

            let parrafoIdentificacion = document.createElement('p');
            let spanIdentificacion = document.createElement('span');
            spanIdentificacion.className = 'info__destacada';
            spanIdentificacion.textContent = 'Identificación:';
            parrafoIdentificacion.appendChild(spanIdentificacion);
            parrafoIdentificacion.appendChild(document.createTextNode(' ' + cliente.identificacion));

            let parrafoTelefono = document.createElement('p');
            let spanTelefono = document.createElement('span');
            spanTelefono.className = 'info__destacada';
            spanTelefono.textContent = 'Teléfono:';
            parrafoTelefono.appendChild(spanTelefono);
            parrafoTelefono.appendChild(document.createTextNode(' ' + cliente.telefono));

            let parrafoEmail = document.createElement('p');
            let spanEmail = document.createElement('span');
            spanEmail.className = 'info__destacada';
            spanEmail.textContent = 'Email:';
            parrafoEmail.appendChild(spanEmail);
            parrafoEmail.appendChild(document.createTextNode(' ' + (cliente.email || 'Sin email')));

            let parrafoGenero = document.createElement('p');
            let spanGenero = document.createElement('span');
            spanGenero.className = 'info__destacada';
            spanGenero.textContent = 'Género:';
            parrafoGenero.appendChild(spanGenero);
            parrafoGenero.appendChild(document.createTextNode(' ' + (cliente.genero || 'No especificado')));

            let btnEliminar = document.createElement('button');
            btnEliminar.type = 'button';
            btnEliminar.className = 'btnSeleccionarEliminar';
            btnEliminar.setAttribute('data-id', cliente.id);
            btnEliminar.textContent = 'Eliminar';

            tarjeta.appendChild(tituloNombreCliente);
            tarjeta.appendChild(parrafoIdentificacion);
            tarjeta.appendChild(parrafoTelefono);
            tarjeta.appendChild(parrafoEmail);
            tarjeta.appendChild(parrafoGenero);
            tarjeta.appendChild(btnEliminar);

            contenedor.appendChild(tarjeta);
        });

        contenedor.querySelectorAll('.btnSeleccionarEliminar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                const cliente = obtenerClientePorId(id);
                if (cliente) {
                    clienteEliminarTemporal = cliente;
                    mostrarConfirmacionEliminar(cliente, contenedor, mensaje);
                }
            });
        });
    }

    function mostrarConfirmacionEliminar(cliente, contenedor, mensajeEl) {
        if (!contenedor) return;

        contenedor.textContent = '';

        let confirmacionDiv = document.createElement('div');
        confirmacionDiv.className = 'confirmacionDatos';

        let tituloConfirmacion = document.createElement('h2');
        tituloConfirmacion.textContent = '¿Confirmar eliminación?';

        let tarjetaConfirmacion = document.createElement('div');
        tarjetaConfirmacion.className = 'tarjeta__cliente';
        tarjetaConfirmacion.style.maxWidth = '400px';
        tarjetaConfirmacion.style.margin = '0 auto';

        let tituloNombreCliente = document.createElement('h3');
        tituloNombreCliente.textContent = cliente.nombre;

        let parrafoIdentificacion = document.createElement('p');
        let spanIdentificacion = document.createElement('span');
        spanIdentificacion.className = 'info__destacada';
        spanIdentificacion.textContent = 'Identificación:';
        parrafoIdentificacion.appendChild(spanIdentificacion);
        parrafoIdentificacion.appendChild(document.createTextNode(' ' + cliente.identificacion));

        let parrafoTelefono = document.createElement('p');
        let spanTelefono = document.createElement('span');
        spanTelefono.className = 'info__destacada';
        spanTelefono.textContent = 'Teléfono:';
        parrafoTelefono.appendChild(spanTelefono);
        parrafoTelefono.appendChild(document.createTextNode(' ' + cliente.telefono));

        let parrafoEmail = document.createElement('p');
        let spanEmail = document.createElement('span');
        spanEmail.className = 'info__destacada';
        spanEmail.textContent = 'Email:';
        parrafoEmail.appendChild(spanEmail);
        parrafoEmail.appendChild(document.createTextNode(' ' + (cliente.email || 'Sin email')));

        let parrafoGenero = document.createElement('p');
        let spanGenero = document.createElement('span');
        spanGenero.className = 'info__destacada';
        spanGenero.textContent = 'Género:';
        parrafoGenero.appendChild(spanGenero);
        parrafoGenero.appendChild(document.createTextNode(' ' + (cliente.genero || 'No especificado')));

        tarjetaConfirmacion.appendChild(tituloNombreCliente);
        tarjetaConfirmacion.appendChild(parrafoIdentificacion);
        tarjetaConfirmacion.appendChild(parrafoTelefono);
        tarjetaConfirmacion.appendChild(parrafoEmail);
        tarjetaConfirmacion.appendChild(parrafoGenero);

        let btnConfirmar = document.createElement('button');
        btnConfirmar.type = 'button';
        btnConfirmar.id = 'btnConfirmarEliminarCliente';
        btnConfirmar.textContent = 'Confirmar eliminación';

        let btnCancelar = document.createElement('button');
        btnCancelar.type = 'button';
        btnCancelar.id = 'btnCancelarEliminarCliente';
        btnCancelar.className = 'btnRegresar';
        btnCancelar.style.display = 'flex';
        btnCancelar.style.justifyContent = 'center';
        btnCancelar.style.alignItems = 'center';
        btnCancelar.textContent = 'Cancelar';

        confirmacionDiv.appendChild(tituloConfirmacion);
        confirmacionDiv.appendChild(tarjetaConfirmacion);
        confirmacionDiv.appendChild(btnConfirmar);
        confirmacionDiv.appendChild(btnCancelar);

        contenedor.appendChild(confirmacionDiv);

        btnConfirmar.addEventListener('click', () => {
            if (!clienteEliminarTemporal) return;
            const exito = eliminarCliente(clienteEliminarTemporal.id);
            clienteEliminarTemporal = null;
            cargarTarjetasEliminarCliente();
            if (mensajeEl) {
                mensajeEl.textContent = exito ? 'Cliente eliminado exitosamente' : 'Error al eliminar el cliente';
                mensajeEl.className = exito ? 'mensaje exito' : 'mensaje error';
            }
        });

        btnCancelar.addEventListener('click', () => {
            clienteEliminarTemporal = null;
            cargarTarjetasEliminarCliente();
        });
    }
});
