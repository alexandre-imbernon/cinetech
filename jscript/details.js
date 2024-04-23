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
        const serieTitle = data.name;  
        const genres = data.genres.map(genre => genre.name).join(', ');

        // Appel à l'API TMDB pour récupérer les crédits de la série
 // Appel à l'API TMDB pour récupérer les crédits de la série
fetch(creditsUrl)
.then(response => response.json())
.then(creditsData => {
    const director = creditsData.crew.find(member => member.job === 'Director');
    const directorName = director ? director.name : 'Inconnu';

    // Récupérer les acteurs
    const actors = creditsData.cast.slice(0, 5).map(actor => actor.name).join(', ');

    document.getElementById("details").innerHTML = `
        <h2>${serieTitle}</h2>
        <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="${serieTitle}">
        <p>${data.overview}</p>
        <p>Nombre de saisons : ${data.number_of_seasons}</p>
        <p>Nombre d'épisodes : ${data.number_of_episodes}</p>
        <p>Genre : ${genres}</p>
        <p>Réalisateur : ${directorName}</p>
        <p>Acteurs : ${actors}</p>
        <p>Nationalité : </p>
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
