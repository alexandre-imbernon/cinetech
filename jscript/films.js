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
                            <a href="lien_de_votre_page" class="btn btn-primary btn-details font-monospace"> <i class="fas fa-info-circle"></i>Détails</a>
                            <button class="btn btn-danger btn-favorite font-monospace"><i class="fas fa-heart"></i>Favoris</button>
                        </div>
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
                const reviewsUrl = `https://api.themoviedb.org/3/movie/${film.id}/reviews?api_key=${apiKey}&language=fr&page=1`;
                const reviewsResponse = await fetch(reviewsUrl);
                const reviewsData = await reviewsResponse.json();
        
                const commentsContainer = card.querySelector('.comments-container');
                commentsContainer.innerHTML = ''; // Efface les commentaires précédents
        
                reviewsData.results.forEach(review => {
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
                                <a href="lien_de_votre_page" class="btn btn-primary btn-details font-monospace"> <i class="fas fa-info-circle"></i>Détails</a>
                                <button class="btn btn-danger btn-favorite font-monospace"><i class="fas fa-heart"></i>Favoris</button>
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


    

// Appel de la fonction pour récupérer les films au chargement de la page
getFilms();
