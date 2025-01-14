const API_KEY = 'ccde63e0';

async function searchMoviesByYear(year) {
  const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=movie&y=${year}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "True") {
      displayMovies(data.Search);
    } else {
      console.error("No movies found:", data.Error);
    }
  } catch (error) {
    console.error("Error fetching movies by year:", error);
  }
}

function displayMovies(movies) {
  const moviesContainer = document.getElementById("movies");
  moviesContainer.innerHTML = ""; // Clear any previous content

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

// Rechercher les films sortis en 2024
searchMoviesByYear(2024);
