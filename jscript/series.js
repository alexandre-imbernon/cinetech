// Fonction pour ajouter une série aux favoris
function addToFavorites(serieId, serieTitle, seriePoster, ) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.push({ id: serieId, title: serieTitle, poster: seriePoster });
    localStorage.setItem('favorites', JSON.stringify(favorites));

    // Affichage de la modal avec le message
    const successMessage = "Ajouts aux favoris réussi !";
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
            <div class="favorite-item d-flex justify-content-between align-items-center">
                <p class="m-0">${serie.title}</p>
                <button class="btn btn-danger btn-sm" onclick="removeFromFavorites(${serie.id})">
                <i class="fas fa-trash-alt mr-"></i> </button>
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



async function getSeries(page = 1) {
    try {
        const apiKey = '8c4b867188ee47a1d4e40854b27391ec';
        const apiUrl = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=fr&page=${page}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        const seriesContainer = document.getElementById('seriesContainer');
        seriesContainer.innerHTML = ''; // Efface le contenu précédent
        
        data.results.forEach(async serie => {
            const card = document.createElement('div');
            card.classList.add('col-md-3', 'mb-4');
            card.innerHTML = `
                <div class="card h-100">
                    <img src="https://image.tmdb.org/t/p/w500${serie.poster_path}" class="card-img-top" alt="${serie.name}">
                    <div class="card-body">
                        <div class="card-buttons">
                            <a href="lien_de_votre_page" class="btn btn-primary btn-details font-monospace"> <i class="fas fa-info-circle"></i>Détails</a>
                            <button class="btn btn-danger btn-favorite font-monospace" onclick="addToFavorites(${serie.id}, '${serie.name}', 'https://image.tmdb.org/t/p/w500${serie.poster_path}')">
                            <i class="fas fa-heart"></i> Favoris </button>
                        </div>
                        <!-- Conteneur pour les commentaires -->
                        <div class="comments-container"></div>
                    </div>
                </div>
            `;
            // Ajout de la card au container principal
            seriesContainer.appendChild(card);

            
            // Événement de survol pour afficher les commentaires
            card.addEventListener('mouseenter', async () => {
                // Récupération et affichage des commentaires
                const reviewsUrl = `https://api.themoviedb.org/3/tv/${serie.id}/reviews?language=en-FR&page=1`;
                console.log(serie.id);
                const options = {
                    method: 'GET',
                    headers: {
                      accept: 'application/json',
                      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZjdlOTkyNzRlNmQxZmYwZGRmOGZkYjFlNmI5YThlNyIsInN1YiI6IjY2Mjc2MmViN2E5N2FiMDE3ZDkwNWUwNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WJsGK1qCQ4bw8NgCUU2_PH5e6vapJxd4NeYZX3JbugU'
                    }
                };
                const reviewsResponse = await fetch(reviewsUrl, options);
                const reviewsData = await reviewsResponse.json();        
                const commentsContainer = card.querySelector('.comments-container');
                commentsContainer.innerHTML = ''; // Efface les commentaires précédents
        
                reviewsData.results.forEach(review => {
                    console.log(review);
                    const comment = document.createElement('div');
                    comment.classList.add('comment');
                    comment.innerHTML = `
                        <p><strong>${review.author}</strong>: ${review.content}</p>
                    `;
                    commentsContainer.appendChild(comment);
                });
        
                // Affiche les commentaires
                commentsContainer.style.display = 'block';
            });

            // Événement pour masquer les commentaires lorsque l'utilisateur ne survole plus la card
            card.addEventListener('mouseleave', () => {
                const commentsContainer = card.querySelector('.comments-container');
                commentsContainer.style.display = 'none';
            });
        });

        // Ajout de la fonction de recherche
        document.getElementById('searchButton').addEventListener('click', async () => {
            const searchTerm = document.getElementById('searchInput').value;
            const searchUrl = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=fr&query=${searchTerm}`;
    
            try {
                const response = await fetch(searchUrl);
                const searchData = await response.json();
    
                // Efface le contenu précédent avant d'afficher les nouveaux résultats
                seriesContainer.innerHTML = '';
    
                // Affiche les résultats de la recherche
                searchData.results.forEach(result => {
                    const card = document.createElement('div');
                    card.classList.add('col-md-3', 'mb-4');
                    card.innerHTML = `
                        <div class="card h-100">
                            <img src="https://image.tmdb.org/t/p/w500${result.poster_path}" class="card-img-top" alt="${result.title}">
                            <div class="card-body">
                                <div class="card-buttons">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <a href="lien_de_votre_page" class="btn btn-primary btn-details font-monospace"><i class="fas fa-info-circle"></i> Détails</a>
                                    <button class="btn btn-danger btn-favorite font-monospace" onclick="addToFavorites(${result.id}, '${result.title}', 'https://image.tmdb.org/t/p/w500${result.poster_path}')">
                                    <i class="fas fa-heart"></i> Favoris
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
            } catch (error) {
                console.error('Erreur lors de la recherche des series :', error);
            }
        });


        // Ajouter un événement au bouton "Favoris"
        document.getElementById('favoriteButton').addEventListener('click', displayFavoritesModal);
        
        // Pagination
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';
        const totalPages = 10; // Nombre total de pages de pagination
        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.classList.add('page-item');
            const link = document.createElement('a');
            link.classList.add('page-link');
            link.href = '#';
            link.textContent = i;
            link.addEventListener('click', () => {
                getSeries(i); // Appel de la fonction avec le numéro de page correspondant
            });
            li.appendChild(link);
            pagination.appendChild(li);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des séries :', error);
    }
}
// Appel de la fonction pour récupérer les séries
getSeries();