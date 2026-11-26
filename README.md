# Maison Lumière — boutique de cosmétiques naturels

Site e-commerce vitrine (français) pour une marque fictive de soins naturels fabriqués à Grasse.
Construit avec **React 18 + Vite + Tailwind CSS**, sans backend : le panier est persisté dans le
`localStorage`.

![aperçu](public/img/hero.jpg)

## Démarrer

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de production dans dist/
npm run preview  # sert le build
```

## Ce qui est inclus

- **Hero éditorial** avec visuel produit et bandeau défilant (signaux de confiance).
- **Catalogue de 7 soins** : filtres par catégorie (Visage / Corps), tri (sélection, prix, notes).
- **Fiche produit en modale** : description, actifs, bénéfices, composition INCI dépliable,
  sélecteur de quantité.
- **Panier coulissant** : ajout/suppression, quantités, sous-total, frais de port et jauge
  « livraison offerte dès 60 € », persistance `localStorage`.
- **Toast** de confirmation d'ajout + bouton « Voir » qui ouvre le panier.
- **Sections** : engagements, la maison, rituel en 3 étapes (ajout du trio), transparence des
  ingrédients, avis clients, FAQ en accordéon, newsletter avec validation.
- **Accessibilité** : navigation clavier, `aria-*` sur les contrôles, lien d'évitement, focus visible,
  respect de `prefers-reduced-motion`.
- **Responsive** de 320 px à 1440 px, menu mobile plein écran.

## Structure

```
src/
  App.jsx                 assemblage des sections + toast
  data/shop.js            produits, avis, FAQ, engagements (source de vérité du contenu)
  hooks/useCart.jsx       contexte panier (ajout, quantités, totaux, frais de port)
  hooks/useReveal.js      apparitions au scroll, barre de nav, verrou de scroll
  lib/format.js           formatage €, constantes livraison, lecture/écriture du panier
  components/             Navbar, Hero, Shop, ProductCard, ProductModal, CartDrawer,
                          Ritual, Story, Ingredients, Testimonials, Faq, Newsletter, Footer
public/img/               visuels produits et éditoriaux (générés pour ce projet)
```

## Personnalisation rapide

- **Produits / prix / textes** : tout est dans `src/data/shop.js`.
- **Couleurs et typographies** : `tailwind.config.js` (`ivory`, `sand`, `clay`, `ink`, `sage`) et
  polices Cormorant Garamond + Jost chargées dans `index.html`.
- **Seuil de livraison offerte** : `FREE_SHIPPING_THRESHOLD` dans `src/lib/format.js`.
- **Paiement réel** : brancher Stripe Checkout sur le bouton « Passer commande »
  (`src/components/CartDrawer.jsx`) et remplacer `addItem`/`clear` par des appels API.
