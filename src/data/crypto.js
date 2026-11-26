// ─────────────────────────────────────────────────────────────
// Paiement crypto — adresses de dépôt et réglages.
// ⚠️ REMPLACE les trois adresses ci-dessous par les tiennes :
//    c'est le SEUL endroit à modifier. Aux Adresses actuelles,
//    le site affiche une adresse de DÉMONSTRATION.
// ─────────────────────────────────────────────────────────────

export const CRYPTO_CONFIG = {
  demo: true, // passe à false quand tes vraies adresses sont en place
  /** Cours indicatifs utilisés pour convertir le panier en crypto (1 € = …). */
  rates: {
    USDT: 1.0, // 1 € ≈ 1,00 USDT (stablecoin)
    ETH: 0.00032, // 1 € ≈ 0,00032 ETH (indicatif)
    BTC: 0.0000105, // 1 € ≈ 0,0000105 BTC (indicatif)
  },
  /** Délai de confirmation affiché à la cliente. */
  confirmations: '2 à 10 minutes',
}

export const CRYPTO_WALLETS = [
  {
    id: 'usdt',
    symbol: 'USDT',
    name: 'Tether (USDT)',
    network: 'TRC20 · Tron',
    networkHint: 'Frais ≈ 1 USDT · le plus économique',
    address: 'TDemoBeauteParis9xK2mQvL7nR4sT8wYz3AbCd',
    rate: 1,
    icon: 'coin',
    color: '#26A17B',
    decimals: 2,
    minEuro: 1,
  },
  {
    id: 'btc',
    symbol: 'BTC',
    name: 'Bitcoin',
    network: 'Bitcoin (BTC)',
    networkHint: 'Frais réseau variables · 10-30 min',
    address: 'bc1qdemo0beaute0paris0wallet0address0only0example0x9k2m',
    rate: 0.0000105,
    icon: 'coin',
    color: '#F7931A',
    decimals: 8,
    minEuro: 10,
  },
  {
    id: 'eth',
    symbol: 'ETH',
    name: 'Ethereum',
    network: 'ERC20 · Ethereum',
    networkHint: 'Frais réseau variables · 1-5 min',
    address: '0xD3m0BeauteParisW4lletAddr3ss0000000000000000',
    rate: 0.00032,
    icon: 'coin',
    color: '#627EEA',
    decimals: 6,
    minEuro: 10,
  },
]

export const cryptoById = (id) => CRYPTO_WALLETS.find((wallet) => wallet.id === id) ?? null

/** Convertit un montant en euros vers la devise du wallet. */
export const toCryptoAmount = (euros, wallet) => {
  if (!wallet) return 0
  const raw = euros * wallet.rate
  const factor = 10 ** wallet.decimals
  return Math.ceil(raw * factor) / factor
}

/** Formate avec la précision utile (pas de zéros inutiles). */
export const formatCrypto = (amount, wallet) => {
  if (!wallet) return '0'
  const fixed = Number(amount).toFixed(wallet.decimals)
  const trimmed = wallet.decimals <= 2 ? fixed : fixed.replace(/0+$/, '').replace(/\.$/, '')
  return `${trimmed} ${wallet.symbol}`
}

/** Un identifiant de transaction crédible (pour la démonstration). */
export const fakeTxHash = (symbol = 'USDT') =>
  symbol === 'BTC'
    ? Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')
    : `0x${Array.from({ length: 64 }, () =>
        '0123456789abcdef'[Math.floor(Math.random() * 16)],
      ).join('')}`
