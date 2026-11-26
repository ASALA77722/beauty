import baumeImg from '../assets/img/baume.jpg'
import serumRidesImg from '../assets/img/serum-anti-rides.jpg'
import serumTachesImg from '../assets/img/serum-anti-taches.jpg'
import { reviewsForProduct } from './reviews'

// ─────────────────────────────────────────────────────────────
// Catalogue — prix « marché » (constatés en parfumerie) vs prix site.
// Les montants sont en euros, TTC.
// ─────────────────────────────────────────────────────────────

export const BRANDS = [
  { id: 'jeanne-piaubert', name: 'Jeanne Piaubert', note: 'Maison parisienne de soins anti-âge depuis 1936' },
  { id: 'stendhal', name: 'Stendhal', note: "L'expertise française de l'algue Millennium" },
  { id: 'biarritz', name: 'Laboratoires de Biarritz', note: 'Cosmétique marine, 100 % d’origine naturelle' },
]

export const PRODUCTS = [
  {
    id: 'baume-integral-nuit',
    brandId: 'jeanne-piaubert',
    name: 'Baume Intégral Anti-Âge Nuit',
    line: "Suprém'Advance Premium",
    category: 'Soin visage',
    concern: 'Anti-âge',
    volume: '50 ml',
    marketPrice: 219.5,
    price: 95,
    image: baumeImg,
    bestseller: true,
    isNew: false,
    stock: 6,
    description:
      "Le baume de nuit signature de la Méthode Jeanne Piaubert. Sa texture fondante au complexe Suprém'Advance Premium accompagne la peau pendant le sommeil : rides lissées, fermeté retrouvée, teint reposé au réveil.",
    benefits: [
      'Rides et ridules visiblement lissées dès 4 semaines',
      'Fermeté et densité améliorées',
      'Éclat révélé au réveil',
      'Texture baume fondante, fini satiné',
    ],
    usage:
      "Le soir, sur peau propre, appliquer une noisette sur le visage et le cou en massant du centre vers l'extérieur. Éviter le contour des yeux.",
    inci:
      "Aqua, Glycerin, Caprylic/Capric Triglyceride, Butyrospermum Parkii Butter, Cetearyl Alcohol, Squalane, Dimethicone, Tocopherol, Sodium Hyaluronate, Adenosine, Parfum, Phenoxyethanol.",
  },
  {
    id: 'serum-anti-rides',
    brandId: 'stendhal',
    name: 'Sérum Anti-Rides Performance',
    line: 'Recette Merveilleuse',
    category: 'Sérum',
    concern: 'Anti-âge',
    volume: '30 ml',
    marketPrice: 115.5,
    price: 45,
    image: serumRidesImg,
    bestseller: true,
    isNew: false,
    lead: true,
    stock: 9,
    description:
      "Un sérum concentré à l'extrait d'Algue Millennium, l'actif signature de Stendhal. Il cible les rides installées et prévient leur formation, pour une peau repulpée et un galbe redessiné.",
    benefits: [
      "Extrait d'Algue Millennium dosé au plus juste",
      'Rides installées visiblement atténuées',
      'Grain de peau affiné et repulpé',
      'Texture sérum fraîche, pénétration immédiate',
    ],
    usage:
      "Matin et soir, appliquer 3 à 4 gouttes sur le visage et le cou avant la crème habituelle.",
    inci:
      "Aqua, Glycerin, Alcohol Denat., Butylene Glycol, Pentylene Glycol, Algae Extract, Sodium Hyaluronate, Panthenol, Tocopheryl Acetate, Parfum, Phenoxyethanol.",
  },
  {
    id: 'serum-anti-taches',
    brandId: 'biarritz',
    name: 'Sérum Anti-Taches',
    line: 'Dark Spot Serum',
    category: 'Sérum',
    concern: 'Taches',
    volume: '30 ml',
    marketPrice: 38.9,
    price: 15.9,
    image: serumTachesImg,
    bestseller: true,
    isNew: false,
    lead: true,
    stock: 12,
    description:
      "Un sérum 100 % d'origine naturelle qui cible les taches pigmentaires et prévient leur réapparition. Formulé à l'extrait de camomille et à la vitamine C d'origine naturelle, il unifie le teint sans photosensibiliser.",
    benefits: [
      "Action anti-récidive sur les taches",
      "100 % d'ingrédients d'origine naturelle",
      'Convient à tous les types de peau, même sensible',
      'Teint plus uniforme en 8 semaines',
    ],
    usage:
      "Le matin et/ou le soir sur l'ensemble du visage, avant la crème hydratante. Toujours associer une protection solaire le jour.",
    inci:
      "Aqua, Aloe Barbadensis Leaf Juice*, Glycerin, Alcohol Denat.*, Chrysanthemum Parthenium Flower Extract*, Sodium Ascorbyl Phosphate, Niacinamide, Sodium Hyaluronate, Citric Acid, Sodium Benzoate. *Ingrédients issus de l'agriculture biologique.",
  },
]

