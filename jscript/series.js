// Configuration de l'API TMDb
const apiKey = '8c4b867188ee47a1d4e40854b27391ec';

// Fonction asynchrone pour récupérer et afficher les séries populaires
async function getSeries() {
    const apiUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=fr&page=1&sort_by=popularity.desc`;

    try {
        const response = await fetch(apiUrl); // Attente de la réponse du fetch
        const data = await response.json();  // Attente de la conversion en JSON

        const seriesContainer = document.getElementById('moviesContainer');
        seriesContainer.innerHTML = ''; // Nettoyage du conteneur pour éviter les doublons

        // Ajout des séries dans le conteneur
        data.results.forEach((serie) => {
            const card = document.createElement('div');
            card.classList.add('col-md-4', 'mb-4');

            card.innerHTML = `
                <div class="card h-100 shadow">
                    <img src="https://image.tmdb.org/t/p/w500${serie.poster_path}" class="card-img-top" alt="${serie.name}">
                    <div class="card-body d-flex flex-column justify-content-between">
                        <div>
                            <h5 class="card-title">${serie.name}</h5>
                            <p class="card-text">${serie.overview}</p>
                        </div>
                        <a href="#" class="btn btn-secondary mt-auto" onclick="showDetails(${serie.id})">Détails</a>
                    </div>
                </div>
            `;
            seriesContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des séries :', error);
    }
}

// Fonction pour rediriger vers la page de détails avec l'ID de la série
function showDetails(id) {
    localStorage.setItem('serieId', id); // Stocker l'ID de la série dans le localStorage
    window.location.href = 'details.html'; // Rediriger vers la page de détails
}

// Appeler la fonction pour récupérer les séries au chargement de la page
getSeries(); // Récupération des séries au chargement de la page

// Fonction asynchrone pour afficher les détails d'une série sur la page "details.html"
async function displaySerieDetails() {
    const serieId = localStorage.getItem('serieId'); // Récupérer l'ID de la série du localStorage
    const apiUrl = `https://api.themoviedb.org/3/tv/${serieId}?api_key=${apiKey}&language=fr`;

    try {
        const response = await fetch(apiUrl); // Attente de la réponse du fetch
        const data = await response.json();  // Attente de la conversion en JSON

        const detailsElement = document.getElementById('details'); // Sélection de l'élément pour afficher les détails

        detailsElement.innerHTML = `
            <h2>${data.name}</h2>
            <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="${data.name}">
            <p>${data.overview}</p>
            <p>Nombre de saisons : ${data.number_of_seasons}</p>
            <p>Nombre d'épisodes : ${data.number_of_episodes}</p>
        `;

    } catch (error) {
        console.error('Erreur lors de la récupération des détails de la série :', error);
    }
}
