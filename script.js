// --- Validación de formulario ---
document.querySelector("form").addEventListener("submit", function(e) {
  let valido = true;

  const nombre = document.querySelector("input[name='nombre']").value.trim();
  const email = document.querySelector("input[name='email']").value.trim();
  const mensaje = document.querySelector("textarea[name='mensaje']").value.trim();

  document.getElementById("error-nombre").textContent = "";
  document.getElementById("error-email").textContent = "";
  document.getElementById("error-mensaje").textContent = "";

  if (nombre === "") {
    document.getElementById("error-nombre").textContent = "Por favor ingresa tu nombre.";
    valido = false;
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    document.getElementById("error-email").textContent = "Por favor ingresa un correo válido.";
    valido = false;
  }

  if (mensaje === "") {
    document.getElementById("error-mensaje").textContent = "Por favor escribe un mensaje.";
    valido = false;
  }

  if (!valido) {
    e.preventDefault();
  } else {
    e.preventDefault();
    const form = document.querySelector("form");
    form.innerHTML = "<p style='color:green; font-weight:bold;'>¡Tu mensaje fue enviado con éxito!</p>";
  }
});

// --- Carrito dinámico ---
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function actualizarContador() {
  document.querySelector("#contador-carrito").textContent = carrito.reduce((acc, p) => acc + p.cantidad, 0);
}

function renderCarrito() {
  const lista = document.getElementById("lista-carrito");
  lista.innerHTML = carrito.map(p => `
    <article>
      <span>${p.titulo} (x${p.cantidad}) - $${p.precio * p.cantidad}</span>
      <button onclick="eliminarDelCarrito(${p.id})">Eliminar</button>
    </article>
  `).join("");

  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  document.getElementById("total-carrito").textContent = "Total: $" + total;
}

function agregarAlCarrito(id, titulo, precio) {
  const producto = carrito.find(p => p.id === id);
  if (producto) {
    producto.cantidad++;
  } else {
    carrito.push({ id, titulo, precio, cantidad: 1 });
  }
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();
  renderCarrito();
}

function eliminarDelCarrito(id) {
  carrito = carrito.filter(p => p.id !== id);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();
  renderCarrito();
}

// --- Productos desde dummyjson ---
async function cargarProductos() {
  const res = await fetch("https://dummyjson.com/products/category/fragrances?limit=9");
  const data = await res.json();
  const productos = data.products;

  const contenedor = document.querySelector("#productos-api");
  contenedor.innerHTML = productos.map(p => `
    <article class="card">
      <img src="${p.thumbnail}" alt="${p.title}">
      <h2>${p.title}</h2>
      <p>${p.description.substring(0, 60)}...</p>
      <p class="precio">$${p.price}</p>
      <button onclick="agregarAlCarrito(${p.id}, '${p.title}', ${p.price})">Agregar al carrito 🛒</button>
    </article>
  `).join("");
}

cargarProductos();
actualizarContador();
renderCarrito();
