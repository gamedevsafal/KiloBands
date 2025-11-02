document.addEventListener('DOMContentLoaded', () => {
    const songList = document.getElementById('song-list');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const audioPlayer = document.getElementById('audio-player');
    const contactForm = document.getElementById('contact-form');
    const featuredSongs = document.getElementById('featured-songs');
    const searchBar = document.getElementById('search-bar');

    let currentPage = 1;
    const songsPerPage = 10;
    let songs = [];
    let filteredSongs = [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    async function fetchSongs() {
        try {
            const response = await fetch('http://localhost:4000/api/songs');
            songs = await response.json();
            filteredSongs = songs;
            if (window.location.pathname.endsWith('songs.html')) {
                displaySongs();
            }
            if (window.location.pathname.endsWith('Home.html')) {
                displayFeaturedSongs();
            }
        } catch (error) {
            console.error('Error fetching songs:', error);
        }
    }

    function displaySongs() {
        if (!songList) return;
        songList.innerHTML = '';
        const startIndex = (currentPage - 1) * songsPerPage;
        const endIndex = startIndex + songsPerPage;
        const paginatedSongs = filteredSongs.slice(startIndex, endIndex);

        paginatedSongs.forEach(song => {
            const songElement = document.createElement('div');
            songElement.classList.add('song');
            songElement.innerHTML = `
                <h3>${song.title}</h3>
                <p>${song.artist}</p>
                <button class="preview-btn" data-filename="${song.filename}">Preview</button>
                <button class="add-to-cart-btn" data-song='${JSON.stringify(song)}'>Add to Cart</button>
            `;
            songList.appendChild(songElement);
        });

        updatePaginationButtons();
    }

    function displayFeaturedSongs() {
        if (!featuredSongs) return;
        featuredSongs.innerHTML = '';
        const featured = songs.slice(0, 3);

        featured.forEach(song => {
            const songElement = document.createElement('div');
            songElement.classList.add('song');
            songElement.innerHTML = `
                <h3>${song.title}</h3>
                <p>${song.artist}</p>
                <button class="preview-btn" data-filename="${song.filename}">Preview</button>
                <button class="add-to-cart-btn" data-song='${JSON.stringify(song)}'>Add to Cart</button>
            `;
            featuredSongs.appendChild(songElement);
        });
    }

    function updatePaginationButtons() {
        if (prevBtn)
            prevBtn.disabled = currentPage === 1;
        if (nextBtn)
            nextBtn.disabled = currentPage * songsPerPage >= filteredSongs.length;
    }

    function addToCart(song) {
        cart.push(song);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${song.title} has been added to your cart.`);
    }

    if (songList || featuredSongs) {
        const container = songList || featuredSongs;
        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('preview-btn')) {
                const filename = e.target.dataset.filename;
                if (audioPlayer) {
                    audioPlayer.src = `http://localhost:4000/api/music/${filename}`;
                    audioPlayer.play();
                } else {
                    const audio = new Audio(`http://localhost:4000/api/music/${filename}`);
                    audio.play();
                }
            }

            if (e.target.classList.contains('add-to-cart-btn')) {
                const song = JSON.parse(e.target.dataset.song);
                addToCart(song);
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displaySongs();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentPage * songsPerPage < filteredSongs.length) {
                currentPage++;
                displaySongs();
            }
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message!');
            contactForm.reset();
        });
    }

    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            const searchQuery = e.target.value.toLowerCase();
            filteredSongs = songs.filter(song => 
                song.title.toLowerCase().includes(searchQuery) || 
                song.artist.toLowerCase().includes(searchQuery)
            );
            currentPage = 1;
            displaySongs();
        });
    }

    fetchSongs();
});
