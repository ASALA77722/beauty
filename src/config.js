// ─────────────────────────────────────────────────────────────
// RÉGLAGES DU SITE — le seul fichier à modifier pour passer en réel.
// Tout ce qui est vide est refusé par le site : aucun paiement ne
// peut partir vers une adresse inventée.
// ─────────────────────────────────────────────────────────────

/* 1 · ENCAISSEMENT ET RÉPARTITION ---------------------------- */

/**
 * MODE A — caisse unique (par défaut).
 * La cliente paie sur UNE adresse (la tienne). Ta part et celle de ton associé
 * sont ensuite réparties automatiquement par le service que tu connectes
 * (NOWPayments / Binance Pay) : voir `SPLIT` plus bas.
 */
export const COLLECTION = {
  /** Adresse unique de réception, par devise. Vide = devise proposée au paiement
   *  dès qu'au moins une adresse est renseignée pour elle. */
  addresses: {
    usdt: '', // ← TRC20 · Tron
    btc: '',
    eth: '',
  },
}

/**
 * Répartition automatique vers un associé, exprimée en pourcentage.
 * 0 = pas de partage : tout reste sur la caisse de la boutique.
 * La caisse est TOUJOURS l'adresse affichée à la cliente ; l'associé est payé
 * ensuite, hors site, par le service connecté (il ne voit jamais son adresse).
 */
export const SPLIT = {
  enabled: false,
  partnerShare: 0, // ex. 50 → l'associé reçoit 50 % net
  partnerLabel: 'Associé',
  /**
   * Adresse de ton associé : sert UNIQUEMENT à préparer le virement côté
   * vendeur (bouton « copier » dans l'espace de gestion). Elle n'est jamais
   * affichée à la cliente ni incluse dans le site public.
   */
  partnerAddress: '',
  /**
   * Sur quelle page de paiement la cliente règle ('shop' ou 'partner').
   * Le montant demandé reste le total : la répartition est faite par le
   * prestataire, ou par toi depuis #vendeur.
   */
  linkMode: 'shop',
  /** S'applique-t-il aux commandes, aux dons, ou aux deux ? */
  scope: { orders: true, donations: true },
  /**
   * Part du partenaire sur les DONS, en %. Distincte des ventes : sur un don,
   * une part prélevée est contestable — la convention dite « donation sharing »
   * de Google Ad Grants l'interdit explicitement. 0 par défaut.
   */
  donationShare: 0,
  /**
   * Service qui fait le partage à ta place. Aucun ne se configure depuis le
   * navigateur : la clé API reste côté serveur, jamais dans ce fichier.
   *  - 'none'        : virement manuel depuis ton portefeuille
   *  - 'nowpayments' : API payouts (partage automatique 50/50)
   *  - 'binancepay'  : Binance Pay (transferts internes instantanés et gratuits)
   */
  provider: 'none',
  /** État de connexion du service (renseigné une fois la clé installée en serveur). */
  providerConnected: false,
  /** Frais estimés du service, en % du montant encaissé. */
  providerFee: 0,
}

/* 2 · DEVISES PROPOSÉES -------------------------------------- */

export const CRYPTO_WALLETS = [
  {
    id: 'usdt',
    symbol: 'USDT',
    name: 'Tether (USDT)',
    network: 'TRC20 · Tron',
    networkHint: 'Frais ≈ 1 USDT · le plus économique',
    decimals: 2,
    color: '#26A17B',
    era: '₮',
  },
  {
    id: 'btc',
    symbol: 'BTC',
    name: 'Bitcoin',
    network: 'Bitcoin (BTC)',
    networkHint: 'Frais réseau variables · 10-30 min',
    decimals: 8,
    color: '#F7931A',
    era: '₿',
  },
  {
    id: 'eth',
    symbol: 'ETH',
    name: 'Ethereum',
    network: 'ERC20 · Ethereum',
    networkHint: 'Frais réseau variables · 1-5 min',
    decimals: 6,
    color: '#627EEA',
    era: 'Ξ',
  },
]

export const CRYPTO_CONFIG = {
  /** Délai de confirmation annoncé à la cliente. */
  confirmations: '2 à 10 minutes',
  /** Cours de conversion indicatifs (1 € = …). Mis à jour à la main. */
  rates: { USDT: 1, BTC: 0.0000105, ETH: 0.00032 },
}

export const cryptoById = (id) => CRYPTO_WALLETS.find((wallet) => wallet.id === id) ?? null

const isAddressFilled = (address) => (address ?? '').trim().length > 20

/** Vérifie qu'une devise a bien une adresse de caisse renseignée. */
export const isWalletFilled = (id) => isAddressFilled(COLLECTION.addresses[id])

/** La devise est utilisable dès qu'une adresse de caisse est renseignée. */
export const isWalletReady = (wallet) => isAddressFilled(COLLECTION.addresses[wallet?.id])

