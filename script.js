const API_KEY = '20bab2c97324603fd34a8ae304533fa1';
const API_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

let currentPage = 1;

async function fetchMovies(page = 1) {
  const url = `${API_URL}/movie/popular?api_key=${API_KEY}&language=fr&page=${page}`;
  
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
        <p><strong>Note moyenne :</strong> ${movie.vote_average}</p>
      </div>
    `;

    moviesContainer.appendChild(movieElement);
  });
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

// Charger initialement les films
fetchMovies(currentPage);
