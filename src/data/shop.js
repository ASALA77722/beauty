export const PRODUCTS = [
  {
    id: 'serum-eclat',
    name: 'Sérum Éclat',
    subtitle: 'Vitamine C & argousier',
    price: 48,
    image: '/img/p1.jpg',
    category: 'Visage',
    volume: '30 ml',
    rating: 4.9,
    reviews: 214,
    tag: 'Best-seller',
    description:
      "Un sérum léger à la vitamine C stabilisée et à l'huile d'argousier, qui ravive l'éclat des peaux fatiguées et unifie le teint dès quatre semaines.",
    details: [
      'Vitamine C stabilisée à 8 %',
      "Huile d'argousier bio pressée à froid",
      'Texture fluide, fini non gras',
      "98,7 % d'ingrédients d'origine naturelle",
    ],
    skin: ['Teint terne', 'Taches', 'Toutes peaux'],
    inci:
      "Aqua, Rosa damascena flower water*, Hippophae rhamnoides fruit oil*, Glycerin*, Sodium ascorbyl phosphate, Squalane, Cetearyl olivate, Sorbitan olivate, Tocopherol, Helianthus annuus seed oil*, Sodium hyaluronate, Citric acid, Sodium benzoate, Potassium sorbate. *Ingrédients issus de l'agriculture biologique.",
  },
  {
    id: 'creme-nuit',
    name: 'Crème de Nuit',
    subtitle: 'Bakuchiol & beurre de karité',
    price: 56,
    image: '/img/p2.jpg',
    category: 'Visage',
    volume: '50 ml',
    rating: 4.8,
    reviews: 168,
    tag: null,
    description:
      'Une crème fondante au bakuchiol, alternative végétale au rétinol, qui accompagne la peau pendant la nuit pour une texture lissée au réveil.',
    details: [
      'Bakuchiol 1 % — alternative végétale au rétinol',
      'Beurre de karité non raffiné',
      'Riche en omégas 6 et 9',
      'Sans parfum ajouté',
    ],
    skin: ['Peaux sèches', 'Premières rides', 'Sensibles'],
    inci:
      "Aqua, Butyrospermum parkii butter*, Glycerin*, Bakuchiol, Coco-caprylate, Cetearyl alcohol, Cetearyl glucoside, Prunus amygdalus dulcis oil*, Squalane, Tocopherol, Xanthan gum, Sodium benzoate, Potassium sorbate, Citric acid. *Ingrédients issus de l'agriculture biologique.",
  },
  {
    id: 'huile-rose',
    name: 'Huile Précieuse',
    subtitle: 'Rose musquée & figue de Barbarie',
    price: 62,
    image: '/img/p3.jpg',
    category: 'Visage',
    volume: '30 ml',
    rating: 4.9,
    reviews: 302,
    tag: 'Édition limitée',
    description:
      "Sept huiles botaniques pressées à froid qui nourrissent, réparent et laissent un voile de satiné. Quelques gouttes suffisent, le matin ou le soir.",
    details: [
      'Rose musquée du Chili bio',
      'Figue de Barbarie du Maroc',
      'Flacon en verre teinté rechargeable',
      'Sans silicone ni huile minérale',
    ],
    skin: ['Peaux sèches', 'Éclat', 'Toutes peaux'],
    inci:
      "Rosa canina fruit oil*, Opuntia ficus-indica seed oil*, Argania spinosa kernel oil*, Prunus armeniaca kernel oil*, Simmondsia chinensis seed oil*, Squalane, Tocopherol, Helianthus annuus seed oil*. *Ingrédients issus de l'agriculture biologique.",
  },
  {
    id: 'gel-nettoyant',
    name: 'Gel Douceur',
    subtitle: 'Aloe vera & camomille',
    price: 28,
    image: '/img/p4.jpg',
    category: 'Visage',
    volume: '200 ml',
    rating: 4.7,
    reviews: 421,
    tag: null,
    description:
      "Un gel nettoyant sans savon qui élimine les impuretés sans décaper la barrière cutanée. La peau est nette, souple et confortable.",
    details: [
      'Aloe vera bio à 32 %',
      'Camomille matricaire apaisante',
      'pH physiologique 5,5',
      'Testé sous contrôle dermatologique',
    ],
    skin: ['Peaux mixtes', 'Sensibles', 'Toutes peaux'],
    inci:
      "Aqua, Aloe barbadensis leaf juice*, Coco-glucoside, Glycerin*, Chamomilla recutita flower extract*, Sodium cocoyl glutamate, Glyceryl oleate, Panthenol, Citric acid, Sodium benzoate, Potassium sorbate. *Ingrédients issus de l'agriculture biologique.",
  },
  {
    id: 'beurre-corps',
    name: 'Beurre de Corps',
    subtitle: 'Karité brut & lavande',
    price: 34,
    image: '/img/p5.jpg',
    category: 'Corps',
    volume: '180 ml',
    rating: 4.8,
    reviews: 96,
    tag: 'Nouveau',
    description:
      "Un baume riche en karité brut et en cire d'abeille, parfumé à la lavande de Provence. Il enveloppe les peaux sèches d'un cocon durable.",
    details: [
      'Karité brut du Ghana',
      'Lavande fine de Provence',
      "Pot en terre cuite réutilisable",
      'Texture baume fondante',
    ],
    skin: ['Peaux très sèches', 'Corps'],
    inci:
      "Butyrospermum parkii butter*, Cocos nucifera oil*, Cera alba*, Lavandula angustifolia oil*, Prunus amygdalus dulcis oil*, Tocopherol, Helianthus annuus seed oil*, Linalool**, Limonene**. *Bio. **Présents naturellement dans l'huile essentielle.",
  },
  {
    id: 'brume-eclat',
    name: 'Brume Éclat',
    subtitle: 'Eau de rose & hibiscus',
    price: 24,
    image: '/img/p6.jpg',
    category: 'Visage',
    volume: '100 ml',
    rating: 4.6,
    reviews: 137,
    tag: null,
    description:
      "Une brume fine à l'eau de rose distillée et aux acides de fruits d'hibiscus, à vaporiser à tout moment pour réveiller le teint et fixer le maquillage.",
    details: [
      'Eau de rose de Damas distillée',
      'Acides de fruits d’hibiscus',
      'Sans alcool dénaturé',
      'Vaporisateur rechargeable',
    ],
    skin: ['Toutes peaux', 'Teint terne'],
    inci:
      "Rosa damascena flower water*, Aqua, Hibiscus sabdariffa flower extract*, Glycerin*, Sodium PCA, Panthenol, Sodium benzoate, Potassium sorbate, Citric acid. *Ingrédients issus de l'agriculture biologique.",
  },
  {
    id: 'savon-botanique',
    name: 'Savon Botanique',
    subtitle: 'Avoine & miel',
    price: 16,
    image: '/img/p7.jpg',
    category: 'Corps',
    volume: '100 g',
    rating: 4.7,
    reviews: 64,
    tag: null,
    description:
      "Saponifié à froid, ce savon à l'avoine colloïdale et au miel adoucit les peaux les plus sensibles. Une mousse crémeuse, un parfum de céréales douces.",
    details: [
      'Saponification à froid',
      'Avoine colloïdale bio',
      'Miel de châtaignier',
      'Zéro emballage plastique',
    ],
    skin: ['Peaux sensibles', 'Corps'],
    inci:
      "Sodium olivate*, Sodium cocoate*, Aqua, Avena sativa kernel flour*, Mel*, Glycerin*, Lavandula angustifolia oil*, Tocopherol. *Ingrédients issus de l'agriculture biologique.",
  },
]

