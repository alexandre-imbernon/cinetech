// Variables globales pour la pagination
let currentPage = 1; // Numéro de la page actuelle
const seriesPerPage = 6; // Nombre de séries par page

// Fonction pour récupérer les séries depuis l'API TMDb en fonction de la page spécifiée
function getSeries(pageNumber) {
    const apiKey = '8c4b867188ee47a1d4e40854b27391ec';
    const apiUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=fr&page=${pageNumber}&sort_by=popularity.desc`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const seriesContainer = document.getElementById('moviesContainer');
            seriesContainer.innerHTML = ''; // Effacer le contenu actuel

            data.results.forEach(serie => {
                const card = document.createElement('div');
                card.classList.add('col-md-3', 'mb-4');

                // Modification de la structure de la carte pour une apparence améliorée
                card.innerHTML = `
                    <div class="card h-100 shadow">
                        <img src="https://image.tmdb.org/t/p/w500${serie.poster_path}" class="card-img-top" alt="${serie.name}">
                        <div class="card-body d-flex flex-column justify-content-between">
                            <div>
                                <h5 class="card-title">${serie.name}</h5>
                                <p class="card-text">${serie.overview}</p>
                            </div>
                            <div>
                                <a href="#" class="btn btn-secondary mt-auto">Détails</a>
                                <a href="#" class="btn btn-primary mt-auto">Ajouter un commentaire</a>
                            </div>
                        </div>
                    </div>
                `;
                seriesContainer.appendChild(card);
            });
        })
        .catch(error => console.error('Erreur lors de la récupération des séries :', error));
}

// Appel de la fonction pour récupérer les séries de la première page au chargement de la page
getSeries(currentPage);

// FONCTION PAGINATION

function changePage(pageNumber) {
    const apiKey = '8c4b867188ee47a1d4e40854b27391ec';
    const apiUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=fr&page=${pageNumber}&sort_by=popularity.desc`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const seriesContainer = document.getElementById('moviesContainer');
            seriesContainer.innerHTML = ''; // Clear existing content

            data.results.forEach(serie => {
                const card = document.createElement('div');
                card.classList.add('col-md-3', 'mb-4');

                // Modification de la structure de la carte pour une apparence améliorée
                card.innerHTML = `
                    <div class="card h-100 shadow">
                        <img src="https://image.tmdb.org/t/p/w500${serie.poster_path}" class="card-img-top" alt="${serie.name}">
                        <div class="card-body d-flex flex-column justify-content-between">
                            <div>
                                <h5 class="card-title">${serie.name}</h5>
                                <p class="card-text">${serie.overview}</p>
                            </div>
                            <div>
                                <a href="#" class="btn btn-secondary mt-auto">Détails</a>
                                <a href="#" class="btn btn-primary mt-auto">Ajouter un commentaire</a>
                            </div>
                        </div>
                    </div>
                `;
                seriesContainer.appendChild(card);
            });

            // Scroll to the top of the page
            window.scrollTo({ top: 0, behavior: 'smooth' });
        })
        .catch(error => console.error('Erreur lors de la récupération des séries :', error));
}

