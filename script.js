document.addEventListener('DOMContentLoaded', () => {
    // Remplissage initial de la liste des produits
    afficherProduits(produits); 
    // Remplissage initial des options de filtre de catégorie
    remplirOptionsCategories(produits);
});

// Récupération des éléments du DOM
const productList = document.getElementById('product-list');
const categoryFilter = document.getElementById('category-filter');
const searchBar = document.getElementById('search-bar');
const sortPrice = document.getElementById('sort-price');
const priceRange = document.getElementById('price-range');

/**
 * Affiche la liste des produits dans le conteneur principal.
 * @param {Array<Object>} produitsAffiches - Le tableau de produits filtrés et triés.
 */
function afficherProduits(produitsAffiches) {
    productList.innerHTML = ''; // Vide la liste précédente

    if (produitsAffiches.length === 0) {
        productList.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; margin-top: 50px; font-size: 1.2em;">Aucun produit trouvé correspondant à vos critères.</p>';
        return;
    }

    produitsAffiches.forEach(produit => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${produit.image_url}" alt="${produit.nom}" class="product-image">
            <p><strong>${produit.marque}</strong></p>
            <h3>${produit.nom}</h3>
            <p>Catégorie: ${produit.categorie}</p>
            <p class="price">${produit.prix.toFixed(2)} MAD</p>
        `;
        productList.appendChild(card);
    });
}

/**
 * Remplit la liste déroulante des catégories.
 * @param {Array<Object>} allProduits - Le tableau de tous les produits.
 */
function remplirOptionsCategories(allProduits) {
    const categories = new Set();
    allProduits.forEach(p => categories.add(p.categorie));

    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });
}

/**
 * Applique tous les filtres et le tri sur la liste complète des produits.
 */
function appliquerFiltres() {
    let produitsFiltres = [...produits]; // Copie de la liste originale

    // 1. FILTRE PAR RECHERCHE (Nom ou Marque)
    const searchTerm = searchBar.value.toLowerCase();
    if (searchTerm) {
        produitsFiltres = produitsFiltres.filter(p => 
            p.nom.toLowerCase().includes(searchTerm) || 
            p.marque.toLowerCase().includes(searchTerm)
        );
    }

    // 2. FILTRE PAR CATÉGORIE
    const selectedCategory = categoryFilter.value;
    if (selectedCategory !== 'Toutes') {
        produitsFiltres = produitsFiltres.filter(p => p.categorie === selectedCategory);
    }

    // 3. FILTRE PAR PRIX MAXIMUM
    const maxPrice = parseFloat(priceRange.value);
    produitsFiltres = produitsFiltres.filter(p => p.prix <= maxPrice);

    // 4. TRI PAR PRIX
    const sortOrder = sortPrice.value;
    if (sortOrder === 'asc') {
        produitsFiltres.sort((a, b) => a.prix - b.prix);
    } else if (sortOrder === 'desc') {
        produitsFiltres.sort((a, b) => b.prix - a.prix);
    } 
    // 'default' ne fait rien (garde l'ordre par défaut du JSON)

    // 5. AFFICHAGE du résultat
    afficherProduits(produitsFiltres);
}
