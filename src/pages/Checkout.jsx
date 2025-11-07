import React, { useState, useEffect } from 'react';

function Checkout() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  const removeFromCart = (songId) => {
    const newCart = cart.filter(item => item.id !== songId);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  const handleCheckout = () => {
    cart.forEach(song => {
      const link = document.createElement('a');
      link.href = `/api/download/${song.filename}`;
      link.download = song.filename;
      link.click();
    });

    localStorage.removeItem('cart');
    setCart([]);
    alert('Thank you for your purchase! Your download should start shortly.');
  };

  return (
    <div className="container mt-5">
      <h1>Checkout</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul className="list-group mb-3">
            {cart.map(item => (
              <li key={item.id} className="list-group-item d-flex justify-content-between lh-condensed">
                <div>
                  <h6 className="my-0">{item.title}</h6>
                  <small className="text-muted">{item.artist}</small>
                </div>
                <span className="text-muted">${item.price}</span>
                <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.id)}>Remove</button>
              </li>
            ))}
            <li className="list-group-item d-flex justify-content-between">
              <span>Total (USD)</span>
              <strong>${getTotalPrice()}</strong>
            </li>
          </ul>
          <button className="btn btn-primary btn-lg btn-block" onClick={handleCheckout}>Checkout</button>
        </div>
      )}
    </div>
  );
}

export default Checkout;
