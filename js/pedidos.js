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
        window.location.href = "./index.html";
    });

    // ================== LÓGICA DE PEDIDOS ==================
    
    // Cargar platillos en la tabla de registro
    function cargarPlatillosEnTabla() {
        const platillos = obtenerPlatillosRegistrados();
        const cuerpoTabla = document.getElementById('cuerpoTabla__platillos');
        
        if (!cuerpoTabla) return;
        
        cuerpoTabla.innerHTML = '';
        
        if (platillos.length === 0) {
            cuerpoTabla.innerHTML = '<tr><td colspan="6">No hay platillos registrados</td></tr>';
            return;
        }
        
        platillos.forEach(platillo => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${platillo.tipoNombre}</td>
                <td>${platillo.nombre}</td>
                <td>$${platillo.valorVenta.toFixed(2)}</td>
                <td><input type="number" class="cantidad-platillo" data-id="${platillo.id}" data-precio="${platillo.valorVenta}" min="1" value="1" style="width: 70px;"></td>
                <td class="subtotal-platillo" data-id="${platillo.id}">$${platillo.valorVenta.toFixed(2)}</td>
                <td><input type="checkbox" class="checkbox-platillo" data-id="${platillo.id}" data-nombre="${platillo.nombre}" data-precio="${platillo.valorVenta}" data-tipo="${platillo.tipoNombre || ''}"></td>
            `;
            cuerpoTabla.appendChild(fila);
        });
        
        // Agregar event listeners para actualizar subtotales y total
        document.querySelectorAll('.cantidad-platillo').forEach(input => {
            input.addEventListener('change', actualizarTotales);
            input.addEventListener('input', actualizarTotales);
        });
        
        document.querySelectorAll('.checkbox-platillo').forEach(checkbox => {
            checkbox.addEventListener('change', actualizarTotales);
        });
    }
    
    function actualizarTotales() {
        let total = 0;
        
        document.querySelectorAll('.checkbox-platillo:checked').forEach(checkbox => {
            const id = checkbox.getAttribute('data-id');
            const precio = parseFloat(checkbox.getAttribute('data-precio'));
            const cantidadInput = document.querySelector(`.cantidad-platillo[data-id="${id}"]`);
            const cantidad = cantidadInput ? parseInt(cantidadInput.value) || 1 : 1;
            const subtotal = precio * cantidad;
            
            const subtotalCell = document.querySelector(`.subtotal-platillo[data-id="${id}"]`);
            if (subtotalCell) {
                subtotalCell.textContent = `$${subtotal.toFixed(2)}`;
            }
            
            total += subtotal;
        });
        
        const totalElement = document.getElementById('totalPedido');
        if (totalElement) {
            totalElement.textContent = total.toFixed(2);
        }
    }

    // ================== REGISTRAR PEDIDO ==================
    let datosPedidoTemporal = null;
    const btnSiguienteRegistro = document.getElementById('btnSiguienteRegistro');
    const btnGuardarPedido = document.getElementById('btnGuardarPedido');
    
    if (btnSiguienteRegistro) {
        btnSiguienteRegistro.addEventListener('click', () => {
            const fechaPedido = document.getElementById('fechaPedido').value;
            const horaPedido = document.getElementById('horaPedido').value;
            const nombreCliente = document.getElementById('nombreCliente').value;
            const numeroCliente = document.getElementById('numeroCliente').value;
            
            // Obtener platillos seleccionados con cantidades
            const checkboxes = document.querySelectorAll('.checkbox-platillo:checked');
            const platillosSeleccionados = [];
            let precioTotal = 0;
            
            checkboxes.forEach(checkbox => {
                const id = parseInt(checkbox.getAttribute('data-id'));
                const nombre = checkbox.getAttribute('data-nombre');
                const tipo = checkbox.getAttribute('data-tipo') || '';
                const precio = parseFloat(checkbox.getAttribute('data-precio'));
                const cantidadInput = document.querySelector(`.cantidad-platillo[data-id="${id}"]`);
                const cantidad = cantidadInput ? parseInt(cantidadInput.value) || 1 : 1;
                const subtotal = precio * cantidad;
                
                platillosSeleccionados.push({
                    id: id,
                    tipoNombre: tipo,
                    nombre: nombre,
                    precio: precio,
                    cantidad: cantidad,
                    subtotal: subtotal
                });
                precioTotal += subtotal;
            });
            
            // Validar inventario
            const insumosRegistrados = obtenerInsumosRegistrados();
            const platillos = obtenerPlatillosRegistrados();
            
            for (const platilloSeleccionado of platillosSeleccionados) {
                const platillo = platillos.find(p => p.id === platilloSeleccionado.id);
                if (platillo && platillo.ingredientes) {
                    for (const ingrediente of platillo.ingredientes) {
                        const insumo = insumosRegistrados.find(i => i.id === ingrediente.id);
                        if (!insumo) {
                            alert(`El insumo ${ingrediente.nombre} no existe en el inventario`);
                            return;
                        }
                        const cantidadRequerida = ingrediente.cantidad * platilloSeleccionado.cantidad;
                        if (insumo.cantidad < cantidadRequerida) {
                            alert(`Inventario insuficiente para ${ingrediente.nombre}. Disponible: ${insumo.cantidad} ${insumo.unidad}, Requerido: ${cantidadRequerida} ${ingrediente.unidad}`);
                            return;
                        }
                    }
                }
            }
            
            if (!fechaPedido || !horaPedido || !nombreCliente || !numeroCliente || platillosSeleccionados.length === 0) {
                alert('Por favor complete todos los campos y seleccione al menos un platillo');
                return;
            }
            
            // Aplicar descuento si el total es mayor a $100
            let precioConDescuento = precioTotal;
            let descuentoAplicado = 0;
            if (precioTotal > 100) {
                descuentoAplicado = precioTotal * 0.10;
                precioConDescuento = precioTotal - descuentoAplicado;
            }
            
            datosPedidoTemporal = {
                fecha: fechaPedido,
                hora: horaPedido,
                nombreCliente: nombreCliente,
                numeroCliente: numeroCliente,
                platillos: platillosSeleccionados,
                precioTotal: precioTotal,
                descuento: descuentoAplicado,
                precioFinal: precioConDescuento,
                estado: 'pendiente'
            };
            
            // Mostrar confirmación
            document.querySelector('.codigoClienteConfirmado').textContent = `Código: ${Date.now()}`;
            document.querySelector('.nombreClienteConfirmado').textContent = `Cliente: ${nombreCliente}`;
            document.querySelector('.numeroClienteConfirmado').textContent = `Teléfono: ${numeroCliente}`;
            document.querySelector('.fechaClienteConfirmado').textContent = `Fecha: ${fechaPedido}`;
            document.querySelector('.horaClienteConfirmado').textContent = `Hora: ${horaPedido}`;
            
            const cuerpoTablaConfirmados = document.querySelector('.cuerpoTabla__platillosConfirmados');
            cuerpoTablaConfirmados.innerHTML = '';
            platillosSeleccionados.forEach(platillo => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${platillo.tipoNombre || ''}</td>
                    <td>${platillo.nombre}</td>
                    <td>$${platillo.precio.toFixed(2)}</td>
                    <td>${platillo.cantidad}</td>
                    <td>$${platillo.subtotal.toFixed(2)}</td>
                `;
                cuerpoTablaConfirmados.appendChild(fila);
            });
            
            const totalConfirmado = document.getElementById('totalPedidoConfirmado');
            if (totalConfirmado) {
                if (descuentoAplicado > 0) {
                    totalConfirmado.textContent = `${precioTotal.toFixed(2)} - ${descuentoAplicado.toFixed(2)} (descuento) = ${precioConDescuento.toFixed(2)}`;
                } else {
                    totalConfirmado.textContent = precioConDescuento.toFixed(2);
                }
            }
            
            const confirmacion = document.querySelector('#contenido__registroPedido .confirmacionDatos');
            if (confirmacion) {
                confirmacion.classList.remove('oculto');
            }
        });
    }
    
    if (btnGuardarPedido) {
        btnGuardarPedido.addEventListener('click', () => {
            if (!datosPedidoTemporal) {
                alert('No hay datos de pedido para guardar');
                return;
            }
            
            registrarPedido(datosPedidoTemporal);
            
            // Limpiar campos
            document.getElementById('fechaPedido').value = '';
            document.getElementById('horaPedido').value = '';
            document.getElementById('nombreCliente').value = '';
            document.getElementById('numeroCliente').value = '';
            
            // Limpiar checkboxes
            document.querySelectorAll('.checkbox-platillo').forEach(checkbox => {
                checkbox.checked = false;
            });
            
            // Limpiar contenido de la confirmación para que no quede data vieja
            const codigoConf = document.querySelector('#contenido__registroPedido .codigoClienteConfirmado');
            const nombreConf = document.querySelector('#contenido__registroPedido .nombreClienteConfirmado');
            const numeroConf = document.querySelector('#contenido__registroPedido .numeroClienteConfirmado');
            const fechaConf = document.querySelector('#contenido__registroPedido .fechaClienteConfirmado');
            const horaConf = document.querySelector('#contenido__registroPedido .horaClienteConfirmado');
            const cuerpoConf = document.querySelector('#contenido__registroPedido .cuerpoTabla__platillosConfirmados');
            const totalConf = document.getElementById('totalPedidoConfirmado');
            
            if (codigoConf) codigoConf.textContent = '';
            if (nombreConf) nombreConf.textContent = '';
            if (numeroConf) numeroConf.textContent = '';
            if (fechaConf) fechaConf.textContent = '';
            if (horaConf) horaConf.textContent = '';
            if (cuerpoConf) cuerpoConf.innerHTML = '';
            if (totalConf) totalConf.textContent = '0.00';
            
            const confirmacion = document.querySelector('#contenido__registroPedido .confirmacionDatos');
            if (confirmacion) {
                confirmacion.classList.add('oculto');
            }
            
            datosPedidoTemporal = null;
            mostrarPantalla("contenido__menu");
        });
    }

    // ================== MOSTRAR PEDIDOS ==================
    function cargarPedidosRegistrados() {
        const pedidos = obtenerPedidosRegistrados();
        const contenedorTarjetas = document.getElementById('tarjetasMostrarPedidos');
        const mensajeMostrar = document.getElementById('mensajeMostrarPedidos');
        
        if (!contenedorTarjetas) return;
        
        contenedorTarjetas.innerHTML = '';
        if (mensajeMostrar) mensajeMostrar.textContent = '';
        
        if (pedidos.length === 0) {
            contenedorTarjetas.innerHTML = '<p style="text-align: center; color: #555;">No hay pedidos registrados</p>';
            return;
        }
        
        pedidos.forEach(pedido => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta__pedido';
            
            const estadoClass = pedido.estado === 'pendiente' ? 'estado__pendiente' :
                               pedido.estado === 'en_preparacion' ? 'estado__en_preparacion' :
                               pedido.estado === 'entregado' ? 'estado__entregado' : 'estado__cancelado';
            
            tarjeta.innerHTML = `
                <h3>Pedido ${pedido.numeroPedido || `#${pedido.id}`}</h3>
                <p><span class="info__destacada">Cliente:</span> ${pedido.nombreCliente}</p>
                <p><span class="info__destacada">Teléfono:</span> ${pedido.numeroCliente}</p>
                <p><span class="info__destacada">Fecha:</span> ${pedido.fecha}</p>
                <p><span class="info__destacada">Hora:</span> ${pedido.hora}</p>
                <p><span class="info__destacada">Estado:</span> <span class="estado__badge ${estadoClass}">${pedido.estado}</span></p>
                <p><span class="info__destacada">Total:</span> $${pedido.precioFinal || pedido.precioTotal}</p>
                <button class="btnVer" data-id="${pedido.id}">VER</button>
            `;
            contenedorTarjetas.appendChild(tarjeta);
        });
        
        // Agregar event listeners a los botones VER (scoped to mostrar container)
        document.querySelectorAll('#tarjetasMostrarPedidos .btnVer').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                mostrarModalPedido(id);
            });
        });
    }
    
    function mostrarModalPedido(id) {
        const pedidos = obtenerPedidosRegistrados();
        const pedido = pedidos.find(p => p.id === id);
        
        if (!pedido) return;
        
        const modal = document.getElementById('modalPedido');
        const modalNumero = document.getElementById('modalNumeroPedido');
        const modalFecha = document.getElementById('modalFecha');
        const modalHora = document.getElementById('modalHora');
        const modalCliente = document.getElementById('modalCliente');
        const modalTelefono = document.getElementById('modalTelefono');
        const modalEstado = document.getElementById('modalEstado');
        const modalPlatillos = document.getElementById('modalPlatillos');
        const modalTotal = document.getElementById('modalTotal');
        
        modalNumero.textContent = `Pedido ${pedido.numeroPedido || `#${pedido.id}`}`;
        modalFecha.textContent = pedido.fecha;
        modalHora.textContent = pedido.hora;
        modalCliente.textContent = pedido.nombreCliente;
        modalTelefono.textContent = pedido.numeroCliente;
        
        modalEstado.textContent = pedido.estado;
        modalEstado.className = 'estado__badge ' + (pedido.estado === 'pendiente' ? 'estado__pendiente' :
                                 pedido.estado === 'en_preparacion' ? 'estado__en_preparacion' :
                                 pedido.estado === 'entregado' ? 'estado__entregado' : 'estado__cancelado');
        
        modalPlatillos.innerHTML = '';
        pedido.platillos.forEach(platillo => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${platillo.nombre}</td>
                <td>$${platillo.precio.toFixed(2)}</td>
                <td>${platillo.cantidad}</td>
                <td>$${platillo.subtotal.toFixed(2)}</td>
            `;
            modalPlatillos.appendChild(fila);
        });
        
        const total = pedido.precioFinal || pedido.precioTotal;
        modalTotal.textContent = total.toFixed(2);
        
        if (pedido.descuento && pedido.descuento > 0) {
            modalTotal.innerHTML = `${total.toFixed(2)} (Descuento aplicado: $${pedido.descuento.toFixed(2)})`;
        }
        
        modal.classList.add('active');
    }
    
    // Cerrar modal
    const modalCerrar = document.querySelector('.modal__cerrar');
    const modalPedido = document.getElementById('modalPedido');
    
    if (modalCerrar && modalPedido) {
        modalCerrar.addEventListener('click', () => {
            modalPedido.classList.remove('active');
        });
        
        modalPedido.addEventListener('click', (e) => {
            if (e.target === modalPedido) {
                modalPedido.classList.remove('active');
            }
        });
    }
    
    const btnMostrarPedidos = document.getElementById('btnMostrarPedidos');
    if (btnMostrarPedidos) {
        btnMostrarPedidos.addEventListener('click', () => {
            mostrarPantalla("contenido__mostrarPedidos");
            cargarPedidosRegistrados();
        });
    }

    // ================== ACTUALIZAR PEDIDO ==================
    function cargarTarjetasActualizar() {
        const pedidos = obtenerPedidosRegistrados();
        const contenedorTarjetas = document.getElementById('tarjetasActualizarPedido');
        const mensajeActualizar = document.getElementById('mensajeActualizarPedido');
        
        if (!contenedorTarjetas) return;
        
        contenedorTarjetas.innerHTML = '';
        if (mensajeActualizar) mensajeActualizar.textContent = '';
        
        if (pedidos.length === 0) {
            contenedorTarjetas.innerHTML = '<p style="text-align: center; color: #555;">No hay pedidos registrados</p>';
            return;
        }
        
        pedidos.forEach(pedido => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta__pedido';
            
            const estadoClass = pedido.estado === 'pendiente' ? 'estado__pendiente' :
                               pedido.estado === 'en_preparacion' ? 'estado__en_preparacion' :
                               pedido.estado === 'entregado' ? 'estado__entregado' : 'estado__cancelado';
            
            const esEstadoFinal = pedido.estado === 'entregado' || pedido.estado === 'cancelado';
            
            let formularioHTML = '';
            if (esEstadoFinal) {
                formularioHTML = `
                    <div class="formulario__actualizarTarjeta" id="formularioActualizar-${pedido.id}">
                        <p style="color:#c62828; font-weight:bold; margin:8px 0;">Estado final. No se puede modificar.</p>
                        <select id="nuevoEstado-${pedido.id}" class="listaEstadoPedido" disabled>
                            <option value="${pedido.estado}" selected>${pedido.estado === 'entregado' ? 'Entregado' : 'Cancelado'}</option>
                        </select>
                        <button class="btnVerde btnGuardarActualizar" data-id="${pedido.id}" disabled style="opacity:0.6; cursor:not-allowed;">Guardar</button>
                        <button class="btnRegresar btnCancelarActualizar" data-id="${pedido.id}">Cerrar</button>
                    </div>
                `;
            } else {
                formularioHTML = `
                    <div class="formulario__actualizarTarjeta" id="formularioActualizar-${pedido.id}">
                        <label>Nuevo Estado:</label>
                        <select id="nuevoEstado-${pedido.id}" class="listaEstadoPedido">
                            <option value="pendiente" ${pedido.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                            <option value="en_preparacion" ${pedido.estado === 'en_preparacion' ? 'selected' : ''}>En Preparación</option>
                            <option value="entregado" ${pedido.estado === 'entregado' ? 'selected' : ''}>Entregado</option>
                            <option value="cancelado" ${pedido.estado === 'cancelado' ? 'selected' : ''}>Cancelado</option>
                        </select>
                        <button class="btnVerde btnGuardarActualizar" data-id="${pedido.id}">Guardar</button>
                        <button class="btnRegresar btnCancelarActualizar" data-id="${pedido.id}">Cancelar</button>
                    </div>
                `;
            }
            
            tarjeta.innerHTML = `
                <h3>Pedido ${pedido.numeroPedido || `#${pedido.id}`}</h3>
                <p><span class="info__destacada">Cliente:</span> ${pedido.nombreCliente}</p>
                <p><span class="info__destacada">Estado actual:</span> <span class="estado__badge ${estadoClass}">${pedido.estado}</span></p>
                <p><span class="info__destacada">Total:</span> $${pedido.precioFinal || pedido.precioTotal}</p>
                <button class="btnActualizar" data-id="${pedido.id}" ${esEstadoFinal ? 'disabled style="opacity:0.6; cursor:not-allowed;"' : ''}>Actualizar Estado</button>
                ${formularioHTML}
            `;
            contenedorTarjetas.appendChild(tarjeta);
        });
        
        document.querySelectorAll('#tarjetasActualizarPedido .btnActualizar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const formulario = document.getElementById(`formularioActualizar-${id}`);
                if (formulario) formulario.classList.toggle('active');
            });
        });
        
        document.querySelectorAll('#tarjetasActualizarPedido .btnGuardarActualizar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                const pedidosActuales = obtenerPedidosRegistrados();
                const pedidoActual = pedidosActuales.find(p => p.id === id);
                if (pedidoActual && (pedidoActual.estado === 'entregado' || pedidoActual.estado === 'cancelado')) {
                    if (mensajeActualizar) {
                        mensajeActualizar.textContent = 'No se puede modificar un pedido ya entregado o cancelado';
                        mensajeActualizar.className = 'mensaje error';
                    }
                    return;
                }
                
                const nuevoEstado = document.getElementById(`nuevoEstado-${id}`).value;
                
                if (!nuevoEstado) {
                    if (mensajeActualizar) {
                        mensajeActualizar.textContent = 'Por favor seleccione un estado';
                        mensajeActualizar.className = 'mensaje error';
                    }
                    return;
                }
                
                if (actualizarEstadoPedido(id, nuevoEstado)) {
                    if (mensajeActualizar) {
                        mensajeActualizar.textContent = 'Estado actualizado exitosamente';
                        mensajeActualizar.className = 'mensaje exito';
                    }
                    cargarTarjetasActualizar();
                } else {
                    if (mensajeActualizar) {
                        mensajeActualizar.textContent = 'Error al actualizar el estado';
                        mensajeActualizar.className = 'mensaje error';
                    }
                }
            });
        });
        
        document.querySelectorAll('#tarjetasActualizarPedido .btnCancelarActualizar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const formulario = document.getElementById(`formularioActualizar-${id}`);
                if (formulario) formulario.classList.remove('active');
            });
        });
    }
    
    const btnActualizarPedido = document.getElementById('btnActualizarPedido');
    if (btnActualizarPedido) {
        btnActualizarPedido.addEventListener('click', () => {
            mostrarPantalla("contenido__actualizarPedido");
            cargarTarjetasActualizar();
        });
    }

    // ================== ELIMINAR PEDIDO ==================
    let pedidoEliminarTemporal = null;
    
    function cargarTarjetasEliminar() {
        const pedidos = obtenerPedidosRegistrados();
        const contenedorTarjetas = document.getElementById('tarjetasEliminarPedido');
        const mensajeEliminar = document.getElementById('mensajeEliminarPedido');
        
        if (!contenedorTarjetas) return;
        
        contenedorTarjetas.innerHTML = '';
        if (mensajeEliminar) mensajeEliminar.textContent = '';
        
        if (pedidos.length === 0) {
            contenedorTarjetas.innerHTML = '<p style="text-align: center; color: #555;">No hay pedidos registrados</p>';
            return;
        }
        
        pedidos.forEach(pedido => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta__pedido';
            
            const estadoClass = pedido.estado === 'pendiente' ? 'estado__pendiente' :
                               pedido.estado === 'en_preparacion' ? 'estado__en_preparacion' :
                               pedido.estado === 'entregado' ? 'estado__entregado' : 'estado__cancelado';
            
            tarjeta.innerHTML = `
                <h3>Pedido ${pedido.numeroPedido || `#${pedido.id}`}</h3>
                <p><span class="info__destacada">Cliente:</span> ${pedido.nombreCliente}</p>
                <p><span class="info__destacada">Estado:</span> <span class="estado__badge ${estadoClass}">${pedido.estado}</span></p>
                <p><span class="info__destacada">Total:</span> $${pedido.precioFinal || pedido.precioTotal}</p>
                <button class="btnSeleccionarEliminar" data-id="${pedido.id}">Eliminar</button>
            `;
            contenedorTarjetas.appendChild(tarjeta);
        });
        
        document.querySelectorAll('#tarjetasEliminarPedido .btnSeleccionarEliminar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                const pedido = obtenerPedidosRegistrados().find(p => p.id === id);
                if (pedido) {
                    pedidoEliminarTemporal = pedido;
                    mostrarConfirmacionEliminar(pedido);
                }
            });
        });
    }
    
    function mostrarConfirmacionEliminar(pedido) {
        const contenedorTarjetas = document.getElementById('tarjetasEliminarPedido');
        if (!contenedorTarjetas) return;
        
        const estadoClass = pedido.estado === 'pendiente' ? 'estado__pendiente' :
                           pedido.estado === 'en_preparacion' ? 'estado__en_preparacion' :
                           pedido.estado === 'entregado' ? 'estado__entregado' : 'estado__cancelado';
        
        contenedorTarjetas.innerHTML = `
            <div class="confirmacionDatos">
                <h2>¿Confirmar eliminación?</h2>
                <div class="tarjeta__pedido" style="max-width: 400px; margin: 0 auto;">
                    <h3>Pedido ${pedido.numeroPedido || `#${pedido.id}`}</h3>
                    <p><span class="info__destacada">Cliente:</span> ${pedido.nombreCliente}</p>
                    <p><span class="info__destacada">Estado:</span> <span class="estado__badge ${estadoClass}">${pedido.estado}</span></p>
                    <p><span class="info__destacada">Total:</span> $${pedido.precioFinal || pedido.precioTotal}</p>
                </div>
                <button type="button" id="btnConfirmarEliminarPedido">Confirmar eliminación</button>
                <button type="button" id="btnCancelarEliminarPedido" class="btnRegresar">Cancelar</button>
            </div>
        `;
        
        const btnConfirmar = document.getElementById('btnConfirmarEliminarPedido');
        const btnCancelar = document.getElementById('btnCancelarEliminarPedido');
        const mensajeEliminar = document.getElementById('mensajeEliminarPedido');
        
        if (btnConfirmar) {
            btnConfirmar.addEventListener('click', () => {
                if (pedidoEliminarTemporal) {
                    if (eliminarPedido(pedidoEliminarTemporal.id)) {
                        if (mensajeEliminar) {
                            mensajeEliminar.textContent = 'Pedido eliminado exitosamente';
                            mensajeEliminar.className = 'mensaje exito';
                        }
                        pedidoEliminarTemporal = null;
                        cargarTarjetasEliminar();
                    } else {
                        if (mensajeEliminar) {
                            mensajeEliminar.textContent = 'Error al eliminar el pedido';
                            mensajeEliminar.className = 'mensaje error';
                        }
                    }
                }
            });
        }
        
        if (btnCancelar) {
            btnCancelar.addEventListener('click', () => {
                pedidoEliminarTemporal = null;
                cargarTarjetasEliminar();
            });
        }
    }
    
    const btnEliminarPedido = document.getElementById('btnEliminarPedido');
    if (btnEliminarPedido) {
        btnEliminarPedido.addEventListener('click', () => {
            mostrarPantalla("contenido__eliminarPedido");
            cargarTarjetasEliminar();
        });
    }
    
    // Cargar datos al iniciar
    cargarPlatillosEnTabla();
});
