# Beauté Paris — parfumerie beauté en ligne

Boutique e-commerce (français) de soins de parfumerie multimarques : **Jeanne Piaubert**,
**Stendhal**, **Laboratoires de Biarritz**. Prix « marché » barrés, offres automatiques,
codes promo, compte client par **e-mail ou téléphone** et tunnel de commande complet.

Stack : **React 18 + Vite + Tailwind CSS**, sans backend (panier, compte et commandes
persistés dans le `localStorage`).

![aperçu](public/img/hero-luxe.jpg)

## Démarrer

```bash
npm install
npm run dev         # http://localhost:5173
npm run build       # build de production dans dist/
npm run build:file  # fichier HTML unique autonome dans dist-file/
npm run preview      # sert le build
```

### Version autonome (aucun serveur, aucun réseau)

`Beauté-Paris.html` à la racine est le site complet dans **un seul fichier** :

- CSS, JavaScript, **images** (data URI) et **polices** (sous-ensemble latin) intégrés ;
- zéro requête externe — vérifié : aucune URL `http(s)` ni `url()` non-`data:` ;
- s'ouvre par double-clic, fonctionne hors connexion, se partage par e-mail ou clé USB ;
- généré par `npm run build:file` (plugin `vite-plugin-singlefile`).

## Catalogue et positionnement prix

| Produit | Marque | Prix magasin | Prix site | Remise |
| --- | --- | --- | --- | --- |
| Baume Intégral Anti-Âge Nuit 50 ml | Jeanne Piaubert | 219,50 € | **95 €** | −57 % |
| Sérum Anti-Rides Performance 30 ml *appel* | Stendhal | 115,50 € | **45 €** | −61 % |
| Sérum Anti-Taches 30 ml *appel* | Biarritz | 38,90 € | **15,90 €** | −59 % |
| Contour des Yeux Anti-Âge 15 ml | Jeanne Piaubert | 111,50 € | **48 €** | −57 % |

Le prix affiché en boutique inclut ensuite le **prix de lancement −5 %** (`FLASH_OFFER`),
soit **−59 à −63 % par rapport au prix magasin**. Tous les montants se pilotent depuis
`src/data/shop.js` ; les pourcentages affichés dans les textes sont dérivés du catalogue
(`PRICE_STATS`), donc jamais incohérents.

Coût d'achat des produits : 0 € — d'où la marge possible sur ces prix.

## Mécaniques commerciales

- **Offres automatiques** (`AUTO_OFFERS`), la plus avantageuse est retenue :
  - dès 2 produits → −10 % sur le 2ᵉ article ;
  - dès 3 produits → −15 % sur le total.
- **Codes promo cumulables** (`PROMO_CODES`) : `BIENVENUE10` (−10 %), `LUXE15`
  (−10 % dès 100 €), `LIVRAISON` (port offert).
- **Remise moyen de paiement** : −5 % par virement bancaire (`PAYMENT_OFFERS`).
- **Livraison offerte dès 35 €** (`FREE_SHIPPING_THRESHOLD`), 3,90 € en dessous.
- Chaque récapitulatif affiche l'économie réalisée (prix magasin + remises).

## Urgence et produits d'appel

- **Produits d'appel** (`lead: true`) : les deux sérums vendus sous le prix psychologique
  (15,90 € et 45 €), mis en avant par un bandeau dédié (`LeadBanner`) juste sous le hero.
- **Stocks limités visibles** : chaque fiche affiche une jauge `StockMeter` calculée sur
  `stock` / `stockInitial`, avec 3 tons (`Plus que N`, `Seulement N restants`, `En stock`).
- **Réservation de panier** : à chaque ajout, un compte à rebours de 15 min (`ReserveTimer`)
  rappelle que prix et stocks sont bloqués, et passe en rouge dans les 2 dernières minutes.

## Compte client (e-mail **ou** téléphone)

`src/hooks/useAuth.jsx` gère un parcours en 3 étapes, sans mot de passe :

1. l'utilisateur saisit un e-mail *ou* un téléphone (détection et normalisation automatiques :
   `06…` → `+336…`, `+41…`, `00…`) ;
2. un **code à 6 chiffres** est généré (affiché à l'écran en mode démo) ;
3. nouvelle cliente → prénom/nom + téléphone de suivi.

**La commande exige une connexion** : le bouton du panier devient « Se connecter et commander »
et enchaîne automatiquement sur le paiement après authentification.

## Structure

```
src/
  App.jsx                  assemblage des sections, modales, toasts
  data/shop.js             produits, marques, offres, codes promo, avis, FAQ
  lib/pricing.js           moteur de remises (offres auto + promo + paiement + port)
  lib/format.js            € formaté, seuils, validation e-mail / téléphone
  hooks/useCart.jsx        panier (quantités, codes, moyen de paiement, totaux)
  hooks/useAuth.jsx        compte client (code 6 chiffres, profil, requireAuth)
  hooks/useReveal.js       animations au scroll, nav, verrou de scroll
  components/              Navbar, Hero, Shop, ProductCard, ProductModal, CartDrawer,
                           CheckoutModal, AuthModal, Offers, Brands, Story,
                           Testimonials, Faq, Newsletter, Footer, TrustBar, Marquee
public/img/                packshots retravaillés en studio + visuel d'accueil
```

## Notes

- Les visuels produits ont été reconstruits en packshot studio (fond ivoire, ombre douce) à
  partir des photos fournies du Baume Jeanne Piaubert, du Sérum Stendhal et du Sérum Biarritz.
- Aucun paiement réel : valider la commande crée une référence `BP-…` et un historique local.
  Pour la production, brancher Stripe Checkout dans `CheckoutModal.jsx` (`placeOrder`) et remplacer
  `requestCode` / `verifyCode` par un envoi d'e-mail (Resend, Postmark) ou de SMS (Twilio).
- Textes, prix et remises sont fictifs et fournis à titre de démonstration commerciale.
