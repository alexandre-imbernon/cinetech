const backdrops = document.querySelectorAll('.modal-backdrop');
backdrops.forEach(backdrop => backdrop.remove()); // Retirer les overlays

// Définition de la fonction isMovieAlreadyInFavorites
function isMovieAlreadyInFavorites(movieId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    // Convertir movieId en nombre entier
    movieId = parseInt(movieId);

    // Vérifier si l'identifiant du film existe déjà dans les favoris
    return favorites.some(movie => movie.id === movieId);
}

// Fonction pour afficher une modal d'erreur avec un message
function displayErrorModal(message) {
    const errorModalBody = document.getElementById('error-modal-body');
    errorModalBody.textContent = message;

    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
    errorModal.show();
}

// Fonction pour ajouter une série aux favoris
function addToFavorites(serieId, serieTitle, seriePoster) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Vérifier si l'élément existe déjà dans les favoris
    const isAlreadyFavorite = favorites.some(serie => serie.id === serieId);

    if (isAlreadyFavorite) {
        // Afficher la modal d'erreur avec un message approprié
        const errorMessage = "Ce film ou série est déjà dans les favoris.";
        displayErrorModal(errorMessage);
        return;
    }

    // Ajouter l'élément aux favoris
    favorites.push({ id: serieId, title: serieTitle, poster: seriePoster });
    localStorage.setItem('favorites', JSON.stringify(favorites));

    // Afficher la modal avec le message de succès
    const successMessage = "Ajout aux favoris réussi !";
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

    // Réinitialiser le contenu
    favoritesModalBody.innerHTML = '';

    if (favorites.length > 0) {
        const favoritesHTML = favorites.map(serie => `
            <div class="favorite-item d-flex justify-content-between align-items-center">
                <p class="m-0">${serie.title}</p>
                <button class="btn btn-danger btn-sm" onclick="removeFromFavorites(${serie.id})">
                <i class="fas fa-trash-alt mr-"></i></button>
            </div>
        `).join('');
        favoritesModalBody.innerHTML = favoritesHTML;
    } else {
        favoritesModalBody.innerHTML = '<p>Aucune série favorite.</p>';
    }

    // Réinitialiser les styles de la modale
    const favoritesModal = new bootstrap.Modal(document.getElementById('favoritesModal'));
    if (favoritesModal._isShown) {
        favoritesModal.hide(); // Fermer la modale avant de l'ouvrir de nouveau
    }

    favoritesModal.show();
}


function removeFromFavorites(serieId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(serie => serie.id !== serieId);
    localStorage.setItem('favorites', JSON.stringify(favorites));

    // Fermer la modale pour éviter l'accumulation
    const favoritesModal = bootstrap.Modal.getInstance(document.getElementById('favoritesModal'));
    if (favoritesModal) {
        favoritesModal.hide();
    }

    // Réafficher la liste des favoris mise à jour
    displayFavoritesModal(); 
}



