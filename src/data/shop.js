import baumeImg from '../assets/img/baume.jpg'
import serumRidesImg from '../assets/img/serum-anti-rides.jpg'
import serumTachesImg from '../assets/img/serum-anti-taches.jpg'

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
    rating: 4.8,
    reviews: 412,
    bestseller: true,
    isNew: false,
    stock: 6,
    stockInitial: 40,
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
    rating: 4.7,
    reviews: 268,
    bestseller: true,
    isNew: false,
    lead: true,
    stock: 9,
    stockInitial: 60,
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
    rating: 4.6,
    reviews: 731,
    bestseller: true,
    isNew: false,
    lead: true,
    stock: 12,
    stockInitial: 90,
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

export const brandOf = (product) => BRANDS.find((brand) => brand.id === product.brandId)

/** Prix effectif d'un produit, remise de lancement incluse. */
export const finalPrice = (product) =>
  Math.round(product.price * (1 - FLASH_OFFER.percent / 100) * 100) / 100

/** Niveau d'urgence affiché selon le stock restant. */
export const stockLevel = (product) => {
  if (product.stock <= 5) return { tone: 'critique', label: `Plus que ${product.stock} en stock` }
  if (product.stock <= 10) return { tone: 'faible', label: `Seulement ${product.stock} restants` }
  return { tone: 'ok', label: 'En stock' }
}

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

export const PAYMENT_OFFERS = [
  {
    id: 'card',
    label: 'Carte bancaire',
    note: 'Visa, Mastercard, CB',
    discount: 0,
    icon: 'card',
  },
  {
    id: 'twint',
    label: 'TWINT',
    note: 'Paiement mobile suisse',
    discount: 0,
    icon: 'phone',
  },
  {
    id: 'transfer',
    label: 'Virement bancaire',
    note: '−5 % immédiat sur la commande',
    discount: 5,
    icon: 'bank',
  },
]

export const TESTIMONIALS = [
  {
    quote:
      "J'ai retrouvé mon baume Jeanne Piaubert ici à un prix que je n'avais jamais vu, même en parapharmacie. Livraison en 48 h, tout est parfait.",
    author: 'Sonia M.',
    detail: 'Baume Intégral Anti-Âge Nuit',
  },
  {
    quote:
      'Le sérum Stendhal est mon indispensable depuis des années. Commandé avec le code BIENVENUE10, emballage soigné, échantillons offerts.',
    author: 'Hélène D.',
    detail: 'Sérum Anti-Rides Performance',
  },
  {
    quote:
      'Le sérum anti-taches de Biarritz a réellement calmé mes taches. Le conseil par téléphone avant l’achat a fait la différence.',
    author: 'Awa T.',
    detail: 'Sérum Anti-Taches',
  },
]

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
    q: 'Comment créer mon compte : e-mail ou téléphone ?',
    a: "Les deux fonctionnent. Vous pouvez vous identifier avec votre adresse e-mail ou votre numéro de téléphone : nous vous envoyons un code à 6 chiffres pour sécuriser la connexion — aucun mot de passe à retenir. La connexion est obligatoire pour finaliser une commande, afin de garantir la livraison et le suivi.",
  },
  {
    q: 'Quels sont les délais de livraison ?',
    a: 'Expédition sous 24 h ouvrées. Livraison offerte dès 35 € en France métropolitaine, 3,90 € en dessous. Comptez 2 à 3 jours ouvrés, et 4 à 6 jours pour l’Europe. Un numéro de suivi vous est envoyé par e-mail et par SMS.',
  },
  {
    q: 'Puis-je retourner un produit ?',
    a: "Vous disposez de 30 jours pour changer d'avis. Les produits non ouverts sont remboursés intégralement. En cas d'allergie ou de réaction, contactez-nous : le remboursement est pris en charge, même produit ouvert.",
  },
]
