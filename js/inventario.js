document.addEventListener('DOMContentLoaded', () => {
    // Cargar tema guardado
    cargarTemaGuardado();
    
    // Selecciona todos los elementos que tengan la clase .pantalla
    const pantallas = document.querySelectorAll(".pantalla");

    function mostrarPantalla(idPantalla) {
        pantallas.forEach(pantalla => {
            pantalla.classList.add("oculto");
        });

        document.getElementById(idPantalla)
            .classList.remove("oculto");
    }

    // Cargar nombre de usuario desde localStorage
    cargarNombreUsuario();

    // Configurar navegación con objeto botonesPantalla
    const botonesPantalla = {
        btnRegistrarInsumo: "contenido__registroInsumo",
        btnMostrarInsumo: "contenido__mostrarInsumos",
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

    // Botón para crear nuevo insumo desde el formulario de registro
    const btnCrearCodigo = document.getElementById("btnCrearCodigo");
    if (btnCrearCodigo) {
        btnCrearCodigo.addEventListener("click", () => {
            mostrarPantalla("contenido__crearInsumo");
        });
    }


    // Botón para regresar al menú principal
    const btnRegresarMenu = document.getElementById("btnRegresa-menuPrincipal");
    btnRegresarMenu.addEventListener("click", () => {
        window.location.href = "./menu.html";
    });

    // Botón para regresar al menú que corresponde
    const botonesRegresar = document.querySelectorAll(".btnRegresar");
    botonesRegresar.forEach(boton => {
        boton.addEventListener("click", () => {
            mostrarPantalla("contenido__menu");
        });
    });

    // Botón para salir y regresar al login
    const btnSalir = document.getElementById("btnSalir");
    btnSalir.addEventListener('click', ()=> {
        localStorage.removeItem('el_buen_sazon_theme');
        window.location.href = "./index.html";
    });

    // Función para mostrar mensajes en pantalla
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

    // Función reutilizable para mostrar confirmación
    function mostrarConfirmacion(boton) {
        const pantalla = boton.closest(".pantalla");
        const confirmacion = pantalla.querySelector(".confirmacionDatos");
        if (confirmacion) {
            confirmacion.classList.remove("oculto");
        }
    }

    // ================== LÓGICA DE INSUMOS ==================
    
    // Cargar tipos de insumos en los select
    function cargarTiposInsumos() {
        const tipos = obtenerTiposInsumos();
        const selectsTipo = document.querySelectorAll('.listaTipoInsumo');
        
        selectsTipo.forEach(select => {
            select.innerHTML = '<option value="">Elige una opción</option>';
            for (const [codigo, tipo] of Object.entries(tipos)) {
                const option = document.createElement('option');
                option.value = codigo;
                option.textContent = tipo.nombre;
                select.appendChild(option);
            }
        });
    }

    // Cargar insumos por tipo seleccionado
    function cargarInsumosPorTipo(codigoTipo, selectInsumo) {
        // Limpiar opciones previas y colocar placeholder
        selectInsumo.innerHTML = '';
        let eligeOpcion = document.createElement('option');
        eligeOpcion.value = "";
        eligeOpcion.textContent = 'Elige una opción';
        selectInsumo.appendChild(eligeOpcion);
        
        if (!codigoTipo) return;
        
        const insumos = obtenerInsumosPorTipo(codigoTipo);
        insumos.forEach(insumo => {
            const option = document.createElement('option');
            option.value = insumo.codigo;
            option.textContent = `${insumo.nombre}`;
            selectInsumo.appendChild(option);
        });
    }

    // Actualizar unidad de medida según el tipo de insumo
    function actualizarUnidadMedida(codigoTipo, selectUnidad) {
        if (!codigoTipo) {
            selectUnidad.innerHTML = '<option value="">Unidad de medida</option>';
            return;
        }
        
        const unidad = obtenerUnidadMedida(codigoTipo);
        selectUnidad.innerHTML = `<option value="${unidad}">${unidad}</option>`;
    }

    // Event listener para cambio de tipo de insumo en registro
    const tipoInsumo = document.getElementById('tipoInsumo');
    const insumo = document.getElementById('insumo');
    const unidadInsumo = document.getElementById('unidadInsumo');
    const inputCantidadRegistro = document.getElementById('cantidadInsumo');
    if (inputCantidadRegistro) {
        inputCantidadRegistro.setAttribute('min', '0');
    }
    
    if (tipoInsumo && insumo) {
        tipoInsumo.addEventListener('change', () => {
            cargarInsumosPorTipo(tipoInsumo.value, insumo);
            if (unidadInsumo) {
                actualizarUnidadMedida(tipoInsumo.value, unidadInsumo);
            }
        });
    }

    // Event listeners para otros selects de tipo
    const selectsTipo = document.querySelectorAll('.listaTipoInsumo');
    selectsTipo.forEach(select => {
        if (select.id !== 'tipoInsumo') {
            const selectInsumo = select.closest('form')?.querySelector('.listaInsumo');
            if (selectInsumo) {
                select.addEventListener('change', () => {
                    cargarInsumosPorTipo(select.value, selectInsumo);
                });
            }
        }
    });

    // Cargar tipos al iniciar
    cargarTiposInsumos();

    // Variable temporal para guardar los datos del insumo
    let datosInsumoTemporal = null;

    // ================== BOTÓN SIGUIENTE REGISTRO ==================
    const btnSiguienteRegistro = document.getElementById("btnSiguienteRegistro");
    
    if (btnSiguienteRegistro) {
        btnSiguienteRegistro.addEventListener('click', () => {
            const tipoInsumo = document.getElementById('tipoInsumo');
            const insumo = document.getElementById('insumo');
            const cantidadInsumo = document.getElementById('cantidadInsumo');
            const unidadInsumo = document.getElementById('unidadInsumo');
            const fechaIngreso = document.getElementById('fechaIngreso');
            const descripcionInsumo = document.getElementById('descripcionInsumo');
            
            if (!tipoInsumo.value || !insumo.value || !cantidadInsumo.value || !unidadInsumo.value || !fechaIngreso.value) {
                mostrarMensaje('mensajeRegistro', 'Por favor complete todos los campos obligatorios', 'error');
                return;
            }
            
            const cantidadNum = parseFloat(cantidadInsumo.value);
            // Validación explícita: cantidad válida y no negativa
            if (isNaN(cantidadNum)) {
                mostrarMensaje('mensajeRegistro', 'Ingrese una cantidad válida', 'error');
                return;
            }
            if (cantidadNum < 0) {
                alert('La cantidad no puede ser menor a 0. No se puede agregar el nuevo insumo.');
                mostrarMensaje('mensajeRegistro', 'La cantidad no puede ser menor a 0', 'error');
                return;
            }
            
            const nombreTipo = obtenerNombreTipo(tipoInsumo.value);
            const nombreInsumo = obtenerNombreInsumo(tipoInsumo.value, insumo.value);
            
            // Guardar datos temporalmente
            datosInsumoTemporal = {
                tipoCodigo: tipoInsumo.value,
                tipoNombre: nombreTipo,
                insumoCodigo: insumo.value,
                insumoNombre: nombreInsumo,
                cantidad: cantidadInsumo.value,
                unidad: unidadInsumo.value,
                fechaIngreso: fechaIngreso.value,
                descripcion: descripcionInsumo.value || ''
            };
            
            // Mostrar datos en la confirmación
            document.getElementById('confTipo').textContent = `Tipo: ${nombreTipo}`;
            document.getElementById('confInsumo').textContent = `Insumo: ${nombreInsumo}`;
            document.getElementById('confCantidad').textContent = `Cantidad: ${cantidadInsumo.value}`;
            document.getElementById('confUnidad').textContent = `Unidad: ${unidadInsumo.value}`;
            document.getElementById('confFecha').textContent = `Fecha: ${fechaIngreso.value}`;
            document.getElementById('confDescripcion').textContent = `Descripción: ${descripcionInsumo.value || 'Sin descripción'}`;
            
            // Mostrar confirmación
            mostrarConfirmacion(btnSiguienteRegistro);
            
            // Limpiar campos del formulario
            tipoInsumo.value = '';
            insumo.value = '';
            cantidadInsumo.value = '';
            unidadInsumo.innerHTML = '<option value="">Unidad de medida</option>';
            fechaIngreso.value = '';
            descripcionInsumo.value = '';
        });
    }

    // ================== GUARDAR INSUMO REGISTRADO ==================
    const btnGuardarInsumo = document.getElementById('btnGuardarInsumo');
    
    if (btnGuardarInsumo) {
        btnGuardarInsumo.addEventListener('click', () => {
            if (!datosInsumoTemporal) {
                mostrarMensaje('mensajeRegistro', 'No hay datos de insumo para guardar', 'error');
                return;
            }
            
            registrarInsumo(datosInsumoTemporal);
            mostrarMensaje('mensajeRegistro', 'Insumo registrado exitosamente', 'exito');
            
            // Limpiar datos de confirmación
            document.getElementById('confTipo').textContent = '';
            document.getElementById('confInsumo').textContent = '';
            document.getElementById('confCantidad').textContent = '';
            document.getElementById('confUnidad').textContent = '';
            document.getElementById('confFecha').textContent = '';
            document.getElementById('confDescripcion').textContent = '';
            
            // Ocultar confirmación y volver al menú
            const confirmacion = document.querySelector('.confirmacionDatos');
            if (confirmacion) {
                confirmacion.classList.add('oculto');
            }
            datosInsumoTemporal = null;
            mostrarPantalla("contenido__menu");
        });
    }

    // ================== MOSTRAR INSUMOS REGISTRADOS ==================
    function cargarInsumosRegistrados() {
        const insumos = obtenerInsumosRegistrados();
        const contenedorTarjetas = document.getElementById('tarjetasInsumos');
        const tablaTotales = document.getElementById('tablaTotalesInsumos');
        
        if (!contenedorTarjetas) return;
        
        contenedorTarjetas.innerHTML = '';
        
        // Cargar tabla de totales globales
        if (tablaTotales) {
            tablaTotales.innerHTML = '';
            const totales = obtenerTotalesGlobalesInsumos();
            if (totales.length === 0) {
                const fila = document.createElement('tr');
                fila.innerHTML = `<td colspan="2" style="text-align:center;">No hay insumos</td>`;
                tablaTotales.appendChild(fila);
            } else {
                totales.forEach(t => {
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <td>${t.insumoNombre} <small>(${t.tipoNombre})</small></td>
                        <td><strong>${t.cantidadTotal}</strong> ${t.unidad}</td>
                    `;
                    tablaTotales.appendChild(fila);
                });
            }
        }
        
        if (insumos.length === 0) {
            contenedorTarjetas.innerHTML = '<p style="text-align: center; color: #555;">No hay insumos registrados</p>';
            return;
        }
        
        insumos.forEach(insumo => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta__insumo';
            tarjeta.innerHTML = `
                <h3>${insumo.insumoNombre}</h3>
                <p><span class="info__destacada">Tipo:</span> ${insumo.tipoNombre}</p>
                <p><span class="info__destacada">Cantidad:</span> ${insumo.cantidad} ${insumo.unidad}</p>
                <p><span class="info__destacada">Fecha de ingreso:</span> ${insumo.fechaIngreso}</p>
                <p><span class="info__destacada">Descripción:</span> ${insumo.descripcion || 'Sin descripción'}</p>
            `;
            contenedorTarjetas.appendChild(tarjeta);
        });
    }

    // Cargar insumos registrados cuando se muestra la pantalla
    const btnMostrarInsumo = document.getElementById('btnMostrarInsumo');
    if (btnMostrarInsumo) {
        btnMostrarInsumo.addEventListener('click', () => {
            mostrarPantalla("contenido__mostrarInsumos");
            cargarInsumosRegistrados();
        });
    }

    // ================== CREAR NUEVO TIPO ==================
    let datosTipoTemporal = null;
    const btnSiguienteTipo = document.getElementById('btnSiguienteTipo');
    const btnGuardarTipo = document.getElementById('btnGuardarTipo');
    const btnCancelarTipo = document.getElementById('btnCancelarTipo');
    const nombreTipoInsumo = document.getElementById('nombreTipoInsumo');
    const unidadTipoInsumo = document.getElementById('unidadTipoInsumo');
    
    if (btnSiguienteTipo && nombreTipoInsumo && unidadTipoInsumo) {
        btnSiguienteTipo.addEventListener('click', () => {
            const nombre = nombreTipoInsumo.value.trim();
            const unidad = unidadTipoInsumo.value;
            
            if (!nombre) {
                mostrarMensaje('mensajeCrearTipo', 'Por favor ingrese un nombre para el tipo de insumo', 'error');
                return;
            }
            
            if (!unidad) {
                mostrarMensaje('mensajeCrearTipo', 'Por favor seleccione la unidad de medida', 'error');
                return;
            }
            
            // Validación: evitar nombres de tipo duplicados (insensible a mayúsculas/minúsculas)
            const tipos = obtenerTiposInsumos() || {};
            const nombreNorm = nombre.toLowerCase();
            const existeTipo = Object.values(tipos).some(t => (t.nombre || '').trim().toLowerCase() === nombreNorm);
            if (existeTipo) {
                alert('Ya existe un tipo de insumo con ese nombre.');
                mostrarMensaje('mensajeCrearTipo', 'El tipo de insumo ya existe', 'error');
                return;
            }

            // Extraer código del nombre (ej: "L - Lacteos" -> "L")
            const codigo = nombre.split(' - ')[0];
            
            datosTipoTemporal = {
                codigo: codigo,
                nombre: nombre,
                unidad: unidad
            };
            
            const confNombre = document.getElementById('confNombreTipo');
            const confUnidad = document.getElementById('confUnidadTipo');
            if (confNombre) confNombre.textContent = `Tipo: ${nombre}`;
            if (confUnidad) confUnidad.textContent = `Unidad: ${unidad}`;
            
            const confirmacion = document.querySelector('#contenido__crearTipo .confirmacionDatos');
            if (confirmacion) {
                confirmacion.classList.remove('oculto');
            }
            
            nombreTipoInsumo.value = '';
            unidadTipoInsumo.value = '';
        });
    }
    
    if (btnGuardarTipo) {
        btnGuardarTipo.addEventListener('click', () => {
            if (!datosTipoTemporal) {
                mostrarMensaje('mensajeCrearTipo', 'No hay datos de tipo para guardar', 'error');
                return;
            }
            
            const creado = agregarTipoInsumo(datosTipoTemporal.codigo, datosTipoTemporal.nombre, datosTipoTemporal.unidad);
            if (!creado) {
                alert('El tipo de insumo ya existe o el código ya está en uso.');
                mostrarMensaje('mensajeCrearTipo', 'No se pudo crear: ya existe un tipo con ese nombre o código', 'error');
                return;
            }
            mostrarMensaje('mensajeCrearTipo', 'Tipo de insumo creado exitosamente', 'exito');
            
            const confNombre = document.getElementById('confNombreTipo');
            const confUnidad = document.getElementById('confUnidadTipo');
            if (confNombre) confNombre.textContent = '';
            if (confUnidad) confUnidad.textContent = '';
            
            const confirmacion = document.querySelector('#contenido__crearTipo .confirmacionDatos');
            if (confirmacion) {
                confirmacion.classList.add('oculto');
            }
            
            datosTipoTemporal = null;
            cargarTiposInsumos();
            mostrarPantalla("contenido__menu");
        });
    }
    
    if (btnCancelarTipo) {
        btnCancelarTipo.addEventListener('click', () => {
            const confNombre = document.getElementById('confNombreTipo');
            const confUnidad = document.getElementById('confUnidadTipo');
            if (confNombre) confNombre.textContent = '';
            if (confUnidad) confUnidad.textContent = '';
            
            const confirmacion = document.querySelector('#contenido__crearTipo .confirmacionDatos');
            if (confirmacion) {
                confirmacion.classList.add('oculto');
            }
            
            datosTipoTemporal = null;
        });
    }

    // ================== CREAR NUEVO INSUMO ==================
    let datosInsumoNuevoTemporal = null;
    const btnSiguienteCrearInsumo = document.getElementById('btnSiguienteCrearInsumo');
    const btnGuardarCrearInsumo = document.getElementById('btnGuardarCrearInsumo');
    const btnCancelarCrearInsumo = document.getElementById('btnCancelarCrearInsumo');
    const tipoInsumoCrear = document.getElementById('tipoInsumoCrear');
    const nuevoInsumo = document.getElementById('nuevoInsumo');
    
    if (btnSiguienteCrearInsumo && tipoInsumoCrear && nuevoInsumo) {
        btnSiguienteCrearInsumo.addEventListener('click', () => {
            const codigoTipo = tipoInsumoCrear.value;
            const nombreInsumo = nuevoInsumo.value.trim();
            
            if (!codigoTipo || !nombreInsumo) {
                mostrarMensaje('mensajeCrearInsumo', 'Por favor complete todos los campos', 'error');
                return;
            }
            
            // Validación: solo letras y espacios (no números)
            if (/\d/.test(nombreInsumo)) {
                alert('No se aceptan números en el nombre del insumo, solo letras.');
                mostrarMensaje('mensajeCrearInsumo', 'El nombre del insumo no debe contener números', 'error');
                return;
            }
            
            // Validación: evitar nombres duplicados en el mismo tipo
            const existentes = obtenerInsumosPorTipo(codigoTipo) || [];
            const nombreNormalizado = nombreInsumo.toLowerCase();
            const yaExiste = existentes.some(i => (i.nombre || '').trim().toLowerCase() === nombreNormalizado);
            if (yaExiste) {
                alert('Ya existe un insumo con ese nombre en este tipo.');
                mostrarMensaje('mensajeCrearInsumo', 'El insumo ya existe en este tipo', 'error');
                return;
            }
            
            const nombreTipo = obtenerNombreTipo(codigoTipo);
            
            datosInsumoNuevoTemporal = {
                codigoTipo: codigoTipo,
                nombreTipo: nombreTipo,
                nombreInsumo: nombreInsumo
            };
            
            const confTipo = document.getElementById('confTipoCrear');
            const confNuevo = document.getElementById('confNuevoInsumo');
            if (confTipo) confTipo.textContent = `Tipo: ${nombreTipo}`;
            if (confNuevo) confNuevo.textContent = `Insumo: ${nombreInsumo}`;
            
            const confirmacion = document.querySelector('#contenido__crearInsumo .confirmacionDatos');
            if (confirmacion) {
                confirmacion.classList.remove('oculto');
            }
            
            tipoInsumoCrear.value = '';
            nuevoInsumo.value = '';
        });
    }
    
    if (btnGuardarCrearInsumo) {
        btnGuardarCrearInsumo.addEventListener('click', () => {
            if (!datosInsumoNuevoTemporal) {
                mostrarMensaje('mensajeCrearInsumo', 'No hay datos de insumo para guardar', 'error');
                return;
            }
            
            const creado = agregarInsumo(datosInsumoNuevoTemporal.codigoTipo, datosInsumoNuevoTemporal.nombreInsumo);
            if (!creado) {
                alert('El insumo ya existe en este tipo.');
                mostrarMensaje('mensajeCrearInsumo', 'El insumo ya existe en este tipo', 'error');
                return;
            }
            mostrarMensaje('mensajeCrearInsumo', 'Insumo creado exitosamente', 'exito');
            
            const confTipo = document.getElementById('confTipoCrear');
            const confNuevo = document.getElementById('confNuevoInsumo');
            if (confTipo) confTipo.textContent = '';
            if (confNuevo) confNuevo.textContent = '';
            
            const confirmacion = document.querySelector('#contenido__crearInsumo .confirmacionDatos');
            if (confirmacion) {
                confirmacion.classList.add('oculto');
            }
            
            datosInsumoNuevoTemporal = null;
            cargarTiposInsumos();
            mostrarPantalla("contenido__menu");
        });
    }
    
    if (btnCancelarCrearInsumo) {
        btnCancelarCrearInsumo.addEventListener('click', () => {
            const confTipo = document.getElementById('confTipoCrear');
            const confNuevo = document.getElementById('confNuevoInsumo');
            if (confTipo) confTipo.textContent = '';
            if (confNuevo) confNuevo.textContent = '';
            
            const confirmacion = document.querySelector('#contenido__crearInsumo .confirmacionDatos');
            if (confirmacion) {
                confirmacion.classList.add('oculto');
            }
            
            datosInsumoNuevoTemporal = null;
        });
    }

    // ================== ACTUALIZAR INSUMOS (TARJETAS) ==================
    function cargarTarjetasActualizar() {
        const insumos = obtenerInsumosRegistrados();
        const contenedorTarjetas = document.getElementById('tarjetasActualizar');
        const mensaje = document.getElementById('mensajeActualizar');
        
        if (!contenedorTarjetas) return;
        
        contenedorTarjetas.innerHTML = '';
        if (mensaje) mensaje.textContent = '';
        
        if (insumos.length === 0) {
            contenedorTarjetas.innerHTML = '<p style="text-align: center; color: #555;">No hay insumos registrados</p>';
            return;
        }
        
        insumos.forEach(insumo => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta__insumo';
            tarjeta.innerHTML = `
                <h3>${insumo.insumoNombre}</h3>
                <p><span class="info__destacada">Tipo:</span> ${insumo.tipoNombre}</p>
                <p><span class="info__destacada">Cantidad:</span> ${insumo.cantidad} ${insumo.unidad}</p>
                <p><span class="info__destacada">Fecha de ingreso:</span> ${insumo.fechaIngreso}</p>
                <p><span class="info__destacada">Descripción:</span> ${insumo.descripcion || 'Sin descripción'}</p>
                <button type="button" class="btnActualizarTarjeta" data-id="${insumo.id}">Actualizar</button>
                <div class="formulario__actualizarTarjeta" id="formularioTarjeta-${insumo.id}">
                    <label>Nueva cantidad:</label>
                    <input type="number" class="nuevaCantidadTarjeta" value="${insumo.cantidad}" min="0">
                    <button type="button" class="btnGuardarTarjeta btnVerde" data-id="${insumo.id}">Guardar</button>
                    <button type="button" class="btnCancelarTarjeta btnRegresar" data-id="${insumo.id}">Cancelar</button>
                </div>
            `;
            contenedorTarjetas.appendChild(tarjeta);
        });
        
        // Event listeners para botones de actualizar en tarjetas
        document.querySelectorAll('.btnActualizarTarjeta').forEach(boton => {
            boton.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                const formulario = document.getElementById(`formularioTarjeta-${id}`);
                if (formulario) {
                    formulario.classList.toggle('active');
                }
            });
        });
        
        // Event listeners para guardar en tarjetas
        document.querySelectorAll('.btnGuardarTarjeta').forEach(boton => {
            boton.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                const formulario = document.getElementById(`formularioTarjeta-${id}`);
                const input = formulario.querySelector('.nuevaCantidadTarjeta');
                const nuevaCantidad = parseFloat(input.value);
                
                if (isNaN(nuevaCantidad)) {
                    if (mensaje) {
                        mensaje.textContent = 'Por favor ingrese una cantidad válida';
                        mensaje.className = 'mensaje error';
                    }
                    return;
                }
                
                if (nuevaCantidad < 0) {
                    if (mensaje) {
                        mensaje.textContent = 'La cantidad no puede ser menor a 0';
                        mensaje.className = 'mensaje error';
                    }
                    alert('La cantidad no puede ser menor a 0. No se puede actualizar el insumo.');
                    return;
                }
                
                const exito = actualizarCantidadInsumo(id, nuevaCantidad);
                
                if (exito) {
                    if (mensaje) {
                        mensaje.textContent = 'Insumo actualizado exitosamente';
                        mensaje.className = 'mensaje exito';
                    }
                    cargarTarjetasActualizar();
                } else {
                    if (mensaje) {
                        mensaje.textContent = 'Error al actualizar el insumo';
                        mensaje.className = 'mensaje error';
                    }
                }
            });
        });
        
        // Event listeners para cancelar en tarjetas
        document.querySelectorAll('.btnCancelarTarjeta').forEach(boton => {
            boton.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                const formulario = document.getElementById(`formularioTarjeta-${id}`);
                if (formulario) {
                    formulario.classList.remove('active');
                }
            });
        });
    }
    
    const btnActualizarInsumo = document.getElementById('btnActualizarInsumo');
    if (btnActualizarInsumo) {
        btnActualizarInsumo.addEventListener('click', () => {
            mostrarPantalla("contenido__actualizarInsumo");
            cargarTarjetasActualizar();
        });
    }

    // ================== ELIMINAR INSUMOS (TARJETAS) ==================
    let insumoEliminarTemporal = null;
    
    function cargarTarjetasEliminar() {
        const insumos = obtenerInsumosRegistrados();
        const contenedor = document.getElementById('tarjetasEliminar');
        const mensaje = document.getElementById('mensajeEliminar');
        
        if (!contenedor) return;
        
        contenedor.innerHTML = '';
        if (mensaje) mensaje.textContent = '';
        
        if (insumos.length === 0) {
            contenedor.innerHTML = '<p style="text-align: center; color: #555;">No hay insumos registrados</p>';
            return;
        }
        
        insumos.forEach(insumo => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta__insumo';
            tarjeta.innerHTML = `
                <h3>${insumo.insumoNombre}</h3>
                <p><span class="info__destacada">Tipo:</span> ${insumo.tipoNombre}</p>
                <p><span class="info__destacada">Cantidad:</span> ${insumo.cantidad} ${insumo.unidad}</p>
                <p><span class="info__destacada">Fecha de ingreso:</span> ${insumo.fechaIngreso}</p>
                <p><span class="info__destacada">Descripción:</span> ${insumo.descripcion || 'Sin descripción'}</p>
                <button type="button" class="btnSeleccionarEliminar" data-id="${insumo.id}">Eliminar</button>
            `;
            contenedor.appendChild(tarjeta);
        });
        
        // Listeners para botones de eliminar en tarjetas
        document.querySelectorAll('#tarjetasEliminar .btnSeleccionarEliminar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                const insumosActuales = obtenerInsumosRegistrados();
                const insumo = insumosActuales.find(i => i.id === id);
                if (insumo) {
                    insumoEliminarTemporal = insumo;
                    mostrarConfirmacionEliminar(insumo, contenedor, mensaje);
                }
            });
        });
    }
    
    function mostrarConfirmacionEliminar(insumo, contenedor, mensajeEl) {
        if (!contenedor) return;
        
        contenedor.innerHTML = `
            <div class="confirmacionDatos">
                <h2>¿Confirmar eliminación?</h2>
                <div class="tarjeta__insumo" style="max-width: 400px; margin: 0 auto;">
                    <h3>${insumo.insumoNombre}</h3>
                    <p><span class="info__destacada">Tipo:</span> ${insumo.tipoNombre}</p>
                    <p><span class="info__destacada">Cantidad:</span> ${insumo.cantidad} ${insumo.unidad}</p>
                    <p><span class="info__destacada">Fecha de ingreso:</span> ${insumo.fechaIngreso}</p>
                    <p><span class="info__destacada">Descripción:</span> ${insumo.descripcion || 'Sin descripción'}</p>
                </div>
                <button type="button" id="btnConfirmarEliminarInsumo">Confirmar eliminación</button>
                <button type="button" id="btnCancelarEliminarInsumo" class="btnRegresar">Cancelar</button>
            </div>
        `;
        
        const btnConfirmar = document.getElementById('btnConfirmarEliminarInsumo');
        const btnCancelar = document.getElementById('btnCancelarEliminarInsumo');
        
        if (btnConfirmar) {
            btnConfirmar.addEventListener('click', () => {
                if (!insumoEliminarTemporal) return;
                
                // Validación: asegurarnos que el insumo aún existe
                const actuales = obtenerInsumosRegistrados();
                const existe = actuales.find(i => i.id === insumoEliminarTemporal.id);
                if (!existe) {
                    if (mensajeEl) {
                        mensajeEl.textContent = 'El insumo ya no existe';
                        mensajeEl.className = 'mensaje error';
                    }
                    cargarTarjetasEliminar();
                    return;
                }
                
                const exito = eliminarInsumoRegistrado(insumoEliminarTemporal.id);
                
                insumoEliminarTemporal = null;
                
                if (exito) {
                    if (mensajeEl) {
                        mensajeEl.textContent = 'Insumo eliminado exitosamente';
                        mensajeEl.className = 'mensaje exito';
                    }
                } else {
                    if (mensajeEl) {
                        mensajeEl.textContent = 'Error al eliminar el insumo';
                        mensajeEl.className = 'mensaje error';
                    }
                }
                
                // Recargar tarjetas después de eliminar
                setTimeout(() => {
                    cargarTarjetasEliminar();
                }, 800);
            });
        }
        
        if (btnCancelar) {
            btnCancelar.addEventListener('click', () => {
                insumoEliminarTemporal = null;
                cargarTarjetasEliminar();
            });
        }
    }
    
    const btnEliminarInsumo = document.getElementById('btnEliminarInsumo');
    if (btnEliminarInsumo) {
        btnEliminarInsumo.addEventListener('click', () => {
            mostrarPantalla("contenido__eliminarInsumo");
            cargarTarjetasEliminar();
        });
    }
});
