const CLE_API = '20bab2c97324603fd34a8ae304533fa1'; // Clé API pour accéder au service
const URL_API = 'https://api.themoviedb.org/3'; // URL de base de l'API
const URL_BASE_IMAGE = 'https://image.tmdb.org/t/p/original'; // URL de base pour les images

let pageActuelle = 1; // Numéro de la page actuelle des résultats

// Fonction pour récupérer les films
async function recupererFilms(page = 1, recherche = '') {
    const url = recherche 
        ? `${URL_API}/search/movie?api_key=${CLE_API}&language=fr&query=${recherche}&page=${page}`
        : `${URL_API}/movie/popular?api_key=${CLE_API}&language=fr&page=${page}`;

    try {
        const reponse = await fetch(url); // Envoi de la requête à l'API
        const donnees = await reponse.json(); // Conversion de la réponse en JSON

        if (donnees.results && donnees.results.length > 0) {
            afficherFilms(donnees.results); // Afficher les films si des résultats sont disponibles
            pageActuelle++;
        } else {
            console.error("Aucun film trouvé ou résultats vides");
        }
    } catch (erreur) {
        console.error("Erreur lors de la récupération des films :", erreur);
    }
}

// Fonction pour afficher les films sur la page
function afficherFilms(films) {
    const conteneurFilms = document.getElementById("movies");
    
    films.forEach(film => {
        const filmElement = document.createElement("div");
        filmElement.classList.add("movie");
        
        filmElement.innerHTML = `
            <img src="${URL_BASE_IMAGE}${film.poster_path}" alt="${film.title}">
            <h2>${film.title}</h2>
            <div id="star-rating">
                ${afficherEtoiles(film.vote_average)}
            </div>
            <p><strong>Date de sortie :</strong> ${film.release_date}</p>
        `;

        // Ajouter un gestionnaire de clic pour rediriger vers les détails du film
        filmElement.addEventListener("click", () => {
            window.location.href = `movie.html?id=${film.id}`;
        });

        conteneurFilms.appendChild(filmElement); // Ajoute chaque film à la section des films
    });
}

// Fonction pour afficher les étoiles en fonction de la note
function afficherEtoiles(note) {
    const etoiles = [];
    const noteArrondie = Math.round(note / 2);
    for (let i = 1; i <= 5; i++) {
        if (i <= noteArrondie) {
            etoiles.push('<span class="filled">&#9733;</span>');
        } else {
            etoiles.push('<span class="empty">&#9733;</span>');
        }
    }
    return etoiles.join('');
}

// Fonction de recherche de films en temps réel
function rechercherFilms() {
    const inputRecherche = document.getElementById("search-input").value.trim();
    if (inputRecherche === "") {
        // Si la recherche est vide, ne rien afficher
        const conteneurFilms = document.getElementById("movies");
        conteneurFilms.innerHTML = '';
        return;
    }
    
    pageActuelle = 1; // Réinitialise la page des résultats
    const conteneurFilms = document.getElementById("movies");
    conteneurFilms.innerHTML = ''; // Vide le conteneur des films avant de charger les nouveaux résultats
    recupererFilms(pageActuelle, inputRecherche); // Récupère les films avec le terme de recherche
}

// Ajoute un écouteur d'événements pour l'événement 'input' (chaque modification dans le champ)
document.getElementById('search-input').addEventListener('input', rechercherFilms);

// Fonction pour charger plus de films
document.getElementById('load-more').addEventListener('click', () => {
    recupererFilms(pageActuelle);
});

// Fonction de bascule de thème
function basculerTheme() {
    document.body.classList.toggle('dark'); // Bascule entre les thèmes
    // Sauvegarde du thème choisi dans localStorage
    if (document.body.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}

// Vérifie et applique le thème stocké dans localStorage au chargement de la page
window.addEventListener('load', () => {
    const themeEnregistre = localStorage.getItem('theme');
    if (themeEnregistre === 'dark') {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
});

document.getElementById("toggle-theme").addEventListener("click", basculerTheme);

// Récupérer les films au chargement de la page
recupererFilms(pageActuelle);

// Code pour gérer les détails des films sur `details.html`

// Fonction pour récupérer un paramètre de l'URL
function obtenirParametreURL(parametre) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parametre);
}

// Fonction pour récupérer les détails d'un film via l'API
async function recupererDetailsFilm() {
    const filmId = obtenirParametreURL("id"); // Récupère l'ID depuis l'URL
    if (!filmId) {
        console.error("Aucun ID de film trouvé dans l'URL.");
        return;
    }

    const url = `${URL_API}/movie/${filmId}?api_key=${CLE_API}&language=fr`;
    try {
        const reponse = await fetch(url);
        const film = await reponse.json();
        
        afficherDetailsFilm(film);
    } catch (erreur) {
        console.error("Erreur lors de la récupération des détails du film :", erreur);
    }
}

// Fonction pour afficher les détails du film sur la page
function afficherDetailsFilm(film) {
    const conteneurDetails = document.getElementById("movie-details");
    conteneurDetails.innerHTML = `
        <h1>${film.title}</h1>
        <img src="${URL_BASE_IMAGE}${film.poster_path}" alt="${film.title}">
        <p>${film.overview}</p>
        <p><strong>Date de sortie :</strong> ${film.release_date}</p>
        <p><strong>Note :</strong> ${film.vote_average}/10</p>
        <p><strong>Durée :</strong> ${film.runtime} minutes</p>
        <p><strong>Genres :</strong> ${film.genres.map(genre => genre.name).join(", ")}</p>
    `;
}


if (document.getElementById("movie-details")) {
    recupererDetailsFilm();
}
