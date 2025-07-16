// js/index.js - Home Page Specific Logic (including global elements for this page)

document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    const mainHeader = document.getElementById('mainHeader');
    const productGrid = document.getElementById('productGrid');

    // --- Preloader Logic (for initial page load) ---
    // Hide preloader after a delay
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('hidden');
            // Remove preloader from DOM after transition to avoid interference
            preloader.addEventListener('transitionend', () => {
                preloader.remove();
            }, { once: true });
        }
    }, 3000); // 3 seconds for the logo animation and fading out

    // --- Sticky Header Logic ---
    // This exact logic will need to be repeated in product.js, checkout.js, and thankyou.js
    // as there is no shared app.js file.
    const headerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                // Header is no longer at the top (i.e., scrolled past)
                mainHeader.classList.add('scrolled');
            } else {
                // Header is at the top of the viewport
                mainHeader.classList.remove('scrolled');
            }
        });
    }, {
        rootMargin: "-1px 0px 0px 0px", // Trigger 1px before header leaves top
        threshold: 0 // As soon as header starts leaving
    });

    if (mainHeader) {
        headerObserver.observe(mainHeader);
    }

    // --- Product Loading Logic ---
    function loadProducts() {
        if (!products || products.length === 0) {
            productGrid.innerHTML = '<p class="no-products-message">No products available at the moment. Please check back later!</p>';
            return;
        }

        productGrid.innerHTML = ''; // Clear any existing content

        products.forEach((product, index) => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            // Add AOS animation attributes
            productCard.setAttribute('data-aos', 'fade-up');
            productCard.setAttribute('data-aos-delay', `${index * 100}`); // Stagger animation

            productCard.innerHTML = `
                <img src="${product.images[0]}" alt="${product.name}" class="product-card-image">
                <h3>${product.name}</h3>
                <p class="price">${product.price}</p>
                <div class="product-card-actions">
                    <a href="product.html?id=${product.id}" class="btn btn-secondary">View Details</a>
                    <button class="btn btn-primary buy-now-btn" data-product-id="${product.id}">Buy Now</button>
                </div>
            `;
            productGrid.appendChild(productCard);
        });

        // Attach event listeners to "Buy Now" buttons after they are rendered
        document.querySelectorAll('.buy-now-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.dataset.productId;
                // Store selected product ID in localStorage for checkout
                localStorage.setItem('checkoutProductId', productId);
                window.location.href = `checkout.html`; // Redirect to checkout page
            });
        });
    }

    // Call loadProducts when the DOM is ready
    loadProducts();
});