
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 2499,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrf6yaiZgsDa9FegjeUpy9jDvM05S00QBK5QwcDzlkjQ&s=10"
    },
    {
        id: 2,
        name: "Smart Watch",
        category: "Electronics",
        price: 3999,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPL2Xq8dKg609sgrVxY3UanNuCfZYszznbUP6UjibCbw&s=10"
    },
    {
        id: 3,
        name: "Running Shoes",
        category: "Fashion",
        price: 2999,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGWLJ83sBnB8Pw3BCO55xl8GJanDjHh6mqa4mRvIdMFQ&s=10"
    },
    {
        id: 4,
        name: "Denim Jacket",
        category: "Fashion",
        price: 1899,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxLBLMCD_NWpnRSkOpfCSzHqyUYg61P2WW-t0UFQAjRQ&s"
    },
    {
        id: 5,
        name: "Table Lamp",
        category: "Home",
        price: 1299,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmeZoxhiZZhy3_db_QnZ4G5scbFXgLhI2WNWut2cwS4Q&s=10"
    },
    {
        id: 6,
        name: "Coffee Mug",
        category: "Home",
        price: 499,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXZc6V-s6SeQi_29obREdrMY8AY1U3VQpD-UFJnBFYGQ&s=10"
    }
];

const CART_KEY = "shopease-cart";


function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || {};
}


function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
}



function addToCart(id) {
    const cart = getCart();

    cart[id] = (cart[id] || 0) + 1;

    saveCart(cart);
    showToast("Product added to cart!");
}


function changeQty(id, delta) {
    const cart = getCart();

    cart[id] = (cart[id] || 0) + delta;

    if (cart[id] <= 0) {
        delete cart[id];
    }

    saveCart(cart);
    renderCart();
}

function cartCount() {
    return Object.values(getCart()).reduce(
        (sum, qty) => sum + qty,
        0
    );
}


function formatPrice(price) {
    return "₹" + price.toLocaleString("en-IN");
}

function updateCartBadge() {
    document.querySelectorAll("[data-cart-count]").forEach(el => {
        el.textContent = cartCount();
    });
}


