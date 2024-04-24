const apiKey = '8c4b867188ee47a1d4e40854b27391ec';
const baseImageUrl = 'https://image.tmdb.org/t/p/w500';
const urlParams = new URLSearchParams(window.location.search);

// Fonction générique pour récupérer les données d'une API
async function fetchApi(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erreur lors de la récupération des données.');
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des données de l\'API :', error);
        return null;
    }
}

// Fonction générique pour extraire et afficher les détails d'un film ou d'une série
async function getDetails(endpoint, itemId, isSeries = true) {
    const apiUrl = `https://api.themoviedb.org/3/${endpoint}/${itemId}?api_key=${apiKey}&language=fr`;
    const creditsUrl = `https://api.themoviedb.org/3/${endpoint}/${itemId}/credits?api_key=${apiKey}&language=fr`;

    const data = await fetchApi(apiUrl);
    const creditsData = await fetchApi(creditsUrl);

    if (!data || !creditsData) {
        document.getElementById("details").innerText = "Les détails ne peuvent pas être affichés.";
        return;
    }

    // Détails génériques
    const title = isSeries ? data.name : data.title;
    const genres = data.genres?.map(genre => genre.name).join(', ') || 'Inconnu';
    const nationality = isSeries ? data.origin_country?.join(', ') : data.production_countries?.map(p => p.name).join(', ');
    const imageSrc = data.poster_path ? `${baseImageUrl}${data.poster_path}` : '';

    // Détails spécifiques aux séries et films
    const details = {
        seasons: data.number_of_seasons || 'Inconnu',
        episodes: data.number_of_episodes || 'Inconnu',
        runtime: data.runtime ? `${data.runtime} minutes` : 'Inconnu'
    };

    // Extraction des crédits
    const director = creditsData.crew.find(member => member.job === 'Director');
    const directorName = director ? director.name : 'Inconnu';
    const actors = creditsData.cast.slice(0, 5).map(actor => actor.name).join(', ') || 'Inconnu';

    // Créer le HTML pour afficher les détails
    document.getElementById("details").innerHTML = `
        <h2>${title}</h2>
        <img src="${imageSrc}" alt="${title}">
        <p>${data.overview || 'Aucune description disponible'}</p>
        ${isSeries ? `<p>Nombre de saisons : ${details.seasons}</p>` : ''}
        ${isSeries ? `<p>Nombre d'épisodes : ${details.episodes}</p>` : ''}
        ${!isSeries ? `<p>Durée : ${details.runtime}</p>` : ''}
        <p>Genre : ${genres}</p>
        <p>Réalisateur : ${directorName}</p>
        <p>Acteurs : ${actors}</p>
        <p>Nationalité : ${nationality}</p>
    `;

    // Récupérer une recommandation
    if (data.genres && data.genres.length > 0) {
        const genreId = data.genres[0].id;
        const recommended = await getRecommended(genreId, isSeries);
        document.getElementById("recommended").innerHTML = `
            <p>Si vous avez aimé ${title}, vous aimerez : ${recommended}</p>
        `;
    }
}

// Fonction pour obtenir une recommandation basée sur le genre
async function getRecommended(genreId, isSeries) {
    const endpoint = isSeries ? 'discover/tv' : 'discover/movie';
    const discoverUrl = `https://api.themoviedb.org/3/${endpoint}?api_key=${apiKey}&with_genres=${genreId}`;
    const data = await fetchApi(discoverUrl);

    if (data && data.results && data.results.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const recommended = data.results[randomIndex];
        return isSeries ? recommended.name : recommended.title;
    } else {
        return 'Aucune recommandation';
    }
}

// Récupérer et afficher les détails de la série et du film
const serieId = urlParams.get("serie_id");
if (serieId) {
    getDetails('tv', serieId, true);
}

const movieId = urlParams.get("film_id");
if (movieId) {
    getDetails('movie', movieId, false);
}