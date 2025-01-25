// Traigo los elementos del html:
const headerTienda = document.querySelector(".header")
const sectionTienda = document.querySelector(".js_tienda");
const modalCarrito = document.querySelector(".js_modalCarrito");
const iconoCarrito = document.querySelector(".icono-carrito")

let carrito = []; // Array vacio donde se almacenarán los productos que vamos comprando ('Agregar al carrito') => carrito de la compra

/* Función para pintar (SIN EVENTO AUN) un productos de la tienda (crear la card de cada producto con la siguiente estructura, un 'article' por cada producto):
    <figure>
        <img src="" alt="">
    </figure>
    <div class="content">
        <h3></h3>
        <h5></h5>
        <p></p>
        <button class="" data-id="}">Agregar al carrito</button>
    </div>*/

function pintarUnProducto(producto) {
    const article = document.createElement("article");
    const figure = document.createElement("figure");

    const img = document.createElement('img');
    img.src = producto.imagen;
    img.alt = producto.nombre;

    const div = document.createElement('div')
    div.setAttribute("class", "content");

    const h3 = document.createElement('h3');
    h3.textContent = producto.nombre;

    const pDescripcion = document.createElement('h5');
    pDescripcion.textContent = producto.descripcion;

    const pPrecio = document.createElement('p');
    pPrecio.textContent = `Precio: ${producto.precio}€`;

    const btnAgregarProducto = document.createElement("button");
    btnAgregarProducto.textContent = 'Agregar al carrito';
    btnAgregarProducto.setAttribute('data-id', producto.id);
    btnAgregarProducto.classList.add("js_agregar");

    sectionTienda.appendChild(article);

    article.appendChild(figure);
    figure.appendChild(img);
    article.appendChild(div);

    div.appendChild(h3);
    div.appendChild(pDescripcion);
    div.appendChild(pPrecio);
    div.appendChild(btnAgregarProducto);

    return article;
};

// Ahora creo la función para pintar todos los productos en el html (después de que se ejecute la función se pintarán en el html)

function pintarProductos() {
    sectionTienda.innerHTML = "";
    for (const producto of productos) {
        sectionTienda.appendChild(pintarUnProducto(producto));
    }
    document.querySelectorAll(".js_agregar").forEach(btn => btn.addEventListener("click", handleAgregarProducto)); // He seleccionado todos los botones agregar carrito para escuchar el evento click. Tengo que crear la función 'handleAgregarProducto' a continuación:
}

// Función agregar producto al carrito ('handleAgregarProducto'):

function handleAgregarProducto(ev) {
    const idProducto = parseInt(ev.target.getAttribute("data-id"));
    const producto = productos.find(p => p.id === idProducto);
    const productoEnCarrito = carrito.find(p => p.id === idProducto);

    // Verifico si el producto tiene stock para agregarlo al carrito:
    
    if (productoEnCarrito) {
        if (productoEnCarrito.cantidad < producto.stock) {
            productoEnCarrito.cantidad++;
        } else {
            alert("Lo siento, no hay stock suficiente. Pero puedes echar un vistazo a otros productos!")
        }
    } else { // Una vez verificado se añade al carrito ('let carrito')
        carrito.push({ ...producto, cantidad: 1 }) // Utilizo Spread Operator para añadir un elemento
    }

    actualizarCarrito(); // Llamo a la función 'actualizarCarrito' para comprobar el carrito (si hemos añadido a la cesta...)
}

// Función para mostrar el carrito y ver si funciona todo:

function actualizarCarrito() {

    modalCarrito.innerHTML = "";

    const tituloCarrito = document.createElement("h3");
    tituloCarrito.textContent = "CARRITO DE COMPRA";
    modalCarrito.appendChild(tituloCarrito);

    // Aquí irán los productos comprados:
    const listaProductos = document.createElement("ul");
    listaProductos.classList.add("productos-carrito");
    modalCarrito.appendChild(listaProductos);

    let total = 0;

    if (carrito.length === 0) {
        const mensajeVacio = document.createElement("p");
        mensajeVacio.textContent = "Tu carrito está vacío";
        modalCarrito.appendChild(mensajeVacio);
    } else {

        carrito.forEach((producto, index) => {
            const item = document.createElement("li");
            item.classList.add("item-carrito");

            const nombreProducto = document.createElement("span");
            nombreProducto.textContent = producto.nombre;
            item.appendChild(nombreProducto);

            const precioProducto = document.createElement("span");
            precioProducto.textContent = `${producto.precio}€`;
            item.appendChild(precioProducto);


            const cantidadProducto = document.createElement("span");
            cantidadProducto.textContent = `${producto.cantidad}`;

            // Botón para aumentar la cantidad:

            const btnAumentar = document.createElement("button");
            btnAumentar.textContent = "+";

            btnAumentar.addEventListener("click", () => {
                if (producto.cantidad < producto.stock) {
                    producto.cantidad++;
                    actualizarCarrito();
                }
            })

            // Botón para disminuir la cantidad:

            const btnDisminuir = document.createElement("button");
            btnDisminuir.textContent = "-";

            btnDisminuir.addEventListener("click", () => {
                if (producto.cantidad > 1) {
                    producto.cantidad--;
                } else {
                    carrito.splice(index, 1);
                }
                actualizarCarrito();

            });
            item.appendChild(cantidadProducto);
            item.appendChild(btnAumentar);
            item.appendChild(btnDisminuir);

            // Botón para eliminar producto:

            const btnEliminar = document.createElement("button");
            btnEliminar.textContent = "Eliminar";

            btnEliminar.addEventListener("click", () => {
                carrito.splice(index, 1);
                actualizarCarrito();
            });

            item.appendChild(btnEliminar);

            listaProductos.appendChild(item);

            total += producto.precio * producto.cantidad;
        });

        modalCarrito.appendChild(listaProductos);

        // Botón para mostrar el total:

        const totalTotal = document.createElement("p");
        totalTotal.textContent = `TOTAL: ${total}€ `;
        modalCarrito.appendChild(totalTotal);

        // Botones vaciar y pagar:

        const contenedorBotones = document.createElement("li");
        contenedorBotones.classList.add("contenedor-botones");

        modalCarrito.appendChild(contenedorBotones);


        // Botón para vaciar el carrito:

        const btnVaciar = document.createElement("button");
        btnVaciar.textContent = "Vaciar carrito";

        btnVaciar.addEventListener("click", () => {
            carrito.length = 0;
            actualizarCarrito();
        });

        contenedorBotones.appendChild(btnVaciar);


        // Botón para pagar la compra:

        const btnPagar = document.createElement("button");
        btnPagar.textContent = "Pagar";


        btnPagar.addEventListener("click", () => {
            carrito.length = 0;
            actualizarCarrito();

            const mensajePagar = document.createElement("p");
            mensajePagar.textContent = "¡Gracias por tu compra! Pronto recibirás tu pedido ❤️";
            modalCarrito.appendChild(mensajePagar);
            
            console.log("¡Tarea Finalizada!");
        });

        contenedorBotones.appendChild(btnPagar);
    }

    // Evento para mostrar y ocultar el carrito cuando clico en icono del carrito:

    iconoCarrito.addEventListener("click", () => {
        modalCarrito.classList.toggle("oculto");
    });
}

pintarProductos();
actualizarCarrito();