async function getFilms(page = 1) {
    try {
        const apiKey = '8c4b867188ee47a1d4e40854b27391ec';
        const apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=fr&page=${page}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        const filmsContainer = document.getElementById('moviesContainer');
        filmsContainer.innerHTML = ''; // Efface le contenu précédent
        
        data.results.forEach(async film => {
            const card = document.createElement('div');
            card.classList.add('col-md-3', 'mb-4');
            card.innerHTML = `
                <div class="card h-100">
                    <img src="https://image.tmdb.org/t/p/w500${film.poster_path}" class="card-img-top" alt="${film.title}">
                    <div class="card-body">
                        <div class="card-buttons">
                            <a href="/html/details.html?movie_id=${film.id}" class="btn btn-primary btn-details font-monospace"> <i class="fas fa-info-circle"></i>Détails</a>
                            <button class="btn btn-danger btn-favorite font-monospace" onclick="addToFavorites(${film.id}, '${film.title}', 'https://image.tmdb.org/t/p/w500${film.poster_path}')">
                            <i class="fas fa-heart"></i> Favoris</div>
                        <!-- Conteneur pour les commentaires -->
                        <div class="comments-container"></div>
                    </div>
                </div>
            `;
        
            // Ajout de la card au container principal
            filmsContainer.appendChild(card);
        
            // Événement de survol pour afficher les commentaires
            card.addEventListener('mouseenter', async () => {
                // Récupération et affichage des commentaires
                const reviewsUrl = `https://api.themoviedb.org/3/movie/${film.id}/reviews?api_key=${apiKey}&language=en&page=1`;
                const reviewsResponse = await fetch(reviewsUrl);
                const reviewsData = await reviewsResponse.json();
        
                const commentsContainer = card.querySelector('.comments-container');
                commentsContainer.innerHTML = ''; // Efface les commentaires précédents
        
                reviewsData.results.forEach(review => {
                    const comment = document.createElement('div');
                    comment.classList.add('comment');
                    comment.innerHTML = `
                        <p class="text-truncate"><strong>${review.author}</strong>: ${review.content}</p>
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
        
        // Fonction de recherche par genre
            document.getElementById('searchButton').addEventListener('click', async () => {
        const searchTerm = document.getElementById('searchInput').value;
        let searchUrl;

        // Vérifie si le terme de recherche est un genre
        const genreId = getGenreId(searchTerm);
        
        if (genreId) {
            // Si c'est un genre, recherche par genre
            searchUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=fr&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${genreId}`;
        } else {
            // Sinon, recherche normale
            searchUrl = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=fr&query=${searchTerm}`;
        }

        try {
            const response = await fetch(searchUrl);
            const searchData = await response.json();

            // Efface le contenu précédent avant d'afficher les nouveaux résultats
            filmsContainer.innerHTML = '';

            // Affiche les résultats de la recherche
            searchData.results.forEach(result => {
                const card = document.createElement('div');
                card.classList.add('col-md-3', 'mb-4');
                card.innerHTML = `
                    <div class="card h-100">
                        <img src="https://image.tmdb.org/t/p/w500${result.poster_path}" class="card-img-top" alt="${result.title}">
                        <div class="card-body">
                            <div class="card-buttons">
                                <a href="/html/details.html?${result.media_type}_id=${result.id}" class="btn btn-primary btn-details font-monospace"> <i class="fas fa-info-circle"></i>Détails</a>
                                <button class="btn btn-danger btn-favorite font-monospace" onclick="addToFavorites(${result.id}, '${result.title}', 'https://image.tmdb.org/t/p/w500${result.poster_path}')"> <i class="fas fa-heart"></i>Favoris</button>
                            </div>
                            <!-- Conteneur pour les commentaires -->
                            <div class="comments-container"></div>
                        </div>
                    </div>
                `;

                // Ajout de la card au container principal
                filmsContainer.appendChild(card);
            });
        } catch (error) {
            console.error('Erreur lors de la recherche de films :', error);
        }
    });

// Fonction pour obtenir l'ID du genre à partir du nom du genre
function getGenreId(genreName) {
    // Créez une correspondance de noms de genre avec les ID de genre
    const genreMap = {
        "action": 28,
        "aventure": 12,
        "animation": 16,
        "drame": 18,
        "science-fiction": 878,
        "thriller": 53,
        "horreur": 27,
        "guerre" : 10725,
        "documentaire" : 99,
        "musique": 10402
    };

    // Convertit le nom du genre en minuscules pour correspondre
    const lowercaseGenreName = genreName.toLowerCase();

    // Vérifie si le nom du genre correspond à un ID de genre
    return genreMap[lowercaseGenreName] || null;
}

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
                getFilms(i); // Appel de la fonction avec le numéro de page correspondant
            });
            li.appendChild(link);
            pagination.appendChild(li);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des films :', error);
    }
}    

// Fonction pour rediriger vers la page de détails avec l'ID du film
function showDetails(id) {
    localStorage.setItem('filmId', id); // Stocker l'ID du film dans le localStorage
    // window.location.href = 'details.html'; // Rediriger vers la page de détails
}



// Appel de la fonction pour récupérer les films au chargement de la page
getFilms();