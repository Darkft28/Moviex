// Fonction de bascule de thème
function toggleTheme() {
    document.body.classList.toggle('dark');
    // Sauvegarde du thème dans localStorage
    if (document.body.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}

// Appliquer le thème sauvegardé au chargement de la page
window.addEventListener('load', () => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
});

// Gérer l'icône de changement de thème
const themeButton = document.getElementById('toggle-theme');
themeButton.addEventListener('click', toggleTheme);

// Récupérer les détails du film
const API_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

// Récupérer l'ID du film depuis l'URL
const params = new URLSearchParams(window.location.search);
const movieId = params.get('id');

if (movieId) {
    fetchMovieDetails(movieId);
} else {
    document.getElementById("movie-details").innerHTML = "<p>Aucun film sélectionné.</p>";
}

async function fetchMovieDetails(id) {
    try {
        const response = await fetch(`${API_URL}/movie/${id}?api_key=${CLE_API}&language=fr`);
        const movie = await response.json();
        displayMovieDetails(movie);
    } catch (error) {
        console.error("Erreur lors de la récupération des détails du film :", error);
        document.getElementById("movie-details").innerHTML = "<p>Impossible de charger les détails du film.</p>";
    }
}

function displayMovieDetails(movie) {
    const movieDetails = document.getElementById("movie-details");
    const dvdReleaseDate = new Date(movie.release_date).toLocaleDateString('fr-FR');

    movieDetails.innerHTML = `
        <h1>${movie.title}</h1>
        <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
        <p><strong>Résumé :</strong> ${movie.overview}</p>
        <p><strong>Genre :</strong> ${movie.genres.map(genre => genre.name).join(', ')}</p>
        <p><strong>Note :</strong> ${movie.vote_average} / 10</p>
        <p><strong>Date de sortie en DVD :</strong> ${dvdReleaseDate}</p>
    `;
}
