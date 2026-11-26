// ─────────────────────────────────────────────────────────────
// RÉGLAGES DU SITE — le seul fichier à modifier pour passer en réel.
// Tout ce qui est vide est refusé par le site : aucun paiement ne
// peut partir vers une adresse inventée.
// ─────────────────────────────────────────────────────────────

/* 1 · ADRESSES CRYPTO --------------------------------------- */

export const CRYPTO_WALLETS = [
  {
    id: 'usdt',
    symbol: 'USDT',
    name: 'Tether (USDT)',
    network: 'TRC20 · Tron',
    networkHint: 'Frais ≈ 1 USDT · le plus économique',
    address: '', // ← colle ton adresse USDT (réseau TRC20)
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
    address: '', // ← colle ton adresse Bitcoin
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
    address: '', // ← colle ton adresse Ethereum
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

/** Une devise est utilisable seulement si son adresse est renseignée. */
export const isWalletReady = (wallet) => Boolean(wallet && wallet.address.trim().length > 20)

/** Devises réellement proposées au paiement. */
export const ACTIVE_WALLETS = CRYPTO_WALLETS.filter(isWalletReady)

export const walletsReady = ACTIVE_WALLETS.length > 0

/** Convertit un montant en euros vers la devise du wallet. */
export const toCryptoAmount = (euros, wallet) => {
  if (!wallet) return 0
  const factor = 10 ** wallet.decimals
  return Math.ceil(euros * (CRYPTO_CONFIG.rates[wallet.symbol] ?? 1) * factor) / factor
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
  phone: '01 84 80 12 34',
  address: '12 rue de la Paix, 75002 Paris',
  hours: 'Lun–sam, 9 h–19 h',
}

/* 3 · ACCÈS VENDEUR ----------------------------------------- */

/**
 * Clé de l'espace vendeur. Généré une fois, non communiqué sur le site.
 * Pour la changer : remplace cette valeur par ce que tu veux.
 */
export const SELLER_KEY = 'bp-v9K4t-Qz7Lm-Xw2Rc-8Hn5J'

/** Durée de validité d'un code de connexion (minutes). */
export const CODE_TTL_MINUTES = 10
