const URL_API = 'https://api.themoviedb.org/3';
const URL_BASE_IMAGE = 'https://image.tmdb.org/t/p/original';

let pageActuelle = 1;

// Charger les films tendances sur la page d'accueil
function chargerFilms(page = 1, recherche = '') {
    const url = recherche
        ? `${URL_API}/search/movie?api_key=${CLE_API}&language=fr&query=${recherche}&page=${page}`
        : `${URL_API}/movie/popular?api_key=${CLE_API}&language=fr&page=${page}`;

    fetch(url)
        .then(r => r.json())
        .then(data => {
            if (data.results && data.results.length > 0) afficherFilms(data.results);
            else console.error("Aucun film trouvé.");
        })
        .catch(() => console.error("Erreur lors du chargement des films."));
}

// Afficher les films dans le conteneur
function afficherFilms(films) {
    const conteneur = document.getElementById("movies");
    films.forEach(f => {
        const div = document.createElement("div");
        div.className = "movie";
        div.innerHTML = `
            <img src="${URL_BASE_IMAGE}${f.poster_path}" alt="${f.title}">
            <h2>${f.title}</h2>
            <div id="star-rating">${genererEtoiles(f.vote_average)}</div>
            <p><strong>Date de sortie :</strong> ${f.release_date}</p>
        `;
        div.onclick = () => location.href = `movie.html?id=${f.id}`;
        conteneur.appendChild(div);
    });
}

// Générer les étoiles pour la note
function genererEtoiles(note) {
    const n = Math.round(note / 2);
    return Array.from({ length: 5 }, (_, i) => 
        `<span class="${i < n ? 'filled' : 'empty'}">&#9733;</span>`).join('');
}

// Rechercher des films
document.getElementById('search-input').oninput = () => {
    const recherche = document.getElementById('search-input').value.trim();
    const conteneur = document.getElementById("movies");
    conteneur.innerHTML = "";
    chargerFilms(1, recherche);
};

// Charger plus de films au clic
document.getElementById('load-more').onclick = () => chargerFilms(++pageActuelle);

// Charger les films au démarrage
window.onload = () => {
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark');
    chargerFilms(); // Charger les tendances au début
};

// Basculer le thème
document.getElementById('toggle-theme').onclick = () => {
    const body = document.body, isDark = body.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
};
