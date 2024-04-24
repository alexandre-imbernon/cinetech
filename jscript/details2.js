
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

// Fonction principale pour récupérer les détails de la série
async function getMovieDetails() {
    const movieId = localStorage.getItem('movieId');
    if (!movieId) {
        console.error("L'ID de la série n'a pas été trouvé dans le localStorage");
        return;
    }
    const apiKey = '8c4b867188ee47a1d4e40854b27391ec';
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

        document.getElementById("serieliked").innerText = movieTitle;
        document.getElementById("recommended").innerHTML = `<p>Si vous avez aimé ${movieTitle}, vous aimerez : ${recommendedMovie}</p>`;
    } else {
        document.getElementById("details").innerText = "Les détails du film ne peuvent pas être affichés.";
    }
}

// Appeler la fonction principale
getMovieDetails();
