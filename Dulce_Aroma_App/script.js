// CATÁLOGO DE PRODUCTOS DE DEMOSTRACIÓN
const products = [
  { id: 1, name: "Café americano", category: "Cafés", price: 35, emoji: "☕", description: "Café clásico recién preparado." },
  { id: 2, name: "Capuchino", category: "Cafés", price: 48, emoji: "🥛", description: "Café con leche espumosa." },
  { id: 3, name: "Latte", category: "Cafés", price: 52, emoji: "☕", description: "Café suave con leche cremosa." },
  { id: 4, name: "Pastel de chocolate", category: "Pasteles", price: 65, emoji: "🍰", description: "Pastel suave con sabor a chocolate." },
  { id: 5, name: "Cheesecake", category: "Pasteles", price: 58, emoji: "🍰", description: "Postre cremoso de queso." },
  { id: 6, name: "Brownie", category: "Postres", price: 38, emoji: "🍫", description: "Brownie de chocolate." },
  { id: 7, name: "Galletas artesanales", category: "Postres", price: 25, emoji: "🍪", description: "Galletas ideales para acompañar tu café." },
  { id: 8, name: "Cupcake", category: "Postres", price: 32, emoji: "🧁", description: "Panquecito decorado." }
];

let cart = [];
let selectedCategory = "Todos";

const productGrid = document.getElementById("product-grid");
const cartDrawer = document.getElementById("cart-drawer");
const cartOverlay = document.getElementById("cart-overlay");

// NAVEGACIÓN ENTRE SECCIONES
function showPage(pageName) {
  document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
  const page = document.getElementById(`page-${pageName}`);
  if (page) page.classList.add("active");

  document.querySelectorAll(".nav-link").forEach(button => {
    button.classList.toggle("active", button.dataset.page === pageName);
  });

  const titles = {
    inicio: ["BIENVENIDO A DULCE AROMA", "Un momento para disfrutar"],
    especialidades: ["DESCUBRE NUESTROS SABORES", "Nuestras especialidades"],
    menu: ["PREPARADOS PARA TI", "Nuestro menú"],
    nosotros: ["CONÓCENOS", "Nuestra historia"],
    contacto: ["ESTAMOS PARA ATENDERTE", "Hablemos"]
  };
  document.getElementById("page-eyebrow").textContent = titles[pageName][0];
  document.getElementById("page-title").textContent = titles[pageName][1];
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("[data-page]").forEach(button => {
  button.addEventListener("click", () => showPage(button.dataset.page));
});
document.querySelectorAll("[data-go]").forEach(button => {
  button.addEventListener("click", () => showPage(button.dataset.go));
});

// MOSTRAR Y FILTRAR PRODUCTOS
function renderProducts() {
  const search = document.getElementById("product-search").value.trim().toLowerCase();
  const visibleProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(search);
    return matchesCategory && matchesSearch;
  });

  productGrid.innerHTML = visibleProducts.length ? visibleProducts.map(product => `
    <article class="product-card">
      <div class="product-image">${product.emoji}</div>
      <div class="product-info">
        <span class="product-category">${product.category.toUpperCase()}</span>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-bottom">
          <span class="product-price">${formatMoney(product.price)}</span>
          <button class="add-button" data-add="${product.id}">+ Agregar</button>
        </div>
      </div>
    </article>
  `).join("") : `<p>No se encontraron productos con esa búsqueda.</p>`;

  document.querySelectorAll("[data-add]").forEach(button => {
    button.addEventListener("click", () => addToCart(Number(button.dataset.add)));
  });
}

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    selectedCategory = button.dataset.category;
    document.querySelectorAll(".filter").forEach(filter => filter.classList.remove("active"));
    button.classList.add("active");
    renderProducts();
  });
});
document.getElementById("product-search").addEventListener("input", renderProducts);

