// Fonction pour récupérer les données de l'API
async function fetchApi(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données de l\'API :', error);
        return null;
    }
}



// Appeler la fonction principale