export const CATEGORIES = [
  { id: 'all', label: 'Tout' },
  { id: 'Visage', label: 'Visage' },
  { id: 'Corps', label: 'Corps' },
]

export const TESTIMONIALS = [
  {
    quote:
      "Le Sérum Éclat a changé ma routine. Trois semaines et mon teint est visiblement plus lumineux, sans aucune irritation.",
    author: 'Camille R.',
    detail: 'Sérum Éclat · Paris',
  },
  {
    quote:
      "Enfin une marque qui explique ce qu'elle met dans ses flacons. La Crème de Nuit est devenue mon rituel du soir.",
    author: 'Inès B.',
    detail: 'Crème de Nuit · Lyon',
  },
  {
    quote:
      "L'Huile Précieuse sent divinement bon et ne laisse pas de film gras. Le packaging en verre est superbe.",
    author: 'Julie M.',
    detail: 'Huile Précieuse · Bordeaux',
  },
]

export const FAQ = [
  {
    q: 'Vos produits conviennent-ils aux peaux sensibles ?',
    a: "Toutes nos formules sont testées sous contrôle dermatologique et pensées pour les peaux réactives : sans parfum ajouté lorsque c'est possible, sans alcool dénaturé, sans huile essentielle agressive. En cas de doute, commencez par un test sur l'avant-bras pendant 48 heures.",
  },
  {
    q: 'Quels sont les délais et frais de livraison ?',
    a: 'Expédition sous 24 h ouvrées depuis notre atelier de Grasse. Livraison offerte dès 60 € en France métropolitaine, 4,90 € en dessous. Comptez 2 à 3 jours ouvrés, et 4 à 6 jours pour l’Europe.',
  },
  {
    q: 'Vos emballages sont-ils recyclables ?',
    a: "Nos flacons sont en verre teinté, rechargeables ou recyclables à l'infini. Les pots sont en terre cuite et en verre. Les cartons sont en fibre recyclée non blanchie, imprimés à l'encre végétale. Nous ne vendons aucun produit dans du plastique vierge.",
  },
  {
    q: 'Puis-je retourner un produit ?',
    a: 'Vous disposez de 30 jours pour changer d’avis. Les produits non ouverts sont remboursés intégralement, et nous garantissons aussi le remboursement des produits ouverts s’ils ne conviennent pas à votre peau.',
  },
  {
    q: 'Vos produits sont-ils testés sur les animaux ?',
    a: "Jamais. Depuis 2019, Maison Lumière est certifiée sans cruauté par Leaping Bunny. Nos formules sont exclusivement testées sur des volontaires humains rémunérés, dans des laboratoires indépendants français.",
  },
]

export const PROMISES = [
  {
    title: 'Formules courtes',
    text: "12 ingrédients en moyenne, tous listés en clair sur nos flacons. Ce qui n'est pas utile n'entre pas.",
  },
  {
    title: 'Fabriqué à Grasse',
    text: 'Formulé, testé et conditionné dans notre atelier familial des Alpes-Maritimes.',
  },
  {
    title: 'Sans compromis',
    text: 'Certifiée bio par Ecocert, vegan et sans cruauté animale. Des emballages rechargeables.',
  },
]
