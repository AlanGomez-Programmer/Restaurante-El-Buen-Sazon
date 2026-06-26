document.addEventListener('DOMContentLoaded', function() {
    // Cargar tema guardado
    cargarTemaGuardado();
    
    // Cargar nombre de usuario desde localStorage
    cargarNombreUsuario();
    
    const btnInventario = document.getElementById('btnInventario');
    const btnPlatillos = document.getElementById('btnPlatillos');
    const btnPedidos = document.getElementById('btnPedidos');
    const btnClientes = document.getElementById('btnCliente');

    btnSalir.addEventListener('click', ()=>{
        localStorage.removeItem('el_buen_sazon_theme');
        window.location.href = 'index.html';
    });

    btnInventario.addEventListener('click', ()=>{
        window.location.href = 'inventario.html';
    });

    btnPlatillos.addEventListener('click', ()=> {
        window.location.href = 'platillos.html'; 
    });

    btnPedidos.addEventListener('click',()=> {
        window.location.href = 'pedidos.html';
    });
    
    btnClientes.addEventListener('click', ()=> {
        window.location.href = 'clientes.html';
    })

});


