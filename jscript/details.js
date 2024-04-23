// Récupérer l'ID de la série à partir du localStorage
var serieId = localStorage.getItem('serieId');
if (!serieId) {
  console.error("L'ID de la série n'a pas été trouvé dans le localStorage");
}

const apiKey = '8c4b867188ee47a1d4e40854b27391ec';
const apiUrl = `https://api.themoviedb.org/3/tv/${serieId}?api_key=${apiKey}&language=fr`;

// Appel à l'API TMDB pour récupérer les détails de la série
fetch(apiUrl)
    .then(response => {
        if (!response.ok) {  // Vérifiez si la réponse est OK
            throw new Error('Erreur lors de la récupération des détails de la série');
        }
        return response.json();  // Assurez-vous de retourner le JSON pour définir data
    })
    .then(data => {  // Maintenant vous pouvez utiliser data
        const serieTitle = data.name;  
        document.getElementById("details").innerHTML = `
            <h2>${serieTitle}</h2>
            <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="${serieTitle}">
            <p>${data.overview}</p>
            <p>Nombre de saisons : ${data.number_of_seasons}</p>
            <p>Nombre d'épisodes : ${data.number_of_episodes}</p>
            <p>Genre : </p>
            <p>Réalisateur : </p>
            <p>Acteurs :</p>
            <p>Nationalité : </p>
            
            
        `;

        document.getElementById("serieliked").innerText = serieTitle;
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des détails de la série :', error);
        document.getElementById("details").innerText = "Les détails de la série ne peuvent pas être affichés.";
    });