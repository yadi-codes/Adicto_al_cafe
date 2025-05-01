document.addEventListener("DOMContentLoaded", function () {
    // DOM Elements
    const filterButtons = document.querySelectorAll(".filter-btn");
    const menuItems = document.querySelectorAll(".item");
    const searchInput = document.querySelector(".search-input");
    const cartCounter = document.getElementById("cart-counter");
    const cartBubble = document.getElementById("cart-bubble");
    
    // Initialize cart
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    updateCartDisplay();
    
    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            
            // Filter items
            const category = button.dataset.category;
            filterItems(category);
        });
    });
    
    // Search functionality
    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();
        const activeCategory = document.querySelector(".filter-btn.active").dataset.category;
        
        menuItems.forEach(item => {
            const matchesSearch = item.querySelector("h3").textContent.toLowerCase().includes(searchTerm) || 
                                item.querySelector("p").textContent.toLowerCase().includes(searchTerm);
            const matchesCategory = activeCategory === "all" || item.dataset.category === activeCategory;
            
            item.style.display = matchesSearch && matchesCategory ? "flex" : "none";
        });
    });
    
    // Add to cart functionality
    document.addEventListener("click", function(event) {
        if (event.target.classList.contains("add-to-cart")) {
            const button = event.target;
            const item = {
                name: button.dataset.name,
                price: parseFloat(button.dataset.price),
                image: button.dataset.image || "",
                quantity: 1
            };
            
            addToCart(item);
            showToast(`${item.name} added to order!`);
            provideButtonFeedback(button);
            
            // Update both displays
            updateCartDisplay();
        }
    });
    
    // Listen for storage events to sync across tabs
    window.addEventListener('storage', function(event) {
        if (event.key === 'cart') {
            cart = JSON.parse(event.newValue) || [];
            updateCartDisplay();
        }
    });
    
    // Helper functions
    function filterItems(category) {
        menuItems.forEach(item => {
            const matchesSearch = item.querySelector("h3").textContent.toLowerCase().includes(searchInput.value.toLowerCase()) || 
                                item.querySelector("p").textContent.toLowerCase().includes(searchInput.value.toLowerCase());
            const matchesCategory = category === "all" || item.dataset.category === category;
            
            item.style.display = matchesSearch && matchesCategory ? "flex" : "none";
        });
    }
    
    function addToCart(item) {
        const existingItem = cart.find(cartItem => 
            cartItem.name === item.name && 
            cartItem.price === item.price
        );
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push(item);
        }
        
        localStorage.setItem("cart", JSON.stringify(cart));
        
        // Dispatch event for other tabs
        const cartUpdateEvent = new Event('cartUpdated');
        window.dispatchEvent(cartUpdateEvent);
    }
    
    function updateCartDisplay() {
        // Update counter in menu
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        // Update both the counter and bubble if elements exist
        if (cartCounter) cartCounter.textContent = totalItems;
        if (cartBubble) cartBubble.textContent = totalItems;
        
        // Show/hide bubble based on items
        if (cartBubble) {
            cartBubble.style.display = totalItems > 0 ? "flex" : "none";
        }
    }
    
    function showToast(message) {
        const toast = document.createElement("div");
        toast.className = "toast-message";
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add("show"), 10);
        
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    function provideButtonFeedback(button) {
        const originalText = button.textContent;
        const originalBgColor = button.style.backgroundColor;
        
        button.textContent = "✓ Added";
        button.style.backgroundColor = "#4CAF50";
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = originalBgColor;
        }, 1500);
    }
    
    // Listen for cart updates from other tabs
    window.addEventListener('cartUpdated', function() {
        cart = JSON.parse(localStorage.getItem("cart")) || [];
        updateCartDisplay();
    });
});