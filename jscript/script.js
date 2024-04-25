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
      container.innerHTML = '';  // Vider le conteneur avant d'ajouter des éléments

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
              const itemId = item.id;  // Obtenir l'ID de l'élément pour créer le lien
              const columnElement = document.createElement('div');
              columnElement.className = 'col-md-3';  // Pour 4 éléments dans une rangée
              
              // Créer un lien qui dirige vers la page de détails de l'élément
              columnElement.innerHTML = `
                  <a href="/details.html?id=${itemId}" class="card-link">
                      <div class="card mb-3">
                          <img src="https://image.tmdb.org/t/p/w500${posterPath}" class="card-img-top" alt="${title}">
                      </div>
                  </a>
              `;
              
              itemElement.querySelector('.row').appendChild(columnElement);
          });

          itemElement.innerHTML += '</div>';
          container.appendChild(itemElement);
      }
  }

  // Charger les films et séries populaires
  loadPopularMovies();
  loadPopularSeries();
});

// Assurez-vous que le DOM est prêt avant de commencer
document.addEventListener('DOMContentLoaded', function() {
    const apiKey = '8c4b867188ee47a1d4e40854b27391ec';
    const baseUrl = 'https://api.themoviedb.org/3';

    // Configurer l'écouteur d'événements pour la barre de recherche
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value;
            search(query);
        });
    }

    // Fonction de recherche
    function search(query) {
        if (query.trim() === '') {
            displaySearchResults([]); // Effacez les résultats si la requête est vide
            return;
        }

        const url = `${baseUrl}/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                displaySearchResults(data.results);
            })
            .catch(error => console.error('Erreur:', error));
    }

    // Fonction pour afficher les résultats de recherche sous la barre de recherche
    function displaySearchResults(results) {
        const resultsContainer = document.getElementById('resultsContainer');
        resultsContainer.innerHTML = ''; // Vider les résultats précédents

        if (results.length === 0) {
            resultsContainer.innerHTML = '<p>Aucun résultat trouvé.</p>';
            return;
        }

        document.addEventListener('click', function(event) {
            const resultsContainer = document.getElementById('resultsContainer');
        
            // Vérifiez si l'élément cliqué n'est pas à l'intérieur de resultsContainer
            if (!resultsContainer.contains(event.target)) {
                // Effacez les résultats de recherche
                resultsContainer.innerHTML = '';
            }
        });
        
        // Afficher chaque résultat de recherche
        results.forEach(item => {
            const title = item.title || item.name;
            const overview = item.overview || 'Aucune description disponible';
            const type = item.media_type === 'movie' ? 'Film' : 'Série';

            const resultElement = document.createElement('div');
            resultElement.className = 'result-item';

            resultElement.innerHTML = `
                <div class="card mb-3">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text"><small class="text-muted">Type: ${type}</small></p>
                </div>
            `;

            resultsContainer.appendChild(resultElement);
        });
    }
});



//Connexion
// Fonction de gestion de la connexion
function handleLogin() {
    // Récupère les valeurs des champs de formulaire
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Logique de vérification des identifiants
    // Pour cet exemple, je vérifie si le nom d'utilisateur est "user" et le mot de passe "password"
    // Vous pouvez remplacer cela par votre propre logique de vérification
    if (username === 'user' && password === 'password') {
        // Stocke le nom d'utilisateur dans le local storage
        localStorage.setItem('loggedInUser', username);

        // Affiche un message de bienvenue
        alert(`Bienvenue, ${username}!`);

        // Ferme la modal
        const modal = document.getElementById('exampleModal');
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
    } else {
        // Affiche un message d'erreur si les identifiants sont incorrects
        alert('Nom d\'utilisateur ou mot de passe incorrect. Veuillez réessayer.');
    }
}

// Ajouter un écouteur d'événement au bouton "Se connecter"
document.querySelector('.modal-footer .btn-primary').addEventListener('click', handleLogin);

// Fonction pour vérifier le local storage lors du chargement de la page
function checkLoggedInUser() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        // L'utilisateur est déjà connecté
        alert(`Bienvenue de retour, ${loggedInUser}!`);
        // Ajoutez ici d'autres actions à effectuer si l'utilisateur est déjà connecté
    }
}

// Appeler la fonction pour vérifier si l'utilisateur est déjà connecté au chargement de la page
window.onload = checkLoggedInUser;

//FAVORIS


