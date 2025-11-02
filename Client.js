document.addEventListener('DOMContentLoaded', () => {
    const songList = document.getElementById('song-list');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    let currentPage = 1;
    const songsPerPage = 10;
    let songs = [];

    async function fetchSongs() {
        try {
            const response = await fetch('http://localhost:4000/api/songs');
            songs = await response.json();
            displaySongs();
        } catch (error) {
            console.error('Error fetching songs:', error);
        }
    }

    function displaySongs() {
        if (!songList) return;
        songList.innerHTML = '';
        const startIndex = (currentPage - 1) * songsPerPage;
        const endIndex = startIndex + songsPerPage;
        const paginatedSongs = songs.slice(startIndex, endIndex);

        paginatedSongs.forEach(song => {
            const songElement = document.createElement('div');
            songElement.classList.add('song');
            songElement.innerHTML = `
                <h3>${song.title}</h3>
                <p>${song.artist}</p>
                <a href="http://localhost:4000/api/download/${song.filename}" download>Download</a>
            `;
            songList.appendChild(songElement);
        });

        updatePaginationButtons();
    }

    function updatePaginationButtons() {
        if (prevBtn)
            prevBtn.disabled = currentPage === 1;
        if (nextBtn)
            nextBtn.disabled = currentPage * songsPerPage >= songs.length;
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
            if (currentPage * songsPerPage < songs.length) {
                currentPage++;
                displaySongs();
            }
        });
    }

    if (window.location.pathname.endsWith('songs.html')) {
        fetchSongs();
    }
});
