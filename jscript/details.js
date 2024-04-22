// Récupérer l'ID de la série à partir du localStorage
var serieId = localStorage.getItem('serieId');

// Appel à l'API TMDB pour récupérer les détails de la série
const apiKey = '8c4b867188ee47a1d4e40854b27391ec';
const apiUrl = `https://api.themoviedb.org/3/tv/${serieId}?api_key=${apiKey}&language=fr`;

fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        // Afficher les détails de la série
        document.getElementById("details").innerHTML = `
            <h2>${data.name}</h2>
            <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="${data.name}">
            <p>${data.overview}</p>
            <p>Nombre de saisons : ${data.number_of_seasons}</p>
            <p>Nombre d'épisodes : ${data.number_of_episodes}</p>
        `;
    })
    .catch(error => console.error('Erreur lors de la récupération des détails de la série :', error));
