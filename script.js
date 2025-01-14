const API_KEY = 'ccde63e0';

let currentPage = 1;
const MOVIE_IDS = ['tt3896198', 'tt1375666', 'tt0468569']; // Liste initiale des films

async function fetchMovies(page = 1) {
  // Simulation de récupération des films pour une page spécifique
  const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=movie&page=${page}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "True") {
      displayMovies(data.Search);
      currentPage++;
    } else {
      console.error("No movies found:", data.Error);
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
      <img src="${movie.Poster}" alt="${movie.Title}">
      <div class="info">
        <h2>${movie.Title}</h2>
        <p><strong>Year:</strong> ${movie.Year}</p>
        <p><strong>Type:</strong> ${movie.Type}</p>
      </div>
    `;

    moviesContainer.appendChild(movieElement);
  });
}

// Fonction pour gérer l'événement du bouton "Charger plus de films"
document.getElementById("load-more").addEventListener("click", function() {
  fetchMovies(currentPage);
  this.disabled = true;  // Désactive le bouton lors du chargement
  this.innerText = "Chargement..."; // Texte du bouton pendant le chargement
  
  // Réactive le bouton après un délai simulé
  setTimeout(() => {
    this.disabled = false;
    this.innerText = "Charger plus de films";
  }, 2000); // 2 secondes d'attente avant de pouvoir cliquer à nouveau
});

// Charger initialement les films lors du chargement de la page
fetchMovies(currentPage);