// CARRITO DE COMPRAS
function formatMoney(value) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(value);
}
function addToCart(productId) {
  const product = products.find(item => item.id === productId);
  if (product) {
    cart.push(product);
    renderCart();
    openCart();
  }
}
function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}
function renderCart() {
  document.getElementById("cart-count").textContent = cart.length;
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  document.getElementById("cart-total").textContent = formatMoney(total);
  document.getElementById("review-order").disabled = cart.length === 0;

  const cartItems = document.getElementById("cart-items");
  if (!cart.length) {
    cartItems.innerHTML = `<div class="empty-cart"><span>🛍️</span><h3>Tu carrito está vacío</h3><p>Agrega algo delicioso desde nuestro menú.</p></div>`;
    return;
  }
  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-line">
      <div class="cart-line-emoji">${item.emoji}</div>
      <div class="cart-line-info"><strong>${item.name}</strong><small>${formatMoney(item.price)}</small></div>
      <button class="remove-item" data-remove="${index}">Eliminar</button>
    </div>
  `).join("");
  document.querySelectorAll("[data-remove]").forEach(button => {
    button.addEventListener("click", () => removeFromCart(Number(button.dataset.remove)));
  });
}
function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("show");
}
function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("show");
}
document.getElementById("open-cart").addEventListener("click", openCart);
document.getElementById("close-cart").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

// TICKET / REVISIÓN DEL PEDIDO
document.getElementById("review-order").addEventListener("click", () => {
  if (!cart.length) return;
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  document.getElementById("ticket-date").textContent = new Date().toLocaleString("es-MX");
  document.getElementById("ticket-lines").innerHTML = cart.map(item => `
    <div class="ticket-row"><span>${item.name}</span><strong>${formatMoney(item.price)}</strong></div>
  `).join("");
  document.getElementById("ticket-total").textContent = formatMoney(total);
  document.getElementById("ticket-modal").classList.add("show");
});
function closeTicket() {
  document.getElementById("ticket-modal").classList.remove("show");
}
document.getElementById("close-ticket").addEventListener("click", closeTicket);
document.getElementById("ticket-modal").addEventListener("click", event => {
  if (event.target.id === "ticket-modal") closeTicket();
});
document.getElementById("finish-order").addEventListener("click", () => {
  alert("Este es un pedido de demostración. No se realizó ningún cobro.");
  cart = [];
  renderCart();
  closeTicket();
  closeCart();
  showPage("inicio");
});

// CHATBOT BÁSICO DE DEMOSTRACIÓN
const chatWidget = document.getElementById("chat-widget");
const chatMessages = document.getElementById("chat-messages");
function openChat() { chatWidget.classList.add("open"); }
function closeChat() { chatWidget.classList.remove("open"); }
document.getElementById("chat-launcher").addEventListener("click", openChat);
document.getElementById("close-chat").addEventListener("click", closeChat);
document.getElementById("open-chat-contact").addEventListener("click", openChat);

function addChatMessage(message, type) {
  const bubble = document.createElement("div");
  bubble.className = type === "user" ? "user-message" : "bot-message";
  bubble.textContent = message;
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
function getBotAnswer(message) {
  const text = message.toLowerCase();
  if (text.includes("precio") || text.includes("cuesta") || text.includes("costo")) {
    return "Puedes consultar los precios de cada producto en la sección «Nuestro menú».";
  }
  if (text.includes("horario") || text.includes("abren") || text.includes("cierran")) {
    return "El horario de esta demostración es de 9:00 a.m. a 8:00 p.m. Puedes modificarlo por el horario real de tu negocio.";
  }
  if (text.includes("pedido") || text.includes("carrito") || text.includes("comprar")) {
    return "Agrega los productos desde «Nuestro menú». Después abre «Mi pedido» para revisar tu ticket.";
  }
  if (text.includes("ubicación") || text.includes("direccion") || text.includes("dónde")) {
    return "Puedes consultar nuestra dirección en la sección «Contacto». Recuerda completar ahí los datos reales.";
  }
  if (text.includes("hola") || text.includes("buenos")) {
    return "¡Hola! Qué gusto saludarte. ¿Te gustaría conocer nuestro menú o consultar sobre un pedido?";
  }
  return "¡Gracias por escribir a Dulce Aroma! Puedes consultar nuestro menú, especialidades y datos de contacto desde el menú principal.";
}
document.getElementById("chat-form").addEventListener("submit", event => {
  event.preventDefault();
  const input = document.getElementById("chat-input");
  const message = input.value.trim();
  if (!message) return;
  addChatMessage(message, "user");
  input.value = "";
  setTimeout(() => addChatMessage(getBotAnswer(message), "bot"), 350);
});

// INICIALIZACIÓN
renderProducts();
renderCart();
