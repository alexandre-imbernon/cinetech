function getFilms() {
    const apiKey = '8c4b867188ee47a1d4e40854b27391ec';
    const apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=fr&page=1`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const filmsContainer = document.getElementById('moviesContainer');
            data.results.forEach(film => {
                const card = document.createElement('div');
                card.classList.add('col-md-4', 'mb-4');
                card.innerHTML = `
                    <div class="card">
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
        })
        .catch(error => console.error('Erreur lors de la récupération des films :', error));
}

// Appel de la fonction pour récupérer les films au chargement de la page
getFilms();