/** Prix de lancement / offre du moment, appliqué par-dessus le prix site. */
export const FLASH_OFFER = {
  label: 'Prix de lancement',
  percent: 5,
  endsInHours: 72,
  code: 'LANCEMENT5',
}

/** Note et volume d'avis d'un produit, calculés depuis les avis publiés. */
/** Note moyenne réelle d'un produit (aucune valeur inventée). */
export const productRating = (productId) => {
  const list = reviewsForProduct(productId)
  const count = list.length
  const average = count
    ? Math.round((list.reduce((sum, review) => sum + review.rating, 0) / count) * 10) / 10
    : 0
  return { average, count, reliable: count >= 3 }
}

export const brandOf = (product) => BRANDS.find((brand) => brand.id === product.brandId)

/** Prix effectif d'un produit, remise de lancement incluse. */
export const finalPrice = (product) =>
  Math.round(product.price * (1 - FLASH_OFFER.percent / 100) * 100) / 100

/** Disponibilité réelle : en stock ou épuisé (aucun chiffre inventé). */
export const availability = (product) =>
  product.stock > 0
    ? { tone: 'ok', label: 'En stock', detail: 'Expédié sous 24 h ouvrées' }
    : { tone: 'critique', label: 'Épuisé', detail: 'Réapprovisionnement en cours' }

export const LEAD_PRODUCTS = () => PRODUCTS.filter((product) => product.lead)

/** Statistiques de remise, dérivées du catalogue (évite les incohérences de texte). */
export const PRICE_STATS = (() => {
  const offs = PRODUCTS.map((p) => 1 - finalPrice(p) / p.marketPrice)
  const average = Math.round((offs.reduce((a, b) => a + b, 0) / offs.length) * 100)
  const best = Math.round(Math.min(...offs) * 100)
  const worst = Math.round(Math.max(...offs) * 100)
  const averageSaving = Math.round(
    PRODUCTS.reduce((sum, p) => sum + (p.marketPrice - finalPrice(p)), 0) / PRODUCTS.length,
  )
  return { average, best, worst, averageSaving }
})()

export const CATEGORIES = [
  { id: 'all', label: 'Tout' },
  { id: 'Sérum', label: 'Sérums' },
  { id: 'Soin visage', label: 'Soins visage' },
]

export const CONCERNS = ['Tout', 'Anti-âge', 'Taches']

// ─────────────────────────────────────────────────────────────
// Offres automatiques — appliquées d'office dans le panier,
// la plus avantageuse uniquement.
// ─────────────────────────────────────────────────────────────
export const AUTO_OFFERS = [
  {
    id: 'duo',
    label: 'Rituel duo',
    description: '2 produits achetés → −10 % sur le 2ᵉ',
    kind: 'second-unit',
    percent: 10,
    minQty: 2,
  },
  {
    id: 'trio',
    label: 'Rituel complet',
    description: '3 produits et plus → −15 % sur le total',
    kind: 'order',
    percent: 15,
    minQty: 3,
  },
]

// ─────────────────────────────────────────────────────────────
// Codes promotionnels — à cumuler avec le prix site
// ─────────────────────────────────────────────────────────────
export const PROMO_CODES = {
  BIENVENUE10: {
    code: 'BIENVENUE10',
    label: 'Bienvenue chez Beauté',
    type: 'percent',
    value: 10,
    minSubtotal: 0,
    description: '−10 % sur votre première commande, sans minimum.',
  },
  LUXE15: {
    code: 'LUXE15',
    label: 'Offre luxe',
    type: 'percent',
    value: 10,
    minSubtotal: 100,
    description: '−10 % dès 100 € d’achat.',
  },
  LIVRAISON: {
    code: 'LIVRAISON',
    label: 'Livraison offerte',
    type: 'shipping',
    value: 0,
    minSubtotal: 0,
    description: 'Livraison standard offerte.',
  },
}

