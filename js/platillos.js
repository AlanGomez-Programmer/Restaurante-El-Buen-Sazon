document.addEventListener('DOMContentLoaded', () => {
    // Cargar tema guardado
    cargarTemaGuardado();
    
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
        btnRegistrarPlatillo: "contenido__registroPlatillo",
        btnMostrarPlatillos: "contenido__mostrarPlatillos",
        btnActualizarPlatillo: "contenido__actualizarPlatillo",
        btnEliminarPlatillo: "contenido__eliminarPlatillo",
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
        window.location.href = "./index.html";
    });

    // ================== LÓGICA DE PLATILLOS ==================
    
    // Cargar tipos de platillos en los selects
    function cargarTiposPlatillos() {
        const tipos = obtenerTiposPlatillos();
        const selectsTipo = document.querySelectorAll('.listaTipoPlatillo');
        
        selectsTipo.forEach(select => {
            select.innerHTML = '<option value="">Elige una opción</option>';
            for (const [clave, tipo] of Object.entries(tipos)) {
                const option = document.createElement('option');
                option.value = clave; // clave puede ser código base o nombre para los nuevos
                option.textContent = tipo.nombre;
                select.appendChild(option);
            }
        });
    }

    // Cargar platillos por tipo seleccionado
    function cargarPlatillosPorTipo(codigoTipo, selectPlatillo) {
        selectPlatillo.innerHTML = '<option value="">Elige una opción</option>';
        
        if (!codigoTipo) return;
        
        const platillos = obtenerPlatillosPorTipo(codigoTipo);
        platillos.forEach(platillo => {
            const option = document.createElement('option');
            option.value = platillo.id;
            option.textContent = `${platillo.nombre} - $${platillo.valorVenta}`;
            selectPlatillo.appendChild(option);
        });
    }

    // Event listeners para selects de tipo
    const selectsTipo = document.querySelectorAll('.listaTipoPlatillo');
    selectsTipo.forEach(select => {
        const selectPlatillo = select.closest('form')?.querySelector('.listaPlatillos');
        if (selectPlatillo) {
            select.addEventListener('change', () => {
                cargarPlatillosPorTipo(select.value, selectPlatillo);
            });
        }
    });

    // Cargar tipos al iniciar
    cargarTiposPlatillos();

    // ================== CREAR TIPO DE PLATILLO ==================
    let datosTipoPlatilloTemporal = null;
    const btnSiguienteTipo = document.getElementById('btnSiguienteTipo');
    const btnGuardarTipo = document.getElementById('btnGuardarTipo');
    const inputNombreTipo = document.querySelector('#contenido__crearTipo input');
    
    if (btnSiguienteTipo && inputNombreTipo) {
        btnSiguienteTipo.addEventListener('click', () => {
            const nombre = inputNombreTipo.value.trim();
            
            if (!nombre) {
                alert('Por favor ingrese un nombre para el tipo de platillo');
                return;
            }
            // Validación: no permitir números en el nombre del tipo de platillo
            if (/\d/.test(nombre)) {
                alert('No se aceptan números en el nombre del tipo de platillo, solo letras.');
                return;
            }
            
            // Validación: evitar nombres de tipo de platillo duplicados (case-insensitive)
            const tipos = obtenerTiposPlatillos() || {};
            const nombreNorm = nombre.toLowerCase();
            const existe = Object.values(tipos).some(t => (t.nombre || '').trim().toLowerCase() === nombreNorm);
            if (existe) {
                alert('Ya existe un tipo de platillo con ese nombre.');
                return;
            }
            
            datosTipoPlatilloTemporal = { nombre };
            
            const confNombre = document.getElementById('confNombreTipo');
            if (confNombre) confNombre.textContent = `Nombre: ${nombre}`;
            
            const confirmacion = document.querySelector('#contenido__crearTipo .confirmacionDatos');
            if (confirmacion) {
                confirmacion.classList.remove('oculto');
            }
            
            inputNombreTipo.value = '';
        });
    }
    
    if (btnGuardarTipo) {
        btnGuardarTipo.addEventListener('click', () => {
            if (!datosTipoPlatilloTemporal) {
                alert('No hay datos de tipo para guardar');
                return;
            }
            
            const creado = agregarTipoPlatillo(datosTipoPlatilloTemporal.nombre);
            if (!creado) {
                alert('El tipo de platillo ya existe.');
                return;
            }
            
            const confNombre = document.getElementById('confNombreTipo');
            if (confNombre) confNombre.textContent = '';
            
            const confirmacion = document.querySelector('#contenido__crearTipo .confirmacionDatos');
            if (confirmacion) {
                confirmacion.classList.add('oculto');
            }
            
            datosTipoPlatilloTemporal = null;
            cargarTiposPlatillos();
            mostrarPantalla("contenido__menu");
        });
    }

    // Limpiar confirmación al cancelar en Crear Tipo de Platillo
    const btnCancelarTipoPlatillo = document.querySelector('#contenido__crearTipo .confirmacionDatos .btnRegresar');
    if (btnCancelarTipoPlatillo) {
        btnCancelarTipoPlatillo.addEventListener('click', () => {
            const confNombre = document.getElementById('confNombreTipo');
            if (confNombre) confNombre.textContent = '';
            const confirmacion = document.querySelector('#contenido__crearTipo .confirmacionDatos');
            if (confirmacion) confirmacion.classList.add('oculto');
            datosTipoPlatilloTemporal = null;
        });
    }

    // ================== REGISTRAR PLATILLO ==================
    let datosPlatilloTemporal = null;
    const btnSiguienteRegistro = document.getElementById('btnSiguienteRegistro');
    const btnGuardarPlatillo = document.getElementById('btnGuardarPlatillo');
    const tipoPlatilloCrear = document.getElementById('tipoPlatilloCrear');
    const nombrePlatillo = document.getElementById('nombrePlatillo');
    const descripcionPlatillo = document.getElementById('descripcionPlatillo');
    const urlImagen = document.getElementById('urlImagen');
    const valorPlatillo = document.getElementById('valorPlatillo');
    const listaIngredientes = document.getElementById('listaIngredientes');
    if (valorPlatillo) {
        valorPlatillo.setAttribute('min', '0');
        valorPlatillo.setAttribute('step', '0.01');
    }
    
    // Cargar insumos en la lista de ingredientes
    function cargarIngredientes() {
        const insumos = obtenerInsumosRegistrados();
        if (!listaIngredientes) return;
        
        listaIngredientes.innerHTML = '';
        
        if (insumos.length === 0) {
            listaIngredientes.innerHTML = '<p style="text-align: center; color: #777;">No hay insumos registrados</p>';
            return;
        }
        
        insumos.forEach(insumo => {
            const item = document.createElement('div');
            item.className = 'ingrediente__item';
            item.innerHTML = `
                <label>
                    <input type="checkbox" class="checkbox-ingrediente" data-id="${insumo.id}" data-nombre="${insumo.insumoNombre}" data-unidad="${insumo.unidad}">
                    ${insumo.insumoNombre} (${insumo.tipoNombre})
                </label>
                <div class="ingrediente__cantidad">
                    <label>Cantidad:</label>
                    <input type="number" class="cantidad-ingrediente" data-id="${insumo.id}" min="0" step="0.1" placeholder="0">
                    <span>${insumo.unidad}</span>
                </div>
            `;
            listaIngredientes.appendChild(item);
        });
    }
    
    // Cargar ingredientes al iniciar
    cargarIngredientes();
    
    if (btnSiguienteRegistro && tipoPlatilloCrear && nombrePlatillo) {
        btnSiguienteRegistro.addEventListener('click', () => {
            const codigoTipo = tipoPlatilloCrear.value;
            const nombre = nombrePlatillo.value.trim();
            const descripcion = descripcionPlatillo.value;
            const imagen = urlImagen.value;
            const valor = valorPlatillo.value;
            const valorNum = parseFloat(valor);
            if (isNaN(valorNum) || valorNum < 0) {
                alert('El valor de venta no puede ser menor a 0');
                return;
            }
            
            // Obtener ingredientes seleccionados
            const checkboxes = document.querySelectorAll('.checkbox-ingrediente:checked');
            const ingredientesSeleccionados = [];
            let hayErrorIng = false;
            
            checkboxes.forEach(checkbox => {
                const id = parseInt(checkbox.getAttribute('data-id'));
                const nombreIng = checkbox.getAttribute('data-nombre');
                const unidad = checkbox.getAttribute('data-unidad');
                const cantidadInput = document.querySelector(`.cantidad-ingrediente[data-id="${id}"]`);
                const cantidad = cantidadInput ? parseFloat(cantidadInput.value) || 0 : 0;
                if (cantidad < 0) {
                    hayErrorIng = true;
                    return;
                }
                
                if (cantidad > 0) {
                    ingredientesSeleccionados.push({
                        id: id,
                        nombre: nombreIng,
                        cantidad: cantidad,
                        unidad: unidad
                    });
                }
            });

            if (hayErrorIng) {
                alert('La cantidad de ingrediente no puede ser menor a 0');
                return;
            }
            
            if (!codigoTipo || !nombre || !valor) {
                alert('Por favor complete los campos obligatorios');
                return;
            }
            
            const nombreTipo = obtenerNombreTipoPlatillo(codigoTipo);
            
            datosPlatilloTemporal = {
                tipoCodigo: codigoTipo,
                tipoNombre: nombreTipo,
                nombre: nombre,
                descripcion: descripcion,
                imagen: imagen,
                valorVenta: parseFloat(valor),
                ingredientes: ingredientesSeleccionados
            };
            
            // Mostrar confirmación
            document.getElementById('confImagen').src = imagen || '';
            document.getElementById('confTipo').textContent = `Tipo: ${nombreTipo}`;
            document.getElementById('confNombre').textContent = `Nombre: ${nombre}`;
            document.getElementById('confDescripcion').textContent = `Descripción: ${descripcion || 'Sin descripción'}`;
            document.getElementById('confValorVenta').textContent = `Valor: $${valor}`;
            
            // Mostrar ingredientes en confirmación
            const confIngredientes = document.getElementById('confIngredientes');
            if (ingredientesSeleccionados.length > 0) {
                confIngredientes.innerHTML = '<p><strong>Ingredientes:</strong></p><ul>' + 
                    ingredientesSeleccionados.map(ing => `<li>${ing.nombre}: ${ing.cantidad} ${ing.unidad}</li>`).join('') + 
                    '</ul>';
            } else {
                confIngredientes.innerHTML = '<p><strong>Ingredientes:</strong> Sin ingredientes</p>';
            }
            
            const confirmacion = document.querySelector('#contenido__registroPlatillo .confirmacionDatos');
            if (confirmacion) {
                confirmacion.classList.remove('oculto');
            }
            
            tipoPlatilloCrear.value = '';
            nombrePlatillo.value = '';
            descripcionPlatillo.value = '';
            urlImagen.value = '';
            valorPlatillo.value = '';
            
            // Limpiar ingredientes
            document.querySelectorAll('.checkbox-ingrediente').forEach(cb => cb.checked = false);
            document.querySelectorAll('.cantidad-ingrediente').forEach(input => input.value = '');
        });
    }
    
    if (btnGuardarPlatillo) {
        btnGuardarPlatillo.addEventListener('click', () => {
            if (!datosPlatilloTemporal) {
                alert('No hay datos de platillo para guardar');
                return;
            }
            
            registrarPlatillo(datosPlatilloTemporal);
            
            document.getElementById('confImagen').src = '';
            document.getElementById('confTipo').textContent = '';
            document.getElementById('confNombre').textContent = '';
            document.getElementById('confDescripcion').textContent = '';
            document.getElementById('confValorVenta').textContent = '';
            document.getElementById('confIngredientes').innerHTML = '';
            
            const confirmacion = document.querySelector('#contenido__registroPlatillo .confirmacionDatos');
            if (confirmacion) {
                confirmacion.classList.add('oculto');
            }
            
            datosPlatilloTemporal = null;
            mostrarPantalla("contenido__menu");
        });
    }

    // ================== MOSTRAR PLATILLOS ==================
    function cargarPlatillosRegistrados() {
        const platillos = obtenerPlatillosRegistrados();
        const contenedorTarjetas = document.getElementById('tarjetasMostrarPlatillos');
        const mensajeMostrar = document.getElementById('mensajeMostrarPlatillos');
        
        if (!contenedorTarjetas) return;
        
        contenedorTarjetas.innerHTML = '';
        if (mensajeMostrar) mensajeMostrar.textContent = '';
        
        if (platillos.length === 0) {
            contenedorTarjetas.innerHTML = '<p style="text-align: center; color: #555;">No hay platillos registrados</p>';
            return;
        }
        
        platillos.forEach(platillo => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta__platillo';
            tarjeta.innerHTML = `
                ${platillo.imagen ? `<img src="${platillo.imagen}" alt="${platillo.nombre}">` : ''}
                <h3>${platillo.nombre}</h3>
                <p><span class="info__destacada">Tipo:</span> ${platillo.tipoNombre}</p>
                <p><span class="info__destacada">Código:</span> ${platillo.codigo || platillo.tipoCodigo}</p>
                <p><span class="info__destacada">Descripción:</span> ${platillo.descripcion || 'Sin descripción'}</p>
                <p><span class="info__destacada">Valor:</span> $${platillo.valorVenta}</p>
                <button class="btnVer" data-id="${platillo.id}">VER</button>
            `;
            contenedorTarjetas.appendChild(tarjeta);
        });
        
        // Agregar event listeners a los botones VER
        document.querySelectorAll('#tarjetasMostrarPlatillos .btnVer').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                mostrarModalPlatillo(id);
            });
        });
    }
    
    function mostrarModalPlatillo(id) {
        const platillos = obtenerPlatillosRegistrados();
        const platillo = platillos.find(p => p.id === id);
        
        if (!platillo) return;
        
        const modal = document.getElementById('modalPlatillo');
        const modalImagen = document.getElementById('modalImagen');
        const modalNombre = document.getElementById('modalNombre');
        const modalTipo = document.getElementById('modalTipo');
        const modalCodigo = document.getElementById('modalCodigo');
        const modalDescripcion = document.getElementById('modalDescripcion');
        const modalValor = document.getElementById('modalValor');
        const modalIngredientes = document.getElementById('modalIngredientes');
        
        modalImagen.src = platillo.imagen || '';
        modalImagen.style.display = platillo.imagen ? 'block' : 'none';
        modalNombre.textContent = platillo.nombre;
        modalTipo.textContent = platillo.tipoNombre;
        modalCodigo.textContent = platillo.codigo || platillo.tipoCodigo;
        modalDescripcion.textContent = platillo.descripcion || 'Sin descripción';
        modalValor.textContent = `$${platillo.valorVenta}`;
        
        // Mostrar ingredientes
        if (platillo.ingredientes && platillo.ingredientes.length > 0) {
            modalIngredientes.innerHTML = platillo.ingredientes.map(ing => 
                `<li>${ing.nombre}: ${ing.cantidad} ${ing.unidad}</li>`
            ).join('');
        } else {
            modalIngredientes.innerHTML = '<li>Sin ingredientes</li>';
        }
        
        modal.classList.add('active');
    }
    
    // Cerrar modal
    const modalCerrar = document.querySelector('.modal__cerrar');
    const modalPlatillo = document.getElementById('modalPlatillo');
    
    if (modalCerrar && modalPlatillo) {
        modalCerrar.addEventListener('click', () => {
            modalPlatillo.classList.remove('active');
        });
        
        modalPlatillo.addEventListener('click', (e) => {
            if (e.target === modalPlatillo) {
                modalPlatillo.classList.remove('active');
            }
        });
    }
    
    const btnMostrarPlatillos = document.getElementById('btnMostrarPlatillos');
    if (btnMostrarPlatillos) {
        btnMostrarPlatillos.addEventListener('click', () => {
            mostrarPantalla("contenido__mostrarPlatillos");
            cargarPlatillosRegistrados();
        });
    }

    // ================== ACTUALIZAR PLATILLO ==================
    function cargarTarjetasActualizar() {
        const platillos = obtenerPlatillosRegistrados();
        const contenedorTarjetas = document.getElementById('tarjetasActualizarPlatillo');
        const mensajeActualizar = document.getElementById('mensajeActualizarPlatillo');
        
        if (!contenedorTarjetas) return;
        
        contenedorTarjetas.innerHTML = '';
        if (mensajeActualizar) mensajeActualizar.textContent = '';
        
        if (platillos.length === 0) {
            contenedorTarjetas.innerHTML = '<p style="text-align: center; color: #555;">No hay platillos registrados</p>';
            return;
        }
        
        platillos.forEach(platillo => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta__platillo';
            tarjeta.innerHTML = `
                ${platillo.imagen ? `<img src="${platillo.imagen}" alt="${platillo.nombre}">` : ''}
                <h3>${platillo.nombre}</h3>
                <p><span class="info__destacada">Tipo:</span> ${platillo.tipoNombre}</p>
                <p><span class="info__destacada">Valor actual:</span> $${platillo.valorVenta}</p>
                <button class="btnActualizar" data-id="${platillo.id}">Actualizar</button>
                <div class="formulario__actualizarTarjeta" id="formularioActualizar-${platillo.id}">
                    <label>Nuevo Valor de Venta:</label>
                    <input type="number" id="nuevoPrecio-${platillo.id}" value="${platillo.valorVenta}" min="0" step="0.01">
                    <label>Nueva Imagen (URL):</label>
                    <input type="text" id="nuevaImagen-${platillo.id}" value="${platillo.imagen || ''}" placeholder="URL de imagen">
                    <button class="btnVerde btnGuardarActualizar" data-id="${platillo.id}">Guardar</button>
                    <button class="btnRegresar btnCancelarActualizar" data-id="${platillo.id}">Cancelar</button>
                </div>
            `;
            contenedorTarjetas.appendChild(tarjeta);
        });
        
        document.querySelectorAll('#tarjetasActualizarPlatillo .btnActualizar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const formulario = document.getElementById(`formularioActualizar-${id}`);
                if (formulario) formulario.classList.toggle('active');
            });
        });
        
        document.querySelectorAll('#tarjetasActualizarPlatillo .btnGuardarActualizar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                const nuevoPrecio = document.getElementById(`nuevoPrecio-${id}`).value;
                const nuevaImagen = document.getElementById(`nuevaImagen-${id}`).value;
                
                const precioNum = parseFloat(nuevoPrecio);
                if (isNaN(precioNum)) {
                    if (mensajeActualizar) {
                        mensajeActualizar.textContent = 'Por favor ingrese un precio válido';
                        mensajeActualizar.className = 'mensaje error';
                    }
                    return;
                }
                if (precioNum < 0) {
                    alert('El valor de venta no puede ser menor a 0. No se puede actualizar el platillo.');
                    if (mensajeActualizar) {
                        mensajeActualizar.textContent = 'El valor de venta no puede ser menor a 0';
                        mensajeActualizar.className = 'mensaje error';
                    }
                    return;
                }
                
                const campos = { valorVenta: precioNum };
                if (nuevaImagen.trim()) campos.imagen = nuevaImagen.trim();
                
                if (actualizarPlatillo(id, campos)) {
                    if (mensajeActualizar) {
                        mensajeActualizar.textContent = 'Platillo actualizado exitosamente';
                        mensajeActualizar.className = 'mensaje exito';
                    }
                    cargarTarjetasActualizar();
                } else {
                    if (mensajeActualizar) {
                        mensajeActualizar.textContent = 'Error al actualizar el platillo';
                        mensajeActualizar.className = 'mensaje error';
                    }
                }
            });
        });
        
        document.querySelectorAll('#tarjetasActualizarPlatillo .btnCancelarActualizar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const formulario = document.getElementById(`formularioActualizar-${id}`);
                if (formulario) formulario.classList.remove('active');
            });
        });
    }
    
    const btnActualizarPlatillo = document.getElementById('btnActualizarPlatillo');
    if (btnActualizarPlatillo) {
        btnActualizarPlatillo.addEventListener('click', () => {
            mostrarPantalla("contenido__actualizarPlatillo");
            cargarTarjetasActualizar();
        });
    }

    // ================== ELIMINAR PLATILLO ==================
    let platilloEliminarTemporal = null;
    
    function cargarTarjetasEliminar() {
        const platillos = obtenerPlatillosRegistrados();
        const contenedorTarjetas = document.getElementById('tarjetasEliminarPlatillo');
        const mensajeEliminar = document.getElementById('mensajeEliminarPlatillo');
        
        if (!contenedorTarjetas) return;
        
        contenedorTarjetas.innerHTML = '';
        if (mensajeEliminar) mensajeEliminar.textContent = '';
        
        if (platillos.length === 0) {
            contenedorTarjetas.innerHTML = '<p style="text-align: center; color: #555;">No hay platillos registrados</p>';
            return;
        }
        
        platillos.forEach(platillo => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta__platillo';
            tarjeta.innerHTML = `
                ${platillo.imagen ? `<img src="${platillo.imagen}" alt="${platillo.nombre}">` : ''}
                <h3>${platillo.nombre}</h3>
                <p><span class="info__destacada">Tipo:</span> ${platillo.tipoNombre}</p>
                <p><span class="info__destacada">Valor:</span> $${platillo.valorVenta}</p>
                <button class="btnSeleccionarEliminar" data-id="${platillo.id}">Eliminar</button>
            `;
            contenedorTarjetas.appendChild(tarjeta);
        });
        
        document.querySelectorAll('#tarjetasEliminarPlatillo .btnSeleccionarEliminar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                const platillo = obtenerPlatillosRegistrados().find(p => p.id === id);
                if (platillo) {
                    platilloEliminarTemporal = platillo;
                    mostrarConfirmacionEliminar(platillo);
                }
            });
        });
    }
    
    function mostrarConfirmacionEliminar(platillo) {
        const contenedorTarjetas = document.getElementById('tarjetasEliminarPlatillo');
        if (!contenedorTarjetas) return;
        
        contenedorTarjetas.innerHTML = `
            <div class="confirmacionDatos">
                <h2>¿Confirmar eliminación?</h2>
                <div class="tarjeta__platillo" style="max-width: 400px; margin: 0 auto;">
                    ${platillo.imagen ? `<img src="${platillo.imagen}" alt="${platillo.nombre}">` : ''}
                    <h3>${platillo.nombre}</h3>
                    <p><span class="info__destacada">Tipo:</span> ${platillo.tipoNombre}</p>
                    <p><span class="info__destacada">Valor:</span> $${platillo.valorVenta}</p>
                </div>
                <button type="button" id="btnConfirmarEliminarPlatillo">Confirmar eliminación</button>
                <button type="button" id="btnCancelarEliminarPlatillo" class="btnRegresar">Cancelar</button>
            </div>
        `;
        
        const btnConfirmar = document.getElementById('btnConfirmarEliminarPlatillo');
        const btnCancelar = document.getElementById('btnCancelarEliminarPlatillo');
        const mensajeEliminar = document.getElementById('mensajeEliminarPlatillo');
        
        if (btnConfirmar) {
            btnConfirmar.addEventListener('click', () => {
                if (platilloEliminarTemporal) {
                    if (eliminarPlatillo(platilloEliminarTemporal.id)) {
                        if (mensajeEliminar) {
                            mensajeEliminar.textContent = 'Platillo eliminado exitosamente';
                            mensajeEliminar.className = 'mensaje exito';
                        }
                        platilloEliminarTemporal = null;
                        cargarTarjetasEliminar();
                    } else {
                        if (mensajeEliminar) {
                            mensajeEliminar.textContent = 'Error al eliminar el platillo';
                            mensajeEliminar.className = 'mensaje error';
                        }
                    }
                }
            });
        }
        
        if (btnCancelar) {
            btnCancelar.addEventListener('click', () => {
                platilloEliminarTemporal = null;
                cargarTarjetasEliminar();
            });
        }
    }
    
    const btnEliminarPlatillo = document.getElementById('btnEliminarPlatillo');
    if (btnEliminarPlatillo) {
        btnEliminarPlatillo.addEventListener('click', () => {
            mostrarPantalla("contenido__eliminarPlatillo");
            cargarTarjetasEliminar();
        });
    }
});