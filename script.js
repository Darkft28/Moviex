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

        movieElement.innerHTML = `
            <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
            <div class="info">
                <h2>${movie.title}</h2>
                <p><strong>Date de sortie :</strong> ${movie.release_date}</p>
            </div>
        `;

        movieElement.addEventListener('click', () => {
            window.location.href = `movie.html?id=${movie.id}`;
        });

        moviesContainer.appendChild(movieElement);
    });
}

// Charger les films
fetchMovies(currentPage);

// Gérer la recherche
document.getElementById("search-input").addEventListener("input", function () {
    const query = this.value.trim();
    currentPage = 1;
    document.getElementById("movies").innerHTML = '';
    fetchMovies(currentPage, query);
});

// Bouton "Charger plus de films"
document.getElementById("load-more").addEventListener("click", () => {
    fetchMovies(currentPage);
});
