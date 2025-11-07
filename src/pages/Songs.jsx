import React, { useState, useEffect } from 'react';

function Songs() {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [cart, setCart] = useState([]);
  const songsPerPage = 10;

  useEffect(() => {
    fetch('/api/songs')
      .then(res => res.json())
      .then(data => {
        setSongs(data);
        setFilteredSongs(data);
      });
    
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    const filtered = songs.filter(song =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSongs(filtered);
    setCurrentPage(1);
  }, [searchQuery, songs]);

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

  const indexOfLastSong = currentPage * songsPerPage;
  const indexOfFirstSong = indexOfLastSong - songsPerPage;
  const currentSongs = filteredSongs.slice(indexOfFirstSong, indexOfLastSong);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="container mt-5">
      <h1>Our Songs</h1>
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search for a song..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
      <div className="list-group">
        {currentSongs.map(song => (
          <div key={song.id} className="list-group-item list-group-item-action flex-column align-items-start">
            <div className="d-flex w-100 justify-content-between">
              <h5 className="mb-1">{song.title}</h5>
              <small>${song.price}</small>
            </div>
            <p className="mb-1">{song.artist}</p>
            <button className="btn btn-primary btn-sm">Preview</button>
            {isInCart(song.id) ? (
              <button className="btn btn-danger btn-sm ms-2" onClick={() => removeFromCart(song.id)}>Remove from Cart</button>
            ) : (
              <button className="btn btn-secondary btn-sm ms-2" onClick={() => addToCart(song)}>Add to Cart</button>
            )}
          </div>
        ))}
      </div>
      <nav className="mt-4">
        <ul className="pagination">
          {Array.from({ length: Math.ceil(filteredSongs.length / songsPerPage) }, (_, i) => (
            <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
              <a onClick={() => paginate(i + 1)} href="#" className="page-link">
                {i + 1}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Songs;
