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
                            <a href="details.html" class="btn btn-primary btn-details font-monospace">Détails</a>
                            <button class="btn btn-danger btn-favorite font-monospace"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
                                <path d="M7.969 14.914c-.173.007-.346-.045-.48-.16l-.001-.001c-.12-.12-.189-.291-.187-.468.001-.173.051-.342.142-.482l.001-.002c.419-.652.943-1.273 1.556-1.783 1.026-1.021 2.258-1.636 3.567-2.481.875-.587 1.78-1.195 2.505-1.97.793-.827 1.257-1.865 1.414-3.014.147-1.1-.149-2.087-.761-2.816-.487-.674-1.227-1.258-2.132-1.67-1.193-.603-2.684-.556-3.815.076a7.25 7.25 0 0 0-1.1.718 7.25 7.25 0 0 0-1.1-.718c-1.131-.633-2.622-.68-3.815-.076-.906.412-1.646.997-2.132 1.67-.612.729-.908 1.717-.761 2.816.157 1.149.622 2.187 1.414 3.014.725.775 1.63 1.383 2.505 1.97 1.309.845 2.541 1.46 3.567 2.481.613.51 1.137 1.131 1.556 1.783.091.14.141.309.142.482.003.177-.067.348-.187.468-.134.115-.307.167-.48.16-.098-.004-.193-.04-.282-.107l-.001.001-1.286-.864a1.833 1.833 0 0 0-2.22 0l-1.286.864-.001-.001c-.089.066-.184.103-.282.107z"/>
                            </svg> Favoris</button>
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
        
        // Ajout de la fonction de recherche
        document.getElementById('searchButton').addEventListener('click', async () => {
            const searchTerm = document.getElementById('searchInput').value;
            const searchUrl = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=fr&query=${searchTerm}`;
    
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
                                    <a href="details.html" class="btn btn-primary btn-details font-monospace">Détails</a>
                                    <button class="btn btn-danger btn-favorite font-monospace"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
                                        <path d="M7.969 14.914c-.173.007-.346-.045-.48-.16l-.001-.001c-.12-.12-.189-.291-.187-.468.001-.173.051-.342.142-.482l.001-.002c.419-.652.943-1.273 1.556-1.783 1.026-1.021 2.258-1.636 3.567-2.481.875-.587 1.78-1.195 2.505-1.97.793-.827 1.257-1.865 1.414-3.014.147-1.1-.149-2.087-.761-2.816-.487-.674-1.227-1.258-2.132-1.67-1.193-.603-2.684-.556-3.815.076a7.25 7.25 0 0 0-1.1.718 7.25 7.25 0 0 0-1.1-.718c-1.131-.633-2.622-.68-3.815-.076-.906.412-1.646.997-2.132 1.67-.612.729-.908 1.717-.761 2.816.157 1.149.622 2.187 1.414 3.014.725.775 1.63 1.383 2.505 1.97 1.309.845 2.541 1.46 3.567 2.481.613.51 1.137 1.131 1.556 1.783.091.14.141.309.142.482.003.177-.067.348-.187.468-.134.115-.307.167-.48.16-.098-.004-.193-.04-.282-.107l-.001.001-1.286-.864a1.833 1.833 0 0 0-2.22 0l-1.286.864-.001-.001c-.089.066-.184.103-.282.107z"/>
                                    </svg> Favoris</button>
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
