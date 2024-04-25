// Configuration API
const apiKey = '8c4b867188ee47a1d4e40854b27391ec';
const baseImageUrl = 'https://image.tmdb.org/t/p/w500';
const urlParams = new URLSearchParams(window.location.search);

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
        fetchApi(`https://api.themoviedb.org/3/${endpoint}/${itemId}/reviews?api_key=${apiKey}`)
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
        ? `<p>Nombre de saisons : ${data.number_of_seasons || 'Inconnu'}</p>
           <p>Nombre d'épisodes : ${data.number_of_episodes || 'Inconnu'}</p>`
        : `<p>Durée : ${data.runtime ? `${data.runtime} minutes` : 'Inconnu'}</p>`;

    document.getElementById("details").innerHTML = `
        <h2>${title}</h2>
        <img src="${imageSrc}" alt="${title}">
        <p>${data.overview || 'Aucune description disponible'}</p>
        ${specificDetails}
        <p>Genre : ${genres}</p>
        <p>Réalisateur : ${credits.crew.find(c => c.job === 'Director')?.name || 'Inconnu'}</p>
        <p>Acteurs : ${credits.cast.slice(0, 5).map(a => a.name).join(', ') || 'Inconnu'}</p>
        <p>Nationalité : ${nationality}</p>
    `;

    // Afficher les commentaires avec une option de réponse
    displayComments(commentsData, itemId);
    
    // Afficher les recommandations basées sur le genre
    const recommended = await getRecommended(data.genres?.[0]?.id, isSeries);
    document.getElementById("recommended").innerHTML = `
        <p>Si vous avez aimé ${title}, vous aimerez : ${recommended}</p>
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
                <strong>Par: ${c.author || 'Anonyme'}</strong>
                <p>${c.content || 'Pas de contenu.'}</p>
                <div class="replies" id="replies-${i}">
                    ${storedReplies[i] ? `<strong>Réponses :</strong><p>${storedReplies[i]}</p>` : ""}
                </div>
                <button onclick="replyToComment(${i})">Répondre</button>
                <div id="reply-section-${i}" class="reply-section" style="display: none;">
                    <textarea id="reply-input-${i}" placeholder="Votre réponse"></textarea>
                    <button onclick="submitReply(${i}, ${itemId})">Soumettre</button>
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

// Récupérer les identifiants de série et de film depuis l'URL
const serieId = urlParams.get("serie_id");
if (serieId) {
    getDetails('tv', serieId, true);
}

const movieId = urlParams.get("film_id");
if (movieId) {
    getDetails('movie', movieId, false);
}
