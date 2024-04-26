// Sélectionnez la barre de navigation
const navbar = document.querySelector('.navbar');

// Fonction pour vérifier la position de défilement et ajuster la barre de navigation
function checkScroll() {
    // Si l'utilisateur a fait défiler la page, supprimer la classe 'fixed-top' de la barre de navigation
    if (window.scrollY > 684) {
        navbar.classList.remove('bg-transparent');
        navbar.classList.add('bg-dark');
    } else {
        navbar.classList.remove('bg-dark');
        navbar.classList.add('bg-transparent');
    }
}

// Ajoutez un écouteur d'événements pour appeler 'checkScroll' chaque fois que l'utilisateur fait défiler la page
window.addEventListener('scroll', checkScroll);

// Attendre que le DOM soit chargé avant de commencer
document.addEventListener("DOMContentLoaded", function() {
    // L'API key
    const apiKey = '8c4b867188ee47a1d4e40854b27391ec';
    // URL de base de l'API TMDB
    const baseUrl = 'https://api.themoviedb.org/3';

    // Charger les films populaires et les afficher dans le carrousel
    function loadPopularMovies() {
        const url = `${baseUrl}/trending/movie/week?api_key=${apiKey}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayCarouselItems(data.results, 'filmsContainer');
            })
            .catch(error => console.error('Erreur:', error));
    }

    // Charger les séries populaires et les afficher dans le carrousel
    function loadPopularSeries() {
        const url = `${baseUrl}/trending/tv/week?api_key=${apiKey}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayCarouselItems(data.results, 'seriesContainer');
            })
            .catch(error => console.error('Erreur:', error));
    }

// Fonction pour afficher les éléments dans les carrousels
function displayCarouselItems(items, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Vider le conteneur avant d'ajouter des éléments

    // Diviser les éléments en groupes de 4 pour chaque carousel-item
    const chunkSize = 4;
    for (let i = 0; i < items.length; i += chunkSize) {
        const chunk = items.slice(i, i + chunkSize);
        const isActiveClass = i === 0 ? 'active' : '';
        const itemElement = document.createElement('div');
        itemElement.className = `carousel-item ${isActiveClass}`;
        itemElement.innerHTML = '<div class="row justify-content-center">';

        // Ajouter chaque élément du groupe dans la rangée du carousel-item
        chunk.forEach(item => {
            const title = item.title || item.name;
            const posterPath = item.poster_path;
            const itemId = item.id; // Obtenir l'ID de l'élément pour créer le lien
            const columnElement = document.createElement('div');
            columnElement.className = 'col-md-3'; // Pour 4 éléments dans une rangée

            // Créer un lien qui dirige vers la page de détails de l'élément
            columnElement.innerHTML = `
                <a href="/html/details.html?${item.media_type}_id=${itemId}" class="card-link">
                    <div class="card mb-3">
                        <img src="https://image.tmdb.org/t/p/w500${posterPath}" class="card-img-top" alt="${title}">
                    </div>
                </a>
            `;

            // Ajouter la classe 'col-md-3' à la colonne
            itemElement.querySelector('.row').appendChild(columnElement);
        });

        // Ajouter la balise de fermeture </div> après la boucle forEach
        itemElement.innerHTML += '</div>';
        container.appendChild(itemElement);
    }
}

    // Charger les films et séries populaires
    loadPopularMovies();
    loadPopularSeries();
});
