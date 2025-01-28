// Creamos una funcion para generar las cards de los productos dentro del index.html

function mostrarProductos(productos) {
    const contenedor = document.getElementById("product-list");
    contenedor.innerHTML = '';
    productos.forEach(producto => {
        const card = document.createElement("div");
        card.className = 'col-md-4 mb-4';
        card.innerHTML = `
            <div class="card h-100">
                <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text"><strong>Precio</strong>: $${producto.precio}</p>
                    <p class="card-text"><strong>Origen:</strong> ${producto.origen}</p>
                    <p class="card-text">${producto.descripcion}</p>
                    <button class="btn btn-success btn-comprar" data-id="${producto.id}" data-nombre="${producto.nombre}" data-precio="${producto.precio}">
                        Comprar
                    </button>
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    });
    agregarEventosBotones();
}

// Función para agregar un producto al carrito

function agregarAlCarrito(producto) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.push(producto);
    localStorage.setItem('carrito', JSON.stringify(carrito));

    actualizarCarrito(carrito.length);

    mostrarNotificacion(`${producto.nombre} añadido al carrito.`);
}

// Con esta funcion mostramos la notificacion de que el producto fue agregado al carrito (Usamos la libreria Toastify)

function mostrarNotificacion(mensaje) {
    Toastify({
        text: mensaje,
        duration: 3000,
        close: true,
        gravity: "bottom",
        position: "right",
        style: {background: "#4CAF50"},
    }).showToast();
}


// Función para manejar los botones "Comprar"

function agregarEventosBotones() {
    const botones = document.querySelectorAll('.btn-comprar');
    botones.forEach(boton => {
        boton.addEventListener('click', (event) => {
            const id = boton.getAttribute('data-id');
            const nombre = boton.getAttribute('data-nombre');
            const precio = parseFloat(boton.getAttribute('data-precio'));

            agregarAlCarrito({ id, nombre, precio });
        });
    });
}

// Función para actualizar el contador del carrito

function actualizarCarrito(cantidad) {
    const badge = document.querySelector('.badge');
    badge.textContent = cantidad;
    localStorage.setItem('cantidadCarrito', cantidad);
}

// Con este evento permitimos que el carrito se actualice en todas las paginas y ademas, no borre su contador al actualizar la pagina

document.addEventListener('DOMContentLoaded', () => {
    const cantidad = localStorage.getItem('cantidadCarrito') || 0;
    actualizarCarrito(parseInt(cantidad));
});

///////////////////////////////// CARRITO ////////////////////////////////////

// Función para mostrar el carrito en carrito.html

function cargarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const listado = document.getElementById('carrito-listado');
    const vacio = document.getElementById('carrito-vacio');
    const total = document.getElementById('carrito-total');

    listado.innerHTML = '';
    let totalCarrito = 0;

    if (carrito.length === 0) {
        vacio.style.display = 'block';
    } else {
        vacio.style.display = 'none';
        carrito.forEach((producto, index) => {
            const item = document.createElement('div');
            item.className = 'list-group-item d-flex justify-content-between align-items-center';
            item.innerHTML = `
                <div>
                    <h5 class="mb-1">${producto.nombre}</h5>
                    <p class="mb-1">Precio: $${producto.precio}</p>
                </div>
                <button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito(${index})">Eliminar</button>
            `;
            listado.appendChild(item);
            totalCarrito += producto.precio;
        });
    }
    total.textContent = totalCarrito.toFixed(2);
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(index) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito(carrito.length);
    cargarCarrito();
}

// Cargamos los productos desde productos.json
fetch('productos.json')
    .then(response => response.json())
    .then(data => mostrarProductos(data))
    .catch(error => console.error('Error al cargar productos:', error));

// Usamos el evento DOMContentLoaded para cargar el carrito en la pagina carrito.html con la funcion anterior
if (window.location.pathname.endsWith('carrito.html')) {
    document.addEventListener('DOMContentLoaded', cargarCarrito);
}

// Ultimo paso, creamos una funcion para vaciar el carrito y mostrar una alerta con SweetAlert2

document.addEventListener('DOMContentLoaded', () => {
    const botonCompra = document.getElementById('hacer-compra');

    if (botonCompra) {
        botonCompra.addEventListener('click', () => {
            localStorage.removeItem('carrito');

            cargarCarrito();
            actualizarCarrito(0);

            Swal.fire({
                title: '¡Compra realizada!',
                text: '¡Los productos fueron comprados con éxito!',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                backdrop: `
                rgba(0,0,123,0.4)
                url("/images/2iFb.gif")
                left top
                no-repeat
            `
            });
        });
    }
});

///////////////////////////////// FORMULARIO ////////////////////////////////////

// Manejar envío del formulario
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');

    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const mensaje = document.getElementById('mensaje').value;

            const formularioData = { nombre, email, mensaje };
            localStorage.setItem('formularioData', JSON.stringify(formularioData));

            Swal.fire({
                title: '¡Formulario Enviado!',
                text: 'Tus datos han sido guardados correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
            form.reset();
        });
    }
});

// Con esta funcion mostramos los datos del formulario en la consola, tambien lo podemos guardar en una DB si quisieramos

function mostrarDatosFormulario() {
    const datos = JSON.parse(localStorage.getItem('formularioData'));
    if (datos) {
        console.log(`Nombre: ${datos.nombre}`);
        console.log(`Email: ${datos.email}`);
        console.log(`Mensaje: ${datos.mensaje}`);
    } else {
        console.log('No hay datos en el formulario.');
    }
}

mostrarDatosFormulario();