document.addEventListener('DOMContentLoaded', function() {
    // Cargar tema guardado
    cargarTemaGuardado();
    
    // Cargar nombre de usuario desde localStorage
    cargarNombreUsuario();
    
    const nombreUsuario = document.getElementById('nombreUsuario');
    const btnSalir = document.getElementById('btnSalir');
    const btnInventario = document.getElementById('btnInventario');
    const btnPlatillos = document.getElementById('btnPlatillos');
    const btnPedidos = document.getElementById('btnPedidos');

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
    })


});