/** Moyen de paiement unique : la crypto, avec 5 % de remise immédiate. */
export const PAYMENT_METHOD = {
  id: 'crypto',
  label: 'Paiement crypto',
  note: '−5 % immédiat sur la commande',
  discount: 5,
  icon: 'coin',
}


export const FAQ = [
  {
    q: 'Vos produits sont-ils authentiques ?',
    a: "Oui. Tous nos flacons proviennent directement des marques ou de leurs distributeurs agréés, avec traçabilité des lots. Chaque commande est accompagnée de sa facture et de la garantie de fraîcheur. Aucun produit n'est reconditionné.",
  },
  {
    q: 'Pourquoi vos prix sont-ils plus bas qu’en magasin ?',
    a: "Pas de vitrine, pas d'intermédiaire : nous achetons en direct et vendons en ligne. Nous répercutons presque toute la marge dans le prix, d'où des tarifs très inférieurs au prix conseillé en parfumerie. Le prix « marché » barré correspond au prix constaté en magasin.",
  },
  {
    q: 'Comment fonctionnent les offres automatiques ?',
    a: "Elles s'appliquent seules dans le panier, sans code : à partir de 2 produits, −10 % sur le 2ᵉ ; à partir de 3 produits, −15 % sur le total. La remise la plus avantageuse est retenue automatiquement. Les codes promotionnels (BIENVENUE10, LUXE15…) se cumulent avec ces offres.",
  },
  {
    q: 'Comment créer mon compte ?',
    a: "Avec votre adresse e-mail : nous y envoyons un code à 6 chiffres, valable 10 minutes, à saisir pour ouvrir votre espace. Aucun mot de passe à retenir. Votre téléphone est demandé plus tard, au moment de la commande, uniquement pour que le transporteur puisse vous prévenir.",
  },
  {
    q: 'Comment payer en crypto ?',
    a: "Choisissez votre devise au moment de la commande : USDT (réseau TRC20 / Tron, le plus économique), Bitcoin ou Ethereum. Le montant exact à envoyer est calculé et affiché à l’euro près, avec l’adresse de dépôt à copier. Envoyez la somme en une seule transaction sur le réseau indiqué, puis collez le hash de transaction dans le champ prévu : votre commande est vérifiée et préparée immédiatement après confirmation (2 à 10 minutes). Le paiement crypto donne droit à 5 % de remise automatique.",
  },
  {
    q: 'Point relais ou livraison à domicile ?',
    a: "Les deux sont disponibles, sans surcoût. Pour le point relais, tapez votre code postal : la liste des commerces du secteur s’affiche avec adresse et horaires, et vous pouvez aussi saisir vous-même le relais de votre choix. Le colis vous attend 8 jours, avec une pièce d’identité et le code de retrait. L’emballage est neutre, sans mention de beauté ni de parfum.",
  },
  {
    q: 'Comment suivre ma commande et joindre la boutique ?',
    a: "Chaque commande reçoit une référence du type BP-261126-1242. Ouvrez « Suivre ma commande » (ou l’adresse du site suivie de #suivi/référence) pour voir le statut en temps réel, l’adresse de livraison et la messagerie privée avec la boutique. Vous pouvez écrire à tout moment : la réponse apparaît dans ce même fil.",
  },
  {
    q: 'Quels sont les délais de livraison ?',
    a: 'Expédition sous 24 h ouvrées. Livraison offerte dès 35 € en France métropolitaine, 3,90 € en dessous. Comptez 2 à 3 jours ouvrés, et 4 à 6 jours pour l’Europe. Un numéro de suivi vous est communiqué par e-mail et dans la messagerie de votre commande.',
  },
  {
    q: 'Puis-je retourner un produit ?',
    a: "Vous disposez de 30 jours pour changer d'avis. Les produits non ouverts sont remboursés intégralement. En cas d'allergie ou de réaction, contactez-nous : le remboursement est pris en charge, même produit ouvert.",
  },
]
