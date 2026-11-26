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

/** Le partage automatique est-il réellement opérationnel ? */
export const splitActive = () =>
  SPLIT.enabled && SPLIT.partnerShare > 0 && SPLIT.provider !== 'none' && SPLIT.providerConnected

/** Détail de la répartition d'un encaissement (affiché au vendeur uniquement). */
export const splitBreakdown = (euros) => {
  const total = Math.round(euros * 100) / 100
  if (!splitActive()) return { total, shared: false, shop: total, partner: 0, fee: 0 }
  const fee = Math.round(total * (SPLIT.providerFee / 100) * 100) / 100
  const partner = Math.round((total - fee) * (SPLIT.partnerShare / 100) * 100) / 100
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

/* 3 · ACCÈS VENDEUR ----------------------------------------- */

/**
 * Clé de l'espace vendeur. Généré une fois, non communiqué sur le site.
 * Pour la changer : remplace cette valeur par ce que tu veux.
 */
export const SELLER_KEY = 'bp-v9K4t-Qz7Lm-Xw2Rc-8Hn5J'

/** Durée de validité d'un code de connexion (minutes). */
export const CODE_TTL_MINUTES = 10
