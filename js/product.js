// js/product.js - Product Detail Page Specific Logic

document.addEventListener('DOMContentLoaded', () => {
    const mainHeader = document.getElementById('mainHeader'); // Get header for sticky logic
    const pageTitle = document.getElementById('pageTitle');
    const productNameBreadcrumb = document.getElementById('productNameBreadcrumb');
    const mainProductImage = document.getElementById('mainProductImage');
    const productThumbnails = document.getElementById('productThumbnails');
    const productNameDetail = document.getElementById('productNameDetail');
    const productPrice = document.getElementById('productPrice');
    const productDescription = document.getElementById('productDescription');
    const productSpecsList = document.getElementById('productSpecsList');
    const addToCartBtn = document.getElementById('addToCartBtn');
    const buyNowBtn = document.getElementById('buyNowBtn');

    let currentProduct = null; // Variable to store the loaded product

    // --- Sticky Header Logic (repeated as per structure, adjust if shared logic becomes an option later) ---
    const headerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                mainHeader.classList.add('scrolled');
            } else {
                mainHeader.classList.remove('scrolled');
            }
        });
    }, {
        rootMargin: "-1px 0px 0px 0px",
        threshold: 0
    });

    if (mainHeader) {
        headerObserver.observe(mainHeader);
    }

    // --- Product Loading Logic ---
    function loadProductDetails() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));

        if (isNaN(productId)) {
            displayErrorMessage("Product ID not found or invalid.");
            return;
        }

        currentProduct = products.find(p => p.id === productId);

        if (!currentProduct) {
            displayErrorMessage("Product not found.");
            return;
        }

        // Update basic details
        pageTitle.textContent = `EliteTech - ${currentProduct.name}`;
        productNameBreadcrumb.textContent = currentProduct.name;
        productNameDetail.textContent = currentProduct.name;
        productPrice.textContent = currentProduct.price;
        productDescription.textContent = currentProduct.description || "No description available.";

        // Load main image
        if (currentProduct.images && currentProduct.images.length > 0) {
            mainProductImage.src = currentProduct.images[0];
            mainProductImage.alt = currentProduct.name;
        } else {
            mainProductImage.src = "assets/images/placeholder.jpg"; // Fallback
        }

        // Load thumbnails
        productThumbnails.innerHTML = '';
        if (currentProduct.images && currentProduct.images.length > 0) {
            currentProduct.images.forEach((imagePath, index) => {
                const img = document.createElement('img');
                img.src = imagePath;
                img.alt = `${currentProduct.name} - View ${index + 1}`;
                img.classList.add('thumbnail-image');
                if (index === 0) {
                    img.classList.add('active'); // First image is active by default
                }
                img.addEventListener('click', () => {
                    mainProductImage.src = imagePath; // Change main image
                    // Update active class for thumbnails
                    document.querySelectorAll('.thumbnail-image').forEach(thumb => {
                        thumb.classList.remove('active');
                    });
                    img.classList.add('active');
                });
                productThumbnails.appendChild(img);
            });
        }

        // Load specifications
        productSpecsList.innerHTML = '';
        if (currentProduct.specs) {
            for (const [key, value] of Object.entries(currentProduct.specs)) {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${key}:</strong> ${value}`;
                productSpecsList.appendChild(li);
            }
        }
    }

    function displayErrorMessage(message) {
        const container = document.querySelector('.product-detail-page-content .container');
        if (container) {
            container.innerHTML = `
                <div class="error-state" style="text-align: center; padding: 100px 20px; color: var(--color-platinum);">
                    <h2 style="color: var(--color-electric-indigo-accent);">Oops!</h2>
                    <p style="font-size: 1.2rem;">${message}</p>
                    <p>Please return to the <a href="index.html" style="color: var(--color-electric-indigo-accent); text-decoration: underline;">homepage</a>.</p>
                </div>
            `;
        }
    }

    // --- Add to Cart Logic (Optional) ---
    addToCartBtn.addEventListener('click', () => {
        if (currentProduct) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingItem = cart.find(item => item.id === currentProduct.id);

            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 1) + 1; // Increment quantity
            } else {
                cart.push({
                    id: currentProduct.id,
                    name: currentProduct.name,
                    price: currentProduct.price,
                    image: currentProduct.images[0],
                    quantity: 1
                });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            alert(`${currentProduct.name} added to cart!`);
            // In a real app, you'd show a mini-cart, toast notification, etc.
        }
    });

    // --- Buy Now Logic ---
    buyNowBtn.addEventListener('click', () => {
        if (currentProduct) {
            // Store details of the product being bought directly for the checkout page
            localStorage.setItem('checkoutProduct', JSON.stringify({
                id: currentProduct.id,
                name: currentProduct.name,
                price: currentProduct.price,
                image: currentProduct.images[0] // Only need the first image for checkout summary
            }));
            window.location.href = `checkout.html`;
        }
    });

    // Initial load
    loadProductDetails();
});