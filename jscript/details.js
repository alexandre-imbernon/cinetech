const apiKey = '8c4b867188ee47a1d4e40854b27391ec';
const urlParams = new URLSearchParams(window.location.search);

// Fonction pour récupérer les données de l'API
async function fetchApi(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données de l\'API :', error);
        return null;
    }
}

// Fonction pour récupérer une série recommandée basée sur le genre
async function getRecommendedSeries(genreId) {
    const discoverUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_genres=${genreId}`;
    const data = await fetchApi(discoverUrl);

    if (data && data.results.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const series = data.results[randomIndex];
        return series.name;
    } else {
        return 'Aucune série recommandée';
    }
}

// Fonction principale pour récupérer les détails de la série
async function getSeriesDetails() {
    const serieId = urlParams.get("serie_id");

    const apiUrl = `https://api.themoviedb.org/3/tv/${serieId}?api_key=${apiKey}&language=fr`;
    const creditsUrl = `https://api.themoviedb.org/3/tv/${serieId}/credits?api_key=${apiKey}&language=fr`;

    // Récupérer les données de la série et les crédits
    const data = await fetchApi(apiUrl);
    const creditsData = await fetchApi(creditsUrl);

    console.log(data);
    if (data && creditsData) {
        // Extraire les détails de la série
        const serieTitle = data.name || 'Inconnu';  
        const genres = (data.genres.map(genre => genre.name).join(', ')) || 'Inconnu';
        const nationality = (data.origin_country.join(', ')) || 'Inconnu';
        const numberOfSeasons = data.number_of_seasons || 'Inconnu';
        const numberOfEpisodes = data.number_of_episodes || 'Inconnu';

        // Extraire les détails des crédits
        const director = creditsData.crew.find(member => member.job === 'Director');
        const directorName = director ? director.name : 'Inconnu';
        let actors = creditsData.cast.slice(0, 5).map(actor => actor.name).join(', ');
        if (actors === '') {
            actors = 'Inconnu';
        }

        // Récupérer une série recommandée du même genre
        const genreId = data.genres.length > 0 ? data.genres[0].id : null;
        const recommendedSeries = genreId ? await getRecommendedSeries(genreId) : 'Aucune série recommandée';

        // Mettre à jour l'interface utilisateur avec les détails de la série
        document.getElementById("details").innerHTML = `
            <h2>${serieTitle}</h2>
            <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="${serieTitle}">
            <p>${data.overview || 'Aucune description disponible'}</p>
            <p>Nombre de saisons : ${numberOfSeasons}</p>
            <p>Nombre d'épisodes : ${numberOfEpisodes}</p>
            <p>Genre : ${genres}</p>
            <p>Réalisateur : ${directorName}</p>
            <p>Acteurs : ${actors}</p>
            <p>Nationalité : ${nationality}</p>
        `;

        // Mettre à jour l'interface utilisateur avec la série recommandée
        document.getElementById("liked").innerText = serieTitle;
        document.getElementById("recommended").innerHTML = `<p>Si vous avez aimé ${serieTitle}, vous aimerez : ${recommendedSeries}</p>`;
    } else {
        document.getElementById("details").innerText = "Les détails de la série ne peuvent pas être affichés.";
    }
}

// Fonction principale pour récupérer les détails de la série
async function getMovieDetails() {
    const movieId = urlParams.get("film_id");

    const apiUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=fr`;
    const creditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=fr`;

    // Récupérer les données du film et les crédits
    const data = await fetchApi(apiUrl);
    const creditsData = await fetchApi(creditsUrl);

    if (data && creditsData) {
        // Extraire les détails de la série
        const movieTitle = data.title || 'Inconnu';  
        const genres = (data.genres.map(genre => genre.name).join(', ')) || 'Inconnu';
        const nationality = (data.production_countries.map(country => country.name).join(', ')) || 'Inconnu';
        const runtime = data.runtime ? `${data.runtime} minutes` : 'Inconnu';

       // Extraire les détails des crédits
       const director = creditsData.crew.find(member => member.job === 'Director');
       const directorName = director ? director.name : 'Inconnu';
       let actors = creditsData.cast.slice(0, 5).map(actor => actor.name).join(', ');
       if (actors === '') {
           actors = 'Inconnu';
       }

        //const genreId = data.genres.length > 0 ? data.genres[0].id : null;
        //const recommendedMovie = genreId ? await getRecommendedSeries(genreId) : 'Aucun film recommandé';

        document.getElementById("details").innerHTML = `
            <h2>${movieTitle}</h2>
            <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="${movieTitle}">
            <p>${data.overview || 'Aucune description disponible'}</p>
            <p>Durée : ${runtime}</p>
            <p>Genre : ${genres}</p>
            <p>Réalisateur : ${directorName}</p>
            <p>Acteurs : ${actors}</p>
            <p>Nationalité : ${nationality}</p>
        `;

        document.getElementById("liked").innerText = movieTitle;
        document.getElementById("recommended").innerHTML = `<p>Si vous avez aimé ${movieTitle}, vous aimerez : ${recommendedMovie}</p>`;
    } else {
        document.getElementById("details").innerText = "Les détails du film ne peuvent pas être affichés.";
    }
}

// Appeler la fonction principale
getSeriesDetails();
getMovieDetails();