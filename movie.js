// Basculer le thème
function basculerTheme() {
    const body = document.body;
    const isDark = body.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Appliquer le thème sauvegardé
window.onload = () => {
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark');
    chargerDetailsFilm();
};

// Changer le thème avec le bouton
document.getElementById('toggle-theme').onclick = basculerTheme;

// Charger les détails d’un film
function chargerDetailsFilm() {
    const id = new URLSearchParams(location.search).get('id');
    const details = document.getElementById("movie-details");
    if (!id) return details.innerHTML = "Aucun film sélectionné.";

    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${CLE_API}&language=fr&append_to_response=credits`)
        .then(r => r.json())
        .then(film => {
            const genres = film.genres.map(g => g.name).join(', ');
            const acteurs = film.credits.cast.slice(0, 5).map(a => a.name).join(', '); // Limiter aux 5 premiers acteurs
            const posterURL = `https://image.tmdb.org/t/p/original${film.poster_path}`;

            const resume = film.overview || "Aucun résumé disponible."; // Gestion du résumé

            details.innerHTML = `
                <h1>${film.title}</h1>
                <img src="${posterURL}" alt="${film.title}">
                <p><strong>Résumé :</strong> ${resume}</p> <!-- Affichage du résumé -->
                <p><strong>Date de sortie :</strong> ${film.release_date}</p>
                <p><strong>Genres :</strong> ${genres}</p>
                <p><strong>Acteurs :</strong> ${acteurs}</p>
            `;
        })
        .catch(() => details.innerHTML = "Impossible de charger les détails du film.");
}
