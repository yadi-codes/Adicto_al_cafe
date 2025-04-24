document.addEventListener("DOMContentLoaded", function () {
    // Filtering Menu Items
    const filterButtons = document.querySelectorAll(".filter-btn");
    const menuItems = document.querySelectorAll(".item");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const category = button.getAttribute("data-category");

            menuItems.forEach(item => {
                item.style.display = category === "all" || item.getAttribute("data-category") === category ? "block" : "none";
            });
        });
    });

    // Shopping Cart Handling
    const cartCounter = document.getElementById("cart-counter"); // For item count
    const cartTotal = document.getElementById("cart-total"); // For total price
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function updateCart() {
        let totalItems = cart.length;
        let totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

        if (cartCounter) cartCounter.textContent = totalItems;
        if (cartTotal) cartTotal.textContent = `₹${totalPrice.toFixed(2)}`; // Assuming INR currency
    }

    updateCart(); // Update cart values on page load

    document.body.addEventListener("click", function (event) {
        if (event.target.classList.contains("add-to-cart")) {
            const name = event.target.getAttribute("data-name");
            const price = parseFloat(event.target.getAttribute("data-price"));

            cart.push({ name, price });
            localStorage.setItem("cart", JSON.stringify(cart));

            updateCart(); // Update cart display
            showToast(`${name} added to cart!`);
        }
    });

    // Toast Notification
    function showToast(message) {
        let toast = document.createElement("div");
        toast.textContent = message;
        toast.className = "toast-message";
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = "1";
        }, 100); // Small delay to ensure visibility

        setTimeout(() => {
            toast.style.opacity = "0";
            setTimeout(() => toast.remove(), 500);
        }, 2000);
    }
});

