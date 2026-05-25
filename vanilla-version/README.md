# Page e‑commerce USH (API WordPress)

Cette petite application front‑end affiche les produits du site [shopushindi.com](https://shopushindi.com/) à l'aide de l'API WooCommerce Store (`/wp-json/wc/store/v1/products`).

## Utilisation

1. Placez tous les fichiers dans un même dossier (`index.html`, `styles.css`, `app.js`).
2. Ouvrez simplement `index.html` dans votre navigateur (double‑clic ou clic droit → *Ouvrir avec* → votre navigateur).
3. La page va :
   - charger les produits depuis `https://shopushindi.com/` ;
   - afficher les cartes produits (image, titre, prix, promo) ;
   - proposer la recherche, le tri et la pagination.

## Remarques techniques

- Cette page utilise l'API WooCommerce **Store** (`wc/store/v1`), qui est publique et ne nécessite pas de clé si elle est activée sur le site WordPress.
- Si aucun produit n'apparaît, vérifiez dans la console du navigateur (F12 → *Console*) s'il y a une erreur CORS ou API désactivée côté WordPress.