function showToast(message) {
    let toast = document.getElementById("toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";

        toast.style.cssText =
            "position:fixed;bottom:24px;right:24px;" +
            "background:#0f172a;color:#fff;padding:12px 20px;" +
            "border-radius:8px;box-shadow:0 8px 20px rgba(0,0,0,.2);" +
            "opacity:0;transition:opacity .3s;z-index:999;";

        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = "1";

    clearTimeout(toast._timer);

    toast._timer = setTimeout(() => {
        toast.style.opacity = "0";
    }, 2000);
}


function renderProducts() {
    const grid = document.getElementById("product-grid");

    if (!grid) return;

    const searchInput = document.getElementById("search");
    const categoryInput = document.getElementById("category");

    const term = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const category = categoryInput ? categoryInput.value : "all";

    const filtered = products.filter(product =>
        (category === "all" || product.category === category) &&
        product.name.toLowerCase().includes(term)
    );

    grid.innerHTML = filtered.map(product => `
        <article class="product-card">

            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>

            <div class="product-info">

                <span class="tag">${product.category}</span>

                <h3>${product.name}</h3>

                <p class="price">${formatPrice(product.price)}</p>

                <button class="btn btn-block" data-add="${product.id}">
                    Add to Cart
                </button>

            </div>

        </article>
    `).join("");

    const emptyMsg = document.getElementById("empty-msg");

    if (emptyMsg) {
        emptyMsg.style.display = filtered.length ? "none" : "block";
    }
}


function renderCart() {
    const container = document.getElementById("cart-container");

    if (!container) return;

    const cart = getCart();
    const ids = Object.keys(cart);

    if (ids.length === 0) {
        container.innerHTML = `
            <div class="cart-empty">

                <h3>Your cart is empty</h3>

                <p>Looks like you haven't added anything yet.</p>

                <a href="products.html" class="btn">
                    Browse Products
                </a>

            </div>
        `;

        return;
    }

    let subtotal = 0;
    const rows = ids.map(id => {

        const product = products.find(
            item => item.id === Number(id)
        );

        if (!product) return "";

        const qty = cart[id];

        const lineTotal = product.price * qty;

        subtotal += lineTotal;

        return `
            <div class="cart-item">

                <div class="emoji">
                    <img src="${product.image}" alt="${product.name}">
                </div>

                <div>
                    <h4>${product.name}</h4>

                    <div class="unit">
                        ${formatPrice(product.price)} each
                    </div>
                </div>

                <div class="qty">

                    <button
                        data-qty="${id}"
                        data-delta="-1"
                        aria-label="Decrease quantity">
                        −
                    </button>

                    <span>${qty}</span>

                    <button
                        data-qty="${id}"
                        data-delta="1"
                        aria-label="Increase quantity">
                        +
                    </button>

                </div>

                <div class="line-total">
                    ${formatPrice(lineTotal)}
                </div>

            </div>
        `;
    }).join("");

    const shipping = subtotal >= 2000 ? 0 : 99;

    const total = subtotal + shipping;
    container.innerHTML = `
        <div class="cart-layout">

            <div class="cart-items">
                ${rows}
            </div>

            <aside class="summary">

                <h3>Order Summary</h3>

                <div class="summary-row">
                    <span>Subtotal</span>
                    <span>${formatPrice(subtotal)}</span>
                </div>

                <div class="summary-row">
                    <span>Shipping</span>
                    <span>
                        ${shipping === 0 ? "Free" : formatPrice(shipping)}
                    </span>
                </div>

                <div class="summary-total">
                    <span>Total</span>
                    <span>${formatPrice(total)}</span>
                </div>

                <button class="btn btn-block" onclick="checkout()">
                    Proceed to Checkout
                </button>

            </aside>

        </div>
    `;
}



function checkout() {

    const cart = getCart();

    if (Object.keys(cart).length === 0) {
        showToast("Your cart is empty!");
        return;
    }
    localStorage.removeItem(CART_KEY);
    updateCartBadge();
    showToast("Order placed successfully!");
    setTimeout(() => {
        window.location.href = "index.html";
    }, 2000);

}


function setupContactForm() {
    const form = document.getElementById("contact-form");

    if (!form) return;

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        let valid = true;

        form.querySelectorAll("[data-required]").forEach(input => {

            const group = input.closest(".form-group");

            const value = input.value.trim();

            const isEmail = input.type === "email";

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            const isValid =
                value !== "" &&
                (!isEmail || emailPattern.test(value));

            if (group) {
                group.classList.toggle("invalid", !isValid);
            }

            if (!isValid) {
                valid = false;
            }

        });

        if (valid) {

            const successMsg = document.getElementById("success-msg");

            if (successMsg) {
                successMsg.style.display = "block";
            }

            form.reset();

        }

    });
}

function setupMenu() {
    const toggle = document.getElementById("menu-toggle");

    const links = document.getElementById("nav-links");

    if (!toggle || !links) return;

    toggle.addEventListener("click", () => {
        links.classList.toggle("open");
    });
}



document.addEventListener("DOMContentLoaded", function () {

    updateCartBadge();
    setupMenu();
    setupContactForm();

    const grid = document.getElementById("product-grid");

    if (grid) {

        renderProducts();

        const search = document.getElementById("search");

        const category = document.getElementById("category");

        if (search) {
            search.addEventListener("input", renderProducts);
        }

        if (category) {
            category.addEventListener("change", renderProducts);
        }

        grid.addEventListener("click", function (e) {

            const btn = e.target.closest("[data-add]");

            if (btn) {
                addToCart(Number(btn.dataset.add));
            }

        });

    }


    // CART PAGE
    const cartContainer = document.getElementById("cart-container");

    if (cartContainer) {

        renderCart();

        cartContainer.addEventListener("click", function (e) {

            const btn = e.target.closest("[data-qty]");

            if (btn) {
                changeQty(
                    Number(btn.dataset.qty),
                    Number(btn.dataset.delta)
                );
            }

        });

    }

});
