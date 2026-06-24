document.addEventListener('DOMContentLoaded', function() {
    
    const nombreUsuario = document.getElementById('nombreUsuario');
    const btnSalir = document.getElementById('btnSalir');
    const btnInventario = document.getElementById('btnInventario');
    const btnPlatillos = document.getElementById('btnPlatillos');
    const btnPedidos = document.getElementById('btnPedidos');

    btnSalir.addEventListener('click', ()=>{
        window.location.href = 'login.html';
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


