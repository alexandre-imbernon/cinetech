// series.js

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
                <div class="card h-100 shadow hover-effect">
                    <img src="https://image.tmdb.org/t/p/w500${serie.poster_path}" class="card-img-top hover-zoom-image" alt="${serie.name}">
                    <div class="card-body d-flex flex-column justify-content-between">
                        <div class="buttons-container d-flex justify-content-center">
                            <button class="btn btn-secondary btn-details d-none me-2"><i class="fas fa-info-circle"></i> Détails</button>
                            <button class="btn btn-secondary btn-favorite d-none ml-2"><i class="fas fa-heart"></i> Favoris</button>
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
                <div class="card h-100 shadow hover-effect">
                    <img src="https://image.tmdb.org/t/p/w500${serie.poster_path}" class="card-img-top hover-zoom-image" alt="${serie.name}">
                    <div class="card-body d-flex flex-column justify-content-between">
                        <div class="buttons-container d-flex justify-content-center">
                            <button class="btn btn-secondary btn-details d-none me-2"><i class="fas fa-info-circle"></i> Détails</button>
                            <button class="btn btn-secondary btn-favorite d-none ml-2"><i class="fas fa-heart"></i> Favoris</button>
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

// JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const cardImages = document.querySelectorAll('.card-img-top');

    // Fonction pour afficher les boutons au survol de la page
    function showButtons() {
        const detailsButtons = document.querySelectorAll('.btn-details');
        const favoriteButtons = document.querySelectorAll('.btn-favorite');

        detailsButtons.forEach(button => button.classList.remove('d-none'));
        favoriteButtons.forEach(button => button.classList.remove('d-none'));
    }

    // Fonction pour masquer les boutons lorsque le survol de la page cesse
    function hideButtons() {
        const detailsButtons = document.querySelectorAll('.btn-details');
        const favoriteButtons = document.querySelectorAll('.btn-favorite');

        detailsButtons.forEach(button => button.classList.add('d-none'));
        favoriteButtons.forEach(button => button.classList.add('d-none'));
    }

    // Ajouter les écouteurs d'événements pour le survol de la page
    document.body.addEventListener('mouseenter', showButtons);
    document.body.addEventListener('mouseleave', hideButtons);

    // Ajouter les écouteurs d'événements aux images de carte pour afficher les boutons au survol de la souris
    cardImages.forEach(image => {
        const detailsButton = image.nextElementSibling.querySelector('.btn-details');
        const favoriteButton = image.nextElementSibling.querySelector('.btn-favorite');

        image.addEventListener('mouseenter', function() {
            detailsButton.classList.remove('d-none');
            favoriteButton.classList.remove('d-none');
        });

        image.addEventListener('mouseleave', function() {
            detailsButton.classList.add('d-none');
            favoriteButton.classList.add('d-none');
        });

        image.addEventListener('click', function() {
            detailsButton.classList.remove('d-none');
            favoriteButton.classList.remove('d-none');
        });
    });
});
