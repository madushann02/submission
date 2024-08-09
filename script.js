document.addEventListener('DOMContentLoaded', function() {
    // Navigation menu handling
    var menuIcon = document.getElementById('menu-icon');
    var navList = document.querySelector('.navlist');

    if (menuIcon && navList) {
        // Toggle visibility of navlist on menu icon click
        menuIcon.addEventListener('click', function() {
            navList.classList.toggle('dropdown-menu');
        });

        // Close dropdown if user clicks outside of it
        document.addEventListener('click', function(event) {
            if (!menuIcon.contains(event.target) && !navList.contains(event.target)) {
                navList.classList.remove('dropdown-menu');
            }
        });
    }

    // Add item to cart
    window.addToCart = function() {
        const cartItems = [];
        document.querySelectorAll('#groceryForm input').forEach(input => {
            const value = parseFloat(input.value);
            if (value > 0) {
                const name = input.getAttribute('data-name');
                const price = parseFloat(input.getAttribute('data-price'));
                cartItems.push({ name, quantity: value, price: value * price });
            }
        });

        localStorage.setItem('orderItems', JSON.stringify(cartItems));
        updateCartTable(cartItems);
    };

    // Update cart table
    function updateCartTable(items) {
        const tableBody = document.querySelector('#cartTable tbody');
        const totalPriceElem = document.getElementById('totalPrice');
        if (tableBody && totalPriceElem) {
            tableBody.innerHTML = '';
            let totalPrice = 0;

            items.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.price.toFixed(2)}</td>
                `;
                tableBody.appendChild(row);
                totalPrice += item.price;
            });

            totalPriceElem.textContent = `$${totalPrice.toFixed(2)}`;
        }
    }

    // Navigate to order page
    window.buyNow = function() {
        window.location.href = 'order.html';
    };

    // Add to favourites
    window.addToFavourites = function() {
        const cartItems = JSON.parse(localStorage.getItem('orderItems')) || [];
        localStorage.setItem('favourites', JSON.stringify(cartItems));
    };

    // Apply favourites
    window.applyFavourites = function() {
        const favouriteItems = JSON.parse(localStorage.getItem('favourites')) || [];
        localStorage.setItem('orderItems', JSON.stringify(favouriteItems));
        updateCartTable(favouriteItems);
    };

    // Order Page JavaScript
    if (document.getElementById('paymentForm')) {
        // Display order details
        const orderDetails = document.getElementById('orderDetails');
        const orderItems = JSON.parse(localStorage.getItem('orderItems')) || [];
        if (orderDetails) {
            let html = '<h3>Your Order</h3><ul>';
            orderItems.forEach(item => {
                html += `<li>${item.name}: ${item.quantity} @ $${item.price.toFixed(2)}</li>`;
            });
            html += '</ul>';
            orderDetails.innerHTML = html;
        }

        // Process payment
        window.processPayment = function() {
            const name = document.querySelector('#name').value.trim();
            const contact = document.querySelector('#contact').value.trim();
            const email = document.querySelector('#email').value.trim();
            const address = document.querySelector('#address').value.trim();
            const paymentMethod = document.querySelector('#payment-method').value;

            if (name && contact && email && address && paymentMethod) {
                const deliveryDate = new Date();
                deliveryDate.setDate(deliveryDate.getDate() + 3); // Example: Delivery in 3 days
                alert(`Thank you for your purchase, ${name}! Your order will be delivered by ${deliveryDate.toDateString()}.`);

                // Clear order items
                localStorage.removeItem('orderItems');

                // Redirect to thank you page
                window.location.href = 'thank-you.html';
            } else {
                alert('Please fill in all required fields.');
            }
        };
    }
});
