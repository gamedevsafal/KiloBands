document.addEventListener('DOMContentLoaded', () => {
    const cartItems = document.getElementById('cart-items');
    const checkoutBtn = document.getElementById('checkout-btn');
    const totalPrice = document.getElementById('total-price');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function displayCartItems() {
        if (!cartItems) return;
        cartItems.innerHTML = '';

        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Your cart is empty.</p>';
            if (totalPrice) totalPrice.textContent = 'Total: $0.00';
            return;
        }

        cart.forEach((song, index) => {
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <h3>${song.title}</h3>
                <p>${song.artist}</p>
                <p>$${song.price.toFixed(2)}</p>
                <button class="remove-from-cart-btn" data-index="${index}">Remove</button>
            `;
            cartItems.appendChild(cartItemElement);
        });

        updateTotalPrice();
    }

    function updateTotalPrice() {
        const total = cart.reduce((acc, song) => acc + song.price, 0);
        if (totalPrice) totalPrice.textContent = `Total: $${total.toFixed(2)}`;
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
    }

    function checkout() {
        cart.forEach(song => {
            const link = document.createElement('a');
            link.href = `http://localhost:4000/api/download/${song.filename}`;
            link.download = song.filename;
            link.click();
        });

        localStorage.removeItem('cart');
        cart = [];
        displayCartItems();
        alert('Thank you for your purchase! Your download should start shortly.');
    }

    if (cartItems) {
        cartItems.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-from-cart-btn')) {
                const index = parseInt(e.target.dataset.index);
                removeFromCart(index);
            }
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }

    displayCartItems();
});
