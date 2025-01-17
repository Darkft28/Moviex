const API_KEY = '20bab2c97324603fd34a8ae304533fa1';
const API_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

let currentPage = 1;

async function fetchMovies(page = 1, query = '') {
    const url = query 
        ? `${API_URL}/search/movie?api_key=${API_KEY}&language=fr&query=${query}&page=${page}`
        : `${API_URL}/movie/popular?api_key=${API_KEY}&language=fr&page=${page}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            displayMovies(data.results);
            currentPage++;
        } else {
            console.error("No movies found or empty results");
        }
    } catch (error) {
        console.error("Error fetching movies:", error);
    }
}

function displayMovies(movies) {
    const moviesContainer = document.getElementById("movies");

    movies.forEach(movie => {
        const movieElement = document.createElement("div");
        movieElement.classList.add("movie");

        // Générer les étoiles
        const starRating = createStarRating(movie.vote_average);

        movieElement.innerHTML = `
            <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
            <div class="info">
                <h2>${movie.title}</h2>
                <p><strong>Date de sortie :</strong> ${movie.release_date}</p>
                <p><strong>Note moyenne :</strong> <span id="star-rating">${starRating}</span></p>
                <p><strong>Description :</strong> ${movie.overview}</p>
            </div>
        `;

        moviesContainer.appendChild(movieElement);
    });
}

function createStarRating(voteAverage) {
    const fullStars = Math.floor(voteAverage / 2);
    const halfStar = voteAverage % 2 !== 0;
    const starRating = [];

    for (let i = 0; i < fullStars; i++) {
        starRating.push('<span class="filled">★</span>');
    }

    if (halfStar) {
        starRating.push('<span class="half">★</span>');
    }

    for (let i = fullStars + (halfStar ? 1 : 0); i < 5; i++) {
        starRating.push('<span class="empty">☆</span>');
    }

    return starRating.join('');
}

// Gérer le bouton "Charger plus de films"
document.getElementById("load-more").addEventListener("click", function () {
    fetchMovies(currentPage);
    this.disabled = true;
    this.innerText = "Chargement...";

    setTimeout(() => {
        this.disabled = false;
        this.innerText = "Charger plus de films";
    }, 2000);
});

// Gérer la recherche
document.getElementById("search-input").addEventListener("input", function () {
    const query = this.value.trim();
    currentPage = 1; // Réinitialiser la page
    document.getElementById("movies").innerHTML = ''; // Réinitialiser les films affichés
    fetchMovies(currentPage, query);
});

// Charger initialement les films
fetchMovies(currentPage);
