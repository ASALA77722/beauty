/**
 * Crée la structure du serveur Discord « Beauté Paris » via l'API Discord.
 * Exécuté par GitHub Actions (.github/workflows/creer-serveur.yml).
 * Aucune dépendance : fetch natif de Node 20+.
 *
 * Variables d'environnement attendues :
 *   DISCORD_BOT_TOKEN  (secret GitHub, jamais dans le code)
 *   DISCORD_GUILD_ID   (secret GitHub : identifiant du serveur)
 *
 * Le script est rejouable : il ignore ce qui existe déjà.
 */

const API = 'https://discord.com/api/v10'
const TOKEN = process.env.DISCORD_BOT_TOKEN
const GUILD = process.env.DISCORD_GUILD_ID
if (!TOKEN || !GUILD) {
  console.error('DISCORD_BOT_TOKEN et DISCORD_GUILD_ID sont obligatoires.')
  process.exit(1)
}

const call = async (method, path, body) => {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bot ${TOKEN}`,
      'Content-Type': 'application/json',
      'X-Audit-Log-Reason': 'Mise en place de la structure (script)',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  if (!res.ok) {
    console.error(`${method} ${path} → ${res.status} ${text.slice(0, 300)}`)
    return null
  }
  return text ? JSON.parse(text) : {}
}

/* Permissions (bits) — voir discord.com/developers/docs/topics/permissions */
const P = {
  KICK: 1n << 1n,
  BAN: 1n << 2n,
  VIEW_AUDIT: 1n << 7n,
  VIEW_CHANNEL: 1n << 10n,
  SEND_MESSAGES: 1n << 11n,
  MANAGE_MESSAGES: 1n << 13n,
  MANAGE_CHANNELS: 1n << 4n,
  MANAGE_ROLES: 1n << 28n,
  MODERATE_MEMBERS: 1n << 40n,
  ADMIN: 1n << 3n,
}
const sum = (...bits) => bits.reduce((acc, bit) => acc | bit, 0n).toString()

const ROLES = [
  { name: 'Direction', color: 0xb08a4a, hoist: true, permissions: sum(P.ADMIN) },
  {
    name: 'Associé',
    color: 0xc9a66b,
    hoist: true,
    permissions: sum(P.MANAGE_CHANNELS, P.MANAGE_MESSAGES, P.VIEW_AUDIT, P.MODERATE_MEMBERS),
  },
  {
    name: 'Modérateur',
    color: 0x14402f,
    hoist: true,
    permissions: sum(P.MANAGE_MESSAGES, P.KICK, P.MODERATE_MEMBERS, P.VIEW_AUDIT),
  },
  { name: 'Support', color: 0xf3eee4, hoist: true, permissions: sum(P.MANAGE_MESSAGES) },
  { name: 'Cliente vérifiée', color: 0xe8dcc8, hoist: false, permissions: '0' },
  { name: 'Membre', color: 0x9aa0a6, hoist: false, permissions: '0' },
  { name: 'Invité', color: 0x4a4f4b, hoist: false, permissions: '0' },
]

/**
 * type 4 = catégorie, type 0 = salon texte, type 2 = vocal
 * acces : 'public' | 'lecture' (tout le monde lit, staff écrit) | 'staff' (privé)
 */
const STRUCTURE = [
  {
    category: 'ACCUEIL',
    access: 'public',
    channels: [
      { name: 'bienvenue', access: 'lecture' },
      { name: 'annonces', access: 'lecture' },
      { name: 'charte', access: 'lecture' },
      { name: 'presentations' },
    ],
  },
  {
    category: 'BOUTIQUE',
    access: 'public',
    channels: [
      { name: 'nouveautes', access: 'lecture' },
      { name: 'offres', access: 'lecture' },
      { name: 'comment-commander', access: 'lecture' },
      { name: 'suivi-de-commande' },
    ],
  },
  {
    category: 'COMMUNAUTE',
    access: 'public',
    channels: [
      { name: 'general', slowmode: 10 },
      { name: 'conseils-beaute' },
      { name: 'avis-clientes' },
      { name: 'photos' },
    ],
  },
  {
    category: 'SOLIDARITE',
    access: 'public',
    channels: [
      { name: 'projet-solidaire', access: 'lecture' },
      { name: 'dons', access: 'lecture' },
    ],
  },
  {
    category: 'SUPPORT',
    access: 'public',
    channels: [
      { name: 'ouvrir-un-ticket', access: 'lecture' },
      { name: 'tickets-journal', access: 'staff' },
    ],
  },
  {
    category: 'STAFF',
    access: 'staff',
    channels: [
      { name: 'commandes' },
      { name: 'paiements' },
      { name: 'logistique' },
      { name: 'staff-general' },
      { name: 'reunion-staff', type: 2 },
    ],
  },
  {
    category: 'JOURNAUX',
    access: 'staff',
    channels: [
      { name: 'logs-arrivees' },
      { name: 'logs-messages' },
      { name: 'logs-moderation' },
      { name: 'logs-tickets' },
    ],
  },
]

const WELCOME = [
  '**Bienvenue chez Beauté Paris**',
  '',
  'Un espace dédié aux soins et à la beauté.',
  '',
  'Trois choses avant de commencer :',
  '• lisez la charte dans <#CHARTE> ;',
  '• passez la vérification pour pouvoir écrire ;',
  '• pour toute demande, ouvrez un ticket dans <#TICKETS>.',
  '',
  'Nous ne publions aucun témoignage à la place de nos membres.',
  '',
  'Contact : beaute.paris@proton.me',
].join('\n')

const CHARTE = [
  '**Règlement**',
  '',
  '1. Respect entre membres, aucune discrimination.',
  '2. Pas de publicité, pas d’invitation d’autres serveurs, pas de démarchage.',
  '3. Pas de vente entre membres.',
  '4. Aucune donnée personnelle publiée : adresse, téléphone, e-mail, capture avec un nom.',
  '5. Aucun faux avis. Seuls de vrais avis, avec accord écrit, nom abrégé. Les avis négatifs sont publiés aussi.',
  '6. Ne jamais envoyer d’argent à un membre. Nous ne demandons jamais de mot de passe, de code de carte, de phrase de récupération ni de clé privée. Toute adresse de paiement postée ici est une arnaque : signalez-la.',
  '7. Pas de conseils médicaux.',
  '8. Pas de contenu sexuel, violent, politique ou religieux.',
  '9. Le staff tranche en cas de doute. Sanctions : avertissement, timeout, bannissement.',
  '10. Réponse sous 24 h ouvrées. Le ticket est le seul canal de réclamation.',
].join('\n')

const main = async () => {
  console.log(`Cible : serveur ${GUILD} · jeton de ${TOKEN.length} caractères`)
  const roles = await call('GET', `/guilds/${GUILD}/roles`)
  if (!roles) {
    console.error('Impossible de lire les rôles : jeton invalide, bot non invité, ou identifiant de serveur faux.')
    process.exit(1)
  }
  console.log(`Rôles existants : ${roles.map((role) => role.name).join(', ') || '(aucun)'}`)

  // 1 · rôles
  const roleIds = {}
  for (const role of ROLES) {
    const existing = roles.find((item) => item.name === role.name)
    if (existing) {
      roleIds[role.name] = existing.id
      console.log(`= rôle ${role.name} (existe)`)
      continue
    }
    const created = await call('POST', `/guilds/${GUILD}/roles`, role)
    if (created) {
      roleIds[role.name] = created.id
      console.log(`+ rôle ${role.name}`)
    }
  }
  const everyone = GUILD
  const staffRoles = ['Direction', 'Associé', 'Modérateur', 'Support'].map((name) => roleIds[name]).filter(Boolean)

  // 2 · catégories et salons
  const channels = (await call('GET', `/guilds/${GUILD}/channels`)) ?? []
  const channelIds = {}
  for (const channel of channels) channelIds[channel.name] = channel.id

  const overwritesFor = (access) => {
    if (access === 'staff') {
      return [
        { id: everyone, type: 0, deny: sum(P.VIEW_CHANNEL) },
        ...staffRoles.map((id) => ({ id, type: 0, allow: sum(P.VIEW_CHANNEL) })),
      ]
    }
    if (access === 'lecture') {
      return [{ id: everyone, type: 0, allow: sum(P.VIEW_CHANNEL), deny: sum(P.SEND_MESSAGES) }]
    }
    return [{ id: everyone, type: 0, allow: sum(P.VIEW_CHANNEL, P.SEND_MESSAGES) }]
  }

  for (const group of STRUCTURE) {
    let parentId = channelIds[group.category]
    if (!parentId) {
      const created = await call('POST', `/guilds/${GUILD}/channels`, {
        name: group.category,
        type: 4,
        permission_overwrites: overwritesFor(group.access),
      })
      if (created) {
        parentId = created.id
        console.log(`+ catégorie ${group.category}`)
      }
    } else console.log(`= catégorie ${group.category} (existe)`)

    for (const channel of group.channels) {
      if (channelIds[channel.name]) {
        console.log(`  = ${channel.name}`)
        continue
      }
      const created = await call('POST', `/guilds/${GUILD}/channels`, {
        name: channel.name,
        type: channel.type ?? 0,
        parent_id: parentId,
        rate_limit_per_user: channel.slowmode ?? 0,
        permission_overwrites: overwritesFor(channel.access ?? group.access),
      })
      if (created) {
        channelIds[channel.name] = created.id
        console.log(`  + ${channel.name}`)
      }
      await new Promise((resolve) => setTimeout(resolve, 350))
    }
  }

  // 3 · textes
  const post = async (channelName, content) => {
    const id = channelIds[channelName]
    if (!id) return
    const existing = await call('GET', `/channels/${id}/messages?limit=5`)
    if (Array.isArray(existing) && existing.some((message) => message.content?.includes(content.split('\n')[0]))) {
      console.log(`= texte déjà présent dans ${channelName}`)
      return
    }
    const body = content
      .replace('<#CHARTE>', channelIds.charte ? `<#${channelIds.charte}>` : '#charte')
      .replace('<#TICKETS>', channelIds['ouvrir-un-ticket'] ? `<#${channelIds['ouvrir-un-ticket']}>` : '#ouvrir-un-ticket')
    await call('POST', `/channels/${id}/messages`, { content: body })
    console.log(`+ texte dans ${channelName}`)
  }

  await post('bienvenue', WELCOME)
  await post('charte', CHARTE)

  console.log('\nTerminé. La vérification par bouton et les tickets demandent un bot permanent')
  console.log('(Ticket Tool ou Carl-bot, gratuits) : voir docs/discord-serveur-seul.txt.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