/** Adresse unique affichée à la cliente. */
export const walletAddress = (wallet) => (COLLECTION.addresses[wallet?.id] ?? '').trim()

/** Devises réellement proposées au paiement. */
export const ACTIVE_WALLETS = CRYPTO_WALLETS.filter(isWalletReady)

export const walletsReady = ACTIVE_WALLETS.length > 0

/** Convertit un montant en euros vers la devise du wallet. */
export const toCryptoAmount = (euros, wallet) => {
  if (!wallet) return 0
  const factor = 10 ** wallet.decimals
  return Math.ceil(euros * (CRYPTO_CONFIG.rates[wallet.symbol] ?? 1) * factor) / factor
}

/** Le partage est-il demandé pour un type d'encaissement ? */
export const splitActive = (kind = 'orders') =>
  SPLIT.enabled &&
  SPLIT.scope?.[kind] !== false &&
  (kind === 'donations' ? SPLIT.donationShare : SPLIT.partnerShare) > 0

/**
 * Lien qui prépare le virement de la part de l'associé depuis un portefeuille.
 * Rien n'est envoyé automatiquement : le vendeur clique, vérifie, signe.
 * 0 partie automatique n'est possible sans service de payout connecté.
 */
export const partnerPayout = (amount, wallet) => {
  if (!wallet || !SPLIT.partnerAddress || !(amount > 0)) return null
  const value = Number(amount).toFixed(wallet.decimals)
  if (wallet.id === 'eth') {
    return `ethereum:${SPLIT.partnerAddress}?value=${Math.round(amount * 1e18)}`
  }
  if (wallet.id === 'btc') {
    return `bitcoin:${SPLIT.partnerAddress}?amount=${value}`
  }
  // Tron : ouverture du portefeuille sur l'adresse de destination
  return `https://tronscan.org/#/address/${SPLIT.partnerAddress}`
}

/** Détail de la répartition d'un encaissement (affiché au vendeur uniquement). */
export const splitBreakdown = (euros, kind = 'orders') => {
  const total = Math.round(euros * 100) / 100
  if (!splitActive(kind)) return { total, shared: false, shop: total, partner: 0, fee: 0 }
  const share = kind === 'donations' ? SPLIT.donationShare : SPLIT.partnerShare
  const fee = Math.round(total * (PAYOUT.fee / 100) * 100) / 100
  const partner = Math.round((total - fee) * (share / 100) * 100) / 100
  return {
    total,
    shared: true,
    fee,
    partner,
    shop: Math.round((total - fee - partner) * 100) / 100,
  }
}

/** Formate avec la précision utile (pas de zéros inutiles). */
export const formatCrypto = (amount, wallet) => {
  if (!wallet) return '0'
  const fixed = Number(amount).toFixed(wallet.decimals)
  const trimmed =
    wallet.decimals <= 2 ? fixed : fixed.replace(/0+$/, '').replace(/\.$/, '')
  return `${trimmed} ${wallet.symbol}`
}

/* 2 · CONTACT DE LA BOUTIQUE -------------------------------- */

export const SHOP = {
  name: 'Beauté Paris',
  /** Adresse de service : contact client ET envoi du code de connexion. */
  email: 'beaute.paris@proton.me',
  authEmail: 'beaute.paris@proton.me',
  /** Laisse vide ce que tu n'as pas : le site n'affiche rien plutôt qu'un faux numéro. */
  phone: '',
  address: '',
  hours: 'Réponse par e-mail sous 24 h ouvrées',
}

/**
 * Encaissement par lien de paiement : la cliente ne voit JAMAIS d'adresse.
 * Elle clique, le prestataire affiche « Payez à Beauté Paris ».
 *
 * DEUX LIENS POSSIBLES (un par bénéficiaire). Le site n'en affiche qu'UN seul
 * au moment du paiement : quelle que soit la façon dont le prestataire répartit,
 * la part de chacun est calculée sur le montant total et suivie dans l'espace
 * vendeur (chaque bénéficiaire reçoit « sa » page de paiement, le montant total).
 * Aucun des deux liens n'est affiché en clair : seul le bouton est visible.
 *
 * Modes de présentation (SPLIT.linkMode) :
 *  - 'shop'    : la cliente règle tout sur la page de la boutique. Le prestataire
 *                reverse ensuite la part de l'associé (automatique s'il le fait,
 *                sinon virement guidé depuis #vendeur).
 *  - 'partner' : idem, mais sur la page de l'associé.
 */
