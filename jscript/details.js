// Clé API et URL de base pour les images
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

// Fonction pour obtenir les détails d'un film ou d'une série
async function getDetails(endpoint, itemId, isSeries) {
    const [data, credits] = await Promise.all([
        fetchApi(`https://api.themoviedb.org/3/${endpoint}/${itemId}?api_key=${apiKey}&language=fr`),
        fetchApi(`https://api.themoviedb.org/3/${endpoint}/${itemId}/credits?api_key=${apiKey}&language=fr`)
    ]);

    if (!data || !credits) {
        document.getElementById("details").innerText = "Les détails ne peuvent pas être affichés.";
        return;
    }

    const title = isSeries ? data.name : data.title;
    const genres = data.genres?.map(g => g.name).join(', ') || 'Inconnu';
    const nationality = isSeries ? data.origin_country?.join(', ') : data.production_countries?.map(p => p.name).join(', ');
    const imageSrc = data.poster_path ? `${baseImageUrl}${data.poster_path}` : '';
    const director = credits.crew.find(c => c.job === 'Director')?.name || 'Inconnu';
    const actors = credits.cast.slice(0, 5).map(a => a.name).join(', ') || 'Inconnu';

    const specificDetails = isSeries
        ? `<p>Nombre de saisons : ${data.number_of_seasons || 'Inconnu'}</p>
           <p>Nombre d'épisodes : ${data.number_of_episodes || 'Inconnu'}</p>`
        : `<p>Durée : ${data.runtime ? `${data.runtime} minutes` : 'Inconnu'}</p>`;

    document.getElementById("details").innerHTML = `
        <h2>${title}</h2>
        <img src="${imageSrc}" alt="${title}">
        <p>${data.overview || 'Aucune description disponible'}</p>
        ${specificDetails}
        <p>Genre : ${genres}</p>
        <p>Réalisateur : ${director}</p>
        <p>Acteurs : ${actors}</p>
        <p>Nationalité : ${nationality}</p>
    `;

    // Obtenir les commentaires
    const comments = await fetchApi(`https://api.themoviedb.org/3/${endpoint}/${itemId}/reviews?api_key=${apiKey}`);
    const commentsHtml = comments?.results?.length > 0 
        ? comments.results.map(c => `<div class="comment"><strong>Par: ${c.author || 'Anonyme'}</strong><p>${c.content || 'Pas de contenu.'}</p></div>`).join('') 
        : 'Aucun commentaire disponible.';
    
    document.getElementById("comments").innerHTML = commentsHtml;

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
    const data = await fetchApi(`https://api.themoviedb.org/3/${endpoint}?api_key=${apiKey}&with_genres=${genreId}`);

    if (!data || !data.results?.length) {
        return 'Aucune recommandation';
    }

    const randomIndex = Math.floor(Math.random() * data.results.length);
    return isSeries ? data.results[randomIndex].name : data.results[randomIndex].title;
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