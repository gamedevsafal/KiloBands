import React, { useState, useEffect } from 'react';

function Home() {
  const [featuredSongs, setFeaturedSongs] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch('/api/songs')
      .then(res => res.json())
      .then(songs => setFeaturedSongs(songs.slice(0, 3)));
    
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  const addToCart = (song) => {
    const newCart = [...cart, song];
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeFromCart = (songId) => {
    const newCart = cart.filter(item => item.id !== songId);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const isInCart = (songId) => {
    return cart.some(item => item.id === songId);
  };

  return (
    <div>
      <header className="hero bg-dark text-white text-center py-5">
        <div className="container">
          <h1 className="display-4">Welcome to KiloBands</h1>
          <p className="lead">Your one-stop shop for the best music.</p>
          <a href="/songs" className="btn btn-primary btn-lg">Browse Songs</a>
        </div>
      </header>
      <div className="container mt-5">
        <h2>Featured Songs</h2>
        <div className="row">
          {featuredSongs.map(song => (
            <div className="col-md-4" key={song.id}>
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{song.title}</h5>
                  <p className="card-text">{song.artist}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="btn-group">
                      <button type="button" className="btn btn-sm btn-outline-secondary">Preview</button>
                      {isInCart(song.id) ? (
                        <button type="button" className="btn btn-sm btn-danger" onClick={() => removeFromCart(song.id)}>Remove from Cart</button>
                      ) : (
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => addToCart(song)}>Add to Cart</button>
                      )}
                    </div>
                    <small className="text-muted">{song.price}</small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
