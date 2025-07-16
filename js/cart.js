// js/cart.js - Core Shopping Cart Management

(function() { // Self-executing anonymous function to prevent global pollution

    // Helper to get cart from localStorage
    function getCart() {
        const cart = localStorage.getItem('shoppingCart');
        return cart ? JSON.parse(cart) : [];
    }

    // Helper to save cart to localStorage
    function saveCart(cart) {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        updateCartCountDisplay(); // Update UI whenever cart changes
    }

    // Function to add a product to the cart
    function addToCart(product) {
        let cart = getCart();
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        saveCart(cart);
        console.log(`Added ${product.name} to cart.`);
    }

    // Function to remove a product from the cart
    function removeFromCart(productId) {
        let cart = getCart();
        cart = cart.filter(item => item.id !== productId);
        saveCart(cart);
        console.log(`Removed product with ID ${productId} from cart.`);
    }

    // Function to update quantity of a product in the cart
    function updateCartItemQuantity(productId, newQuantity) {
        let cart = getCart();
        const item = cart.find(item => item.id === productId);

        if (item) {
            if (newQuantity <= 0) {
                removeFromCart(productId); // Remove if quantity is 0 or less
            } else {
                item.quantity = newQuantity;
                saveCart(cart);
                console.log(`Updated quantity for product ID ${productId} to ${newQuantity}.`);
            }
        }
    }

    // Function to clear the entire cart
    function clearCart() {
        localStorage.removeItem('shoppingCart');
        updateCartCountDisplay(); // Clear UI display
        console.log('Cart cleared.');
    }

    // Function to update the cart count display in the header
    function updateCartCountDisplay() {
        const cartCountElement = document.getElementById('cartCount');
        if (cartCountElement) {
            const cart = getCart();
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountElement.textContent = totalItems;
        }
    }

    // Initial update when the page loads
    document.addEventListener('DOMContentLoaded', updateCartCountDisplay);

    // Expose functions to the global scope (or use ES modules if preferred)
    window.cart = {
        getCart,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        updateCartCountDisplay // Expose for external calls if needed
    };

})(); // End of self-executing function