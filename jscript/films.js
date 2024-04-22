function getFilms(page = 1) {
    const apiKey = '8c4b867188ee47a1d4e40854b27391ec';
    const apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=fr&page=${page}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const filmsContainer = document.getElementById('moviesContainer');
            filmsContainer.innerHTML = ''; // Efface le contenu précédent
            
            data.results.forEach(film => {
                const card = document.createElement('div');
                card.classList.add('col-md-3', 'mb-4');
                card.innerHTML = `
                    <div class="card h-100">
                        <img src="https://image.tmdb.org/t/p/w500${film.poster_path}" class="card-img-top" alt="${film.title}">
                        <div class="card-body">
                            <h5 class="card-title">${film.title}</h5>
                            <p class="card-text">${film.overview}</p>
                            <a href="#" class="btn btn-secondary">Détails</a>
                        </div>
                    </div>
                `;
                filmsContainer.appendChild(card);
            });

            // Pagination
            const pagination = document.getElementById('pagination');
            pagination.innerHTML = '';
            const totalPages = 3; // Nombre total de pages de pagination
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
        })
        .catch(error => console.error('Erreur lors de la récupération des films :', error));
}

// Appel de la fonction pour récupérer les films au chargement de la page
getFilms();
