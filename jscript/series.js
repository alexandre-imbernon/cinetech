// Fonction pour ajouter une série aux favoris
function addToFavorites(serieId, serieTitle, seriePoster) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.push({ id: serieId, title: serieTitle, poster: seriePoster });
    localStorage.setItem('favorites', JSON.stringify(favorites));

    // Affichage de la modal avec le message
    const successMessage = "Série ajoutée aux favoris avec succès !";
    displaySuccessModal(successMessage);
}

// Fonction pour afficher une modal de succès avec un message
function displaySuccessModal(message) {
    const successModalBody = document.getElementById('success-modal-body');
    successModalBody.textContent = message;

    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
}


// Fonction pour afficher les favoris dans la modale avec des boutons de suppression
function displayFavoritesModal() {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoritesModalBody = document.getElementById('favorites-modal-body');
    if (favorites.length > 0) {
        // Créer le contenu HTML pour chaque série favorite avec un bouton de suppression
        const favoritesHTML = favorites.map(serie => `
            <div class="favorite-item">
                <p>${serie.title}</p>
                <button class="btn btn-danger btn-sm" onclick="removeFromFavorites(${serie.id})">Supprimer</button>
            </div>
        `).join('');
        favoritesModalBody.innerHTML = favoritesHTML;
    } else {
        favoritesModalBody.innerHTML = '<p>Aucune série favorite.</p>';
    }
    
    // Afficher la modal
    const favoritesModal = new bootstrap.Modal(document.getElementById('favoritesModal'));
    favoritesModal.show();
}

// Fonction pour supprimer une série des favoris
function removeFromFavorites(serieId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    // Filtrer les favoris pour obtenir une nouvelle liste sans la série à supprimer
    favorites = favorites.filter(serie => serie.id !== serieId);
    // Mettre à jour les favoris dans le stockage local
    localStorage.setItem('favorites', JSON.stringify(favorites));
    // Réafficher la liste des favoris mise à jour dans la modale
    displayFavoritesModal();
}


// Appel de la fonction pour récupérer les séries
getSeries();

async function getSeries(page = 1) {
    try {
        const apiKey = '8c4b867188ee47a1d4e40854b27391ec';
        const apiUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=fr&page=${page}&sort_by=popularity.desc`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        const seriesContainer = document.getElementById('moviesContainer');
        seriesContainer.innerHTML = ''; // Efface le contenu précédent
        
        data.results.forEach(async serie => {
            const card = document.createElement('div');
            card.classList.add('col-md-3', 'mb-4');
            card.innerHTML = `
                <div class="card h-100">
                    <img src="https://image.tmdb.org/t/p/w500${serie.poster_path}" class="card-img-top" alt="${serie.name}">
                    <div class="card-body">
                        <div class="card-buttons">
                            <a href="lien_de_votre_page" class="btn btn-primary btn-details font-monospace">Détails</a>
                            <button class="btn btn-danger btn-favorite font-monospace" onclick="addToFavorites(${serie.id}, '${serie.name}', 'https://image.tmdb.org/t/p/w500${serie.poster_path}')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
                                    <path d="M7.969 14.914c-.173.007-.346-.045-.48-.16l-.001-.001c-.12-.12-.189-.291-.187-.468.001-.173.051-.342.142-.482l.001-.002c.419-.652.943-1.273 1.556-1.783 1.026-1.021 2.258-1.636 3.567-2.481.875-.587 1.78-1.195 2.505-1.97.793-.827 1.257-1.865 1.414-3.014.147-1.1-.149-2.087-.761-2.816-.487-.674-1.227-1.258-2.132-1.67-1.193-.603-2.684-.556-3.815.076a7.25 7.25 0 0 0-1.1.718 7.25 7.25 0 0 0-1.1-.718c-1.131-.633-2.622-.68-3.815-.076-.906.412-1.646.997-2.132 1.67-.612.729-.908 1.717-.761 2.816.157 1.149.622 2.187 1.414 3.014.725.775 1.63 1.383 2.505 1.97 1.309.845 2.541 1.46 3.567 2.481.613.51 1.137 1.131 1.556 1.783.091.14.141.309.142.482.003.177-.067.348-.187.468-.134.115-.307.167-.48.16-.098-.004-.193-.04-.282-.107l-.001.001-1.286-.864a1.833 1.833 0 0 0-2.22 0l-1.286.864-.001-.001c-.089.066-.184.103-.282.107z"/>
                                </svg> Favoris
                            </button>
                        </div>
                        <!-- Conteneur pour les commentaires -->
                        <div class="comments-container"></div>
                    </div>
                </div>
            `;
        
            // Ajout de la card au container principal
            seriesContainer.appendChild(card);
        });

        // Ajouter un événement au bouton "Favoris"
        document.getElementById('favoriteButton').addEventListener('click', displayFavoritesModal);
        
    } catch (error) {
        console.error('Erreur lors de la récupération des séries :', error);
    }
}