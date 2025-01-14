const API_KEY = 'ccde63e0';

// Liste des IDs des films que vous voulez afficher
const MOVIE_IDS = ['tt3896198', 'tt1375666', 'tt0468569']; // Exemples : Guardians of the Galaxy 2, Inception, The Dark Knight

async function fetchMovieDetails(id) {
  const url = `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`;

  try {
    const response = await fetch(url);
    const movie = await response.json();

    if (movie.Response === "True") {
      displayMovie(movie);
    } else {
      console.error(`Movie not found: ${id}`);
    }
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }
}

function displayMovie(movie) {
  const moviesContainer = document.getElementById("movies");

  const movieElement = document.createElement("div");
  movieElement.classList.add("movie");

  movieElement.innerHTML = `
    <img src="${movie.Poster}" alt="${movie.Title}">
    <div class="info">
      <h2>${movie.Title}</h2>
      <p><strong>Genre:</strong> ${movie.Genre}</p>
      <p><strong>Actors:</strong> ${movie.Actors}</p>
      <p><strong>Plot:</strong> ${movie.Plot}</p>
      <p><strong>DVD Release:</strong> ${formatDate(movie.DVD)}</p>
      <p><strong>Rating:</strong> ${movie.imdbRating || "N/A"}</p>
    </div>
  `;

  moviesContainer.appendChild(movieElement);
}

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return new Date(dateString).toLocaleDateString("fr-FR", options);
}

// Charger les détails des films au chargement de la page
MOVIE_IDS.forEach(fetchMovieDetails);
