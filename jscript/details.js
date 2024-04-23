// Récupérer l'ID de la série à partir du localStorage
var serieId = localStorage.getItem('serieId');
if (!serieId) {
  console.error("L'ID de la série n'a pas été trouvé dans le localStorage");
}

const apiKey = '8c4b867188ee47a1d4e40854b27391ec';
const apiUrl = `https://api.themoviedb.org/3/tv/${serieId}?api_key=${apiKey}&language=fr`;
const creditsUrl = `https://api.themoviedb.org/3/tv/${serieId}/credits?api_key=${apiKey}&language=fr`;

// Appel à l'API TMDB pour récupérer les détails de la série
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        const serieTitle = data.name || 'Inconnu';  
        const genres = (data.genres.map(genre => genre.name).join(', ')) || 'Inconnu';
        const nationality = (data.origin_country.join(', ')) || 'Inconnu';
        const numberOfSeasons = data.number_of_seasons || 'Inconnu';
        const numberOfEpisodes = data.number_of_episodes || 'Inconnu';

        // Appel à l'API TMDB pour récupérer les crédits de la série
        fetch(creditsUrl)
            .then(response => response.json())
            .then(creditsData => {
                const director = creditsData.crew.find(member => member.job === 'Director');
                const directorName = director ? director.name : 'Inconnu';

                // Récupérer les acteurs
                let actors = creditsData.cast.slice(0, 5).map(actor => actor.name).join(', ');
                if (actors === '') {
                    actors = 'Inconnu';
                }

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

                document.getElementById("serieliked").innerText = serieTitle;
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des crédits de la série :', error);
            });
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des détails de la série :', error);
        document.getElementById("details").innerText = "Les détails de la série ne peuvent pas être affichés.";
    });