export const PAYOUT = {
  /** 'none' = aucun lien renseigné : aucune coordonnée affichée, renvoi vers le contact. */
  provider: 'none', // 'nowpayments' | 'binancepay' | 'coingate'
  /** Lien de la boutique (ta part). {amount} et {currency} sont remplacés. */
  shopLink: '',
  /** Lien de ton associé. */
  partnerLink: '',
  /** Libellé du bouton affiché à la cliente. */
  label: 'Payer en ligne',
  /** Frais estimés du prestataire, en % (affiché au vendeur). */
  fee: 0.5,
}

/** Lien utilisable pour un bénéficiaire ('shop' | 'partner'). */
export const linkFor = (payee, amount) => {
  const raw = payee === 'partner' ? PAYOUT.partnerLink : PAYOUT.shopLink
  if (!raw || !raw.trim()) return ''
  return raw
    .replace('{amount}', Number(amount ?? 0).toFixed(2))
    .replace('{currency}', 'eur')
}

/** Le lien réellement proposé à la cliente (selon le mode de partage). */
export const payoutLink = (amount) =>
  linkFor(SPLIT.enabled && SPLIT.linkMode === 'partner' ? 'partner' : 'shop', amount)

/** Au moins un lien est-il prêt ? */
export const payoutReady = () => Boolean(linkFor('shop', 0) || linkFor('partner', 0))

/* 2 bis · DONS ---------------------------------------------- */

/**
 * Les dons ne sont proposés QUE si un projet réel est décrit ET que la
 * réception est activée. Aucun reçu fiscal n'est promis : une boutique ne
 * peut pas en délivrer, seul un organisme habilité le peut.
 */
export const DONATIONS = {
  enabled: false,
  /** Nom réel du projet / de l'association soutenue. Vide = section masquée. */
  projectName: '',
  /** Ce que l'argent finance, en une phrase vraie et vérifiable. */
  purpose: '',
  /** Lien public : comptes publiés, page de l'association, etc. Vide = masqué. */
  transparencyUrl: '',
  /** Devise d'encaissement : 'usdt' (TRC20, frais ≈ 1 USDT). */
  currency: 'usdt',
  /** Montants suggérés, en euros. */
  presets: [5, 10, 25, 50],
  /** Reçu fiscal possible ? false tant qu'aucun organisme habilité n'est partenaire. */
  taxReceipt: false,
}

/** Les dons peuvent-ils être affichés et encaissés ? */
export const donationsReady = () =>
  DONATIONS.enabled && Boolean(DONATIONS.projectName.trim()) && isWalletFilled(DONATIONS.currency)

/**
 * Versement d'un don : à réaliser dans les 30 jours, puis marqué dans l'espace
 * vendeur. Sert de preuve de sérieux, jamais de promesse de reçu fiscal.
 */
export const DONATION_COMMITMENT = 'Versement effectué sous 30 jours, justificatif sur demande.'

/* 2 ter · IDENTITÉ LÉGALE ET INTERMÉDIAIRES ------------------ */

/**
 * Ce qui est publié dans les pages légales. Laisser vide = la mention est
 * affichée comme « non renseignée », jamais remplacée par une valeur inventée.
 */
export const LEGAL = {
  editorName: 'Beauté Paris',
  /** Statut réel. 'non_immatricule' = activité non enregistrée (à régulariser). */
  status: 'non_immatricule', // 'micro' | 'sasu' | 'association' | 'non_immatricule'
  siret: '',
  /** Adresse professionnelle publiée. Vide → « adresse communiquée sur demande ». */
  address: '',
  vat: 'franchise', // 'franchise' | 'assujettie'
  publisher: '', // nom de la personne responsable de la publication
  /** Hébergeur réel du site. */
  host: { name: 'GitHub, Inc.', address: '88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis' },
  /**
   * Prestataire de paiement crypto. 'none' tant qu'aucun service n'est signé :
   * les CGV disent alors que le paiement est vérifié par la boutique elle-même.
   */
  paymentProcessor: { id: 'none', name: '' }, // 'nowpayments' | 'binancepay'
  /** Notification des commandes : Discord (automatique) ou e-mail (manuel). */
  orderChannel: 'email', // 'discord' | 'email'
  /** Médiateur de la consommation : obligatoire, à adhérer (≈ 30 €/an). */
  mediator: { name: '', url: '' },
  /** Assurance responsabilité civile professionnelle, si souscrite. */
  insurance: '',
}

/** Le statut est-il en règle ? (droit de vendre durablement) */
export const sellingLegal = () => LEGAL.status !== 'non_immatricule' && LEGAL.siret.trim().length > 0

/* 3 · ACCÈS VENDEUR ----------------------------------------- */

/**
 * Clé de l'espace vendeur. Généré une fois, non communiqué sur le site.
 * Pour la changer : remplace cette valeur par ce que tu veux.
 */
export const SELLER_KEY = 'bp-v9K4t-Qz7Lm-Xw2Rc-8Hn5J'

/** Durée de validité d'un code de connexion (minutes). */
export const CODE_TTL_MINUTES = 10
