// js/thankyou.js - Thank You Page Logic

document.addEventListener('DOMContentLoaded', () => {
    const mainHeader = document.getElementById('mainHeader'); // Get header for sticky logic
    const thankYouMessage = document.getElementById('thankYouMessage');
    const summaryProductName = document.getElementById('summaryProductName');
    const summaryProductPrice = document.getElementById('summaryProductPrice');
    const summaryCustomerName = document.getElementById('summaryCustomerName');
    const summaryCustomerEmail = document.getElementById('summaryCustomerEmail');
    const summaryCustomerAddress = document.getElementById('summaryCustomerAddress');
    const summaryCustomerPincode = document.getElementById('summaryCustomerPincode');
    const summaryOrderDate = document.getElementById('summaryOrderDate');

    // --- Sticky Header Logic (repeated as per structure) ---
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

    // --- Load Order Details and Display ---
    const orderDetails = JSON.parse(localStorage.getItem('orderDetails'));

    if (orderDetails && orderDetails.customer && orderDetails.product) {
        // Display personalized thank you message
        thankYouMessage.textContent = `Thank you, ${orderDetails.customer.fullName}! Your order for ${orderDetails.product.name} has been placed.`;

        // Populate order summary
        summaryProductName.textContent = orderDetails.product.name;
        summaryProductPrice.textContent = orderDetails.product.price;
        summaryCustomerName.textContent = orderDetails.customer.fullName;
        summaryCustomerEmail.textContent = orderDetails.customer.email;
        summaryCustomerAddress.textContent = `${orderDetails.customer.address}, Pincode: ${orderDetails.customer.pincode}`;
        summaryCustomerPincode.textContent = orderDetails.customer.pincode; // Redundant but explicit
        summaryOrderDate.textContent = orderDetails.orderDate;

        // --- Confetti Animation ---
        const canvas = document.getElementById('confetti-canvas');
        if (canvas) {
            const myConfetti = confetti.create(canvas, {
                resize: true,
                useWorker: true
            });

            myConfetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#6366f1', '#e2e8f0', '#0f172a', '#1a1a1a'] // Match theme colors
            });
            // Optional: A second burst for more effect
            setTimeout(() => {
                myConfetti({
                    particleCount: 100,
                    spread: 80,
                    origin: { y: 0.8, x: 0.5 },
                    colors: ['#6366f1', '#e2e8f0', '#0f172a']
                });
            }, 500);
        }

        // Clean up localStorage after displaying (optional, depending on desired persistence)
        // localStorage.removeItem('orderDetails');
    } else {
        // Handle case where order details are not found (e.g., user directly navigated here)
        thankYouMessage.textContent = "Thank you for your interest! It seems no recent order details were found.";
        document.querySelector('.order-summary').innerHTML = '<p style="text-align: center;">Please return to the homepage to place an order.</p>';
        document.querySelector('.order-summary').style.border = 'none';
        document.querySelector('.order-summary').style.boxShadow = 'none';
    }
});