// Configuration API
const apiKey = '8c4b867188ee47a1d4e40854b27391ec';
const baseImageUrl = 'https://image.tmdb.org/t/p/w500';
const urlParams = new URLSearchParams(window.location.search);
// Récupérer les identifiants de série et de film depuis l'URL
const serieId = urlParams.get("tv_id");
if (serieId) {
    getDetails('tv', serieId, true);
}

const movieId = urlParams.get("movie_id");
if (movieId) {
    getDetails('movie', movieId, false);
}

// Fonction générique pour récupérer des données d'une API
async function fetchApi(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erreur lors de la récupération des données.');
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des données de l'API :", error);
        return null;
    }
}

// Fonction pour obtenir des détails d'un film ou d'une série
async function getDetails(endpoint, itemId, isSeries) {
    const [data, credits, commentsData] = await Promise.all([
        fetchApi(`https://api.themoviedb.org/3/${endpoint}/${itemId}?api_key=${apiKey}&language=fr`),
        fetchApi(`https://api.themoviedb.org/3/${endpoint}/${itemId}/credits?api_key=${apiKey}&language=fr`),
        fetchApi(`https://api.themoviedb.org/3/${endpoint}/${itemId}/reviews?api_key=${apiKey}&language=fr&language=en`)
    ]);

    if (!data) {
        document.getElementById("details").innerText = "Les détails ne peuvent pas être affichés.";
        return;
    }

    const title = isSeries ? data.name : data.title;
    const genres = data.genres?.map(g => g.name).join(', ') || 'Inconnu';
    const nationality = isSeries ? data.origin_country?.join(', ') : data.production_countries?.map(p => p.name).join(', ') || 'Inconnu';
    const imageSrc = data.poster_path ? `${baseImageUrl}${data.poster_path}` : '';
    
    const specificDetails = isSeries
        ? `<p><span style="font-weight: bold; color: red;">Nombre de saisons <span style="color: white;">:</span> ${data.number_of_seasons || 'Inconnu'}</span></p>
           <p><span style="font-weight: bold; color: red;">Nombre d'épisodes <span style="color: white;">: ${data.number_of_episodes || 'Inconnu'}</p>`
        : `<p><span style="font-weight: bold; color: red;">Durée <span style="color: white;"> : ${data.runtime ? `${data.runtime} minutes` : 'Inconnu'}</p>`;

        document.getElementById("details").innerHTML = `
        <h2 id="avis" class="text-center"><span style="font-weight: bold; color: white;">${title}</h2>
        <div class="text-center m-4">
            <img src="${imageSrc}" alt="${title}" class="img-fluid">
        </div>
        <p><span style="font-style: italic; color: white;">${data.overview || 'Aucune description disponible'}</p>
        ${specificDetails}
        <p><span style="font-weight: bold; color: red;">Genre <span style="color: white;">: ${genres}</p>
        <p><span style="font-weight: bold; color: red;">Réalisateur <span style="color: white;">: ${credits.crew.find(c => c.job === 'Director')?.name || 'Inconnu'}</p>
        <p><span style="font-weight: bold; color: red;">Acteurs <span style="color: white;"> : ${credits.cast.slice(0, 5).map(a => a.name).join(', ') || 'Inconnu'}</p>
        <p><span style="font-weight: bold; color: red;">Nationalité <span style="color: white;">: ${nationality}</p>
    `;

    // Afficher les commentaires avec une option de réponse
    displayComments(commentsData, itemId);
    
    // Afficher les recommandations basées sur le genre
    const recommended = await getRecommended(data.genres?.[0]?.id, isSeries);
    document.getElementById("recommended").innerHTML = `
        <p><span style=" color: white;"> Si vous avez aimé ${title}, vous aimerez : ${recommended}</p>
    `;
}

// Fonction pour obtenir des recommandations basées sur le genre
async function getRecommended(genreId, isSeries) {
    const endpoint = isSeries ? 'discover/tv' : 'discover/movie';
    const data = await fetchApi(`https://api.themoviedb.org/3/${endpoint}?api_key=${apiKey}&with_genres=${genreId}`);

    if (!data || data.results?.length === 0) {
        return "Aucune recommandation";
    }

    const randomIndex = Math.floor(Math.random() * data.results.length);
    return isSeries ? data.results[randomIndex].name : data.results[randomIndex].title;
}

function getStoredReplies(itemId) {
    const key = `replies-${itemId}`;
    return JSON.parse(localStorage.getItem(key)) || {};
}

// Fonction pour stocker des réponses localement
function storeReply(itemId, commentIndex, replyText) {
    const key = `replies-${itemId}`;
    let replies = JSON.parse(localStorage.getItem(key)) || {};

    if (replies[commentIndex]) {
        replies[commentIndex] += `\n\n${replyText}`; // Ajouter à la suite si déjà existant
    } else {
        replies[commentIndex] = replyText; // Nouvelle réponse
    }

    localStorage.setItem(key, JSON.stringify(replies));
}

// Fonction pour récupérer des réponses stockées
function getStoredReplies(itemId) {
    const key = `replies-${itemId}`;
    return JSON.parse(localStorage.getItem(key)) || {};
}

// Fonction pour afficher les commentaires avec les réponses stockées
function displayComments(commentsData, itemId) {
    const storedReplies = getStoredReplies(itemId);
    const commentsHtml = commentsData?.results?.length > 0
        ? commentsData.results.map((c, i) => `
            <div class="comment">
                <strong><span style="font-weight: bold; color: gray;">Par: ${c.author || 'Anonyme'}</strong>
                <p><span style="font-style: italic; color: white;">${c.content || 'Pas de contenu.'}</p>
                <div class="replies" id="replies-${i}">
                    ${storedReplies[i] ? `<strong>Réponses :</strong><p>${storedReplies[i]}</p>` : ""}
                </div>
                <button class="btn btn-primary" onclick="replyToComment(${i})">Répondre</button>
                <div id="reply-section-${i}" class="reply-section" style="display: none;">
                    <textarea id="reply-input-${i}" placeholder="Votre réponse"></textarea>
                    <button class="btn btn-primary" onclick="submitReply(${i}, ${itemId})">Soumettre</button>
                </div>
            </div>
        `).join("")
        : "Aucun commentaire disponible.";

    document.getElementById("comments").innerHTML = commentsHtml;
}

// Fonction pour gérer la réponse aux commentaires
function submitReply(index, itemId) {
    const replyText = document.getElementById(`reply-input-${index}`).value;

    if (replyText.trim() !== "") {
        storeReply(itemId, index, replyText); // Stocker la réponse

        console.log("Réponse soumise :", replyText);

        // Afficher la réponse dans l'interface utilisateur
        const commentDiv = document.querySelectorAll(".comment")[index];
        const replyContainer = document.createElement("div");
        replyContainer.className = "reply";
        replyContainer.innerHTML = `<p>${replyText}</p>`;

        commentDiv.appendChild(replyContainer);

        // Garder la section de réponse ouverte après soumission
        const replySection = document.getElementById(`reply-section-${index}`);
        if (replySection) {
            replySection.style.display = "block"; // Garder ouvert
        }
    } else {
        console.log("Aucune réponse fournie.");
    }
}

// Fonction pour afficher ou masquer la zone de réponse
function replyToComment(index) {
    const replySection = document.getElementById(`reply-section-${index}`);
    if (replySection.style.display === "none") {
        replySection.style.display = "block"; // Afficher la zone de réponse
    } else {
        replySection.style.display = "none"; // Masquer
    }
}

// Fonction pour rediriger vers la page de détails avec l'ID de la série
function showDetails(id) {
    localStorage.setItem('serieId', id); // Stocker l'ID de la série dans le localStorage
    window.location.href = 'details.html'; // Rediriger vers la page de détails
}

// Appeler la fonction pour récupérer les séries au chargement de la page
getSeries(); // Récupération des séries au chargement de la page

// Fonction asynchrone pour afficher les détails d'une série sur la page "details.html"
async function displaySerieDetails() {
    const serieId = localStorage.getItem('serieId'); // Récupérer l'ID de la série du localStorage
    const apiUrl = `https://api.themoviedb.org/3/tv/${serieId}?api_key=${apiKey}&language=fr`;

    try {
        const response = await fetch(apiUrl); // Attente de la réponse du fetch
        const data = await response.json();  // Attente de la conversion en JSON

        const detailsElement = document.getElementById('details'); // Sélection de l'élément pour afficher les détails

        detailsElement.innerHTML = `
            <h2>${data.name}</h2>
            <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="${data.name}">
            <p>${data.overview}</p>
            <p>Nombre de saisons : ${data.number_of_seasons}</p>
            <p>Nombre d'épisodes : ${data.number_of_episodes}</p>
        `;

    } catch (error) {
        console.error('Erreur lors de la récupération des détails de la série :', error);
    }
}