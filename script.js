const URL_API = 'https://api.themoviedb.org/3'; // URL de base de l'API
const URL_BASE_IMAGE = 'https://image.tmdb.org/t/p/original'; // URL de base pour les images

let pageActuelle = 1;


async function recupererFilms(page = 1, recherche = '') {

    const url = recherche
        ? `${URL_API}/search/movie?api_key=${CLE_API}&language=fr&query=${recherche}&page=${page}`
        : `${URL_API}/movie/popular?api_key=${CLE_API}&language=fr&page=${page}`;

    try {
        const reponse = await fetch(url);
        const donnees = await reponse.json();

        if (donnees.results && donnees.results.length > 0) {
            afficherFilms(donnees.results);
            pageActuelle++;
        } else {
            console.error("Aucun film trouvé ou résultats vides");
        }
    } catch (erreur) {
        console.error("Erreur lors de la récupération des films :", erreur);
    }
}


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

        filmElement.addEventListener("click", () => {
            window.location.href = `movie.html?id=${film.id}`;
        });

        conteneurFilms.appendChild(filmElement);
    });
}


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

function rechercherFilms() {
    const inputRecherche = document.getElementById("search-input").value.trim();
    if (inputRecherche === "") {
        const conteneurFilms = document.getElementById("movies");
        conteneurFilms.innerHTML = '';
        return;
    }

    pageActuelle = 1;
    const conteneurFilms = document.getElementById("movies");
    conteneurFilms.innerHTML = ''; // Vide le conteneur des films avant de charger les nouveaux résultats
    recupererFilms(pageActuelle, inputRecherche);
}


document.getElementById('search-input').addEventListener('input', rechercherFilms);

//charger plus de films
document.getElementById('load-more').addEventListener('click', () => {
    recupererFilms(pageActuelle);
});

//bascule de thème
function basculerTheme() {
    document.body.classList.toggle('dark');
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


recupererFilms(pageActuelle);






// Fonction pour récupérer un paramètre de l'URL
function obtenirParametreURL(parametre) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parametre);
}


async function recupererDetailsFilm() {
    const filmId = obtenirParametreURL("id");
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
