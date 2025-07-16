// js/checkout.js - Checkout Form Logic

document.addEventListener('DOMContentLoaded', () => {
    const mainHeader = document.getElementById('mainHeader'); // Get header for sticky logic
    const checkoutForm = document.getElementById('checkoutForm');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const addressInput = document.getElementById('address');
    const pincodeInput = document.getElementById('pincode');
    const proceedToThankYouBtn = document.getElementById('proceedToThankYou');

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

    // --- Form Validation Functions ---
    function validateInput(inputElement, errorMessageElement, validationFn, errorMessage) {
        if (!inputElement) return false;

        const isValid = validationFn(inputElement.value.trim());
        if (isValid) {
            errorMessageElement.textContent = '';
            errorMessageElement.classList.remove('show');
        } else {
            errorMessageElement.textContent = errorMessage;
            errorMessageElement.classList.add('show');
        }
        return isValid;
    }

    const validations = {
        fullName: (value) => value.length >= 3 && /^[a-zA-Z\s]+$/.test(value),
        email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        phone: (value) => /^[0-9]{10}$/.test(value), // 10 digits exactly
        address: (value) => value.length >= 10,
        pincode: (value) => /^[0-9]{6}$/.test(value) // 6 digits exactly (for India context)
    };

    const errorMessages = {
        fullName: "Full name must be at least 3 characters and contain only letters and spaces.",
        email: "Please enter a valid email address.",
        phone: "Phone number must be exactly 10 digits.",
        address: "Address must be at least 10 characters long.",
        pincode: "Pincode must be exactly 6 digits."
    };

    function validateAllInputs() {
        let allValid = true;
        allValid = validateInput(fullNameInput, document.getElementById('fullNameError'), validations.fullName, errorMessages.fullName) && allValid;
        allValid = validateInput(emailInput, document.getElementById('emailError'), validations.email, errorMessages.email) && allValid;
        allValid = validateInput(phoneInput, document.getElementById('phoneError'), validations.phone, errorMessages.phone) && allValid;
        allValid = validateInput(addressInput, document.getElementById('addressError'), validations.address, errorMessages.address) && allValid;
        allValid = validateInput(pincodeInput, document.getElementById('pincodeError'), validations.pincode, errorMessages.pincode) && allValid;
        
        proceedToThankYouBtn.disabled = !allValid;
        return allValid;
    }

    // --- Event Listeners for Validation on Input/Blur ---
    fullNameInput.addEventListener('input', () => validateInput(fullNameInput, document.getElementById('fullNameError'), validations.fullName, errorMessages.fullName));
    emailInput.addEventListener('input', () => validateInput(emailInput, document.getElementById('emailError'), validations.email, errorMessages.email));
    phoneInput.addEventListener('input', () => validateInput(phoneInput, document.getElementById('phoneError'), validations.phone, errorMessages.phone));
    addressInput.addEventListener('input', () => validateInput(addressInput, document.getElementById('addressError'), validations.address, errorMessages.address));
    pincodeInput.addEventListener('input', () => validateInput(pincodeInput, document.getElementById('pincodeError'), validations.pincode, errorMessages.pincode));

    // Also validate on blur for immediate feedback
    fullNameInput.addEventListener('blur', validateAllInputs);
    emailInput.addEventListener('blur', validateAllInputs);
    phoneInput.addEventListener('blur', validateAllInputs);
    addressInput.addEventListener('blur', validateAllInputs);
    pincodeInput.addEventListener('blur', validateAllInputs);

    // Initial check on page load to disable button if fields are empty
    validateAllInputs();

    // --- Form Submission Logic ---
    checkoutForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission

        if (validateAllInputs()) {
            const customerInfo = {
                fullName: fullNameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim(),
                address: addressInput.value.trim(),
                pincode: pincodeInput.value.trim()
            };

            // Retrieve the product info stored from product.html
            const checkoutProduct = JSON.parse(localStorage.getItem('checkoutProduct'));

            if (!checkoutProduct) {
                alert("Error: No product selected for checkout. Please go back to select a product.");
                window.location.href = 'index.html'; // Redirect if no product
                return;
            }

            // Combine customer info with product info for the thank you page
            const orderDetails = {
                customer: customerInfo,
                product: checkoutProduct,
                orderDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            };

            localStorage.setItem('orderDetails', JSON.stringify(orderDetails));

            // Clear the temporary checkout product ID to prevent stale data
            localStorage.removeItem('checkoutProductId');
            localStorage.removeItem('checkoutProduct');

            window.location.href = 'thankyou.html';
        } else {
            // Optional: Scroll to first invalid field
            const firstInvalidInput = document.querySelector('.form-group .error-message.show');
            if (firstInvalidInput) {
                firstInvalidInput.parentElement.querySelector('input').focus();
            }
        }
    });

    // Helper to add 'filled' class if input has content on load (e.g., after autofill)
    document.querySelectorAll('.form-group input').forEach(input => {
        if (input.value.trim() !== '') {
            input.classList.add('has-content');
        }
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                input.classList.add('has-content');
            } else {
                input.classList.remove('has-content');
            }
        });
    });
});