# Créer la structure du serveur Discord — gratuit, sans me donner accès à Discord

## Pourquoi cette méthode
Mon environnement n'a pas accès à `discord.com` (connexion TLS refusée) : je ne peux pas me connecter à ton
serveur. En revanche je peux écrire un script, et **GitHub Actions l'exécute pour moi, gratuitement**.
Le jeton du bot n'est jamais dans le code : il est stocké en secret, et il ne donne que les droits que tu
lui accordes.

## Ce que le script crée (et rien d'autre)
- **7 catégories** : ACCUEIL, BOUTIQUE, COMMUNAUTE, SOLIDARITE, SUPPORT, STAFF (privé), JOURNAUX (privé)
- **24 salons** texte + 1 vocal `reunion-staff`
- **7 rôles** : Direction (admin), Associé, Modérateur, Support, Cliente vérifiée, Membre, Invité
- **Permissions** : salons « lecture seule » (tout le monde lit, staff écrit), salons staff invisibles aux
  membres, `general` en mode lent 10 s
- **2 messages** : `#bienvenue` et `#charte` (texte complet, 10 points)

Le script est **rejouable** : il ignore ce qui existe déjà, il n'écrase rien.

## Étape 1 — Créer l'application (2 min, gratuit)
1. Va sur https://discord.com/developers/applications → **New Application**
2. Nom : `Beauté Paris` → **Create**
3. Onglet **Bot** → **Reset Token** → **Copy** (c'est la seule fois où il s'affiche)
4. Toujours dans **Bot**, active **Server Members Intent** (utile pour la suite)
5. Onglet **OAuth2 → General** → copie l'**Application ID** (en haut)

## Étape 2 — Inviter le bot sur ton serveur (1 min)
Ouvre cette adresse en remplaçant `TON_APP_ID` :

```
https://discord.com/oauth2/authorize?client_id=TON_APP_ID&scope=bot%20applications.commands&permissions=8
```

Choisis ton serveur → **Autoriser**. Le bot apparaît avec le rôle « Beauté Paris ».

> `permissions=8` = administrateur, nécessaire pour créer des salons et des rôles. Tu pourras le retirer
> après l'exécution et lui laisser des droits plus limités.

## Étape 3 — Récupérer l'identifiant du serveur (30 s)
Discord → **Paramètres utilisateur → Avancés → Mode développeur** (activer).
Clic droit sur ton serveur (icône en haut à gauche) → **Copier l'identifiant du serveur**.

## Étape 4 — Lancer le script (1 min)
Dans le dépôt GitHub `ASALA77722/beauty` :
1. **Settings → Secrets and variables → Actions → New repository secret**
   - `DISCORD_BOT_TOKEN` = le jeton copié à l'étape 1
   - `DISCORD_GUILD_ID` = l'identifiant copié à l'étape 3
2. Onglet **Actions** → **Créer la structure du serveur Discord** → **Run workflow** → **Run**
3. Attends 1 à 2 minutes, puis ouvre le journal : chaque ligne affiche `+` (créé) ou `=` (déjà présent)

## Étape 5 — Ce qui reste à faire à la main (10 min, dans Discord)
Le script crée la structure, pas les fonctions interactives :

| À faire | Où | Comment |
|---|---|---|
| **Vérification** (Invité → Membre) | bot **Carl-bot** (gratuit) | *Reaction roles* ou *Button roles* → bouton « J'accepte la charte » dans `#bienvenue` |
| **Tickets** | bot **Ticket Tool** (gratuit) | panneau dans `#ouvrir-un-ticket`, 3 motifs, catégorie de destination `SUPPORT` |
| **Bienvenue automatique** | Carl-bot ou AiGuild | message privé à l'arrivée + rôle `Invité` |
| **Journaux** | Carl-bot | logs de messages, arrivées, sanctions dans `JOURNAUX` |

## À savoir
- Le script utilise l'API officielle Discord : rien d'illégal, rien de détourné.
- Tu peux **révoquer le jeton** à tout moment (onglet Bot → Reset Token) : le script cessera de fonctionner.
- Si une ligne affiche une erreur `403`, c'est que le bot n'a pas les droits : vérifie l'étape 2.
- Si une erreur `429` apparaît, c'est une limite de débit : relance simplement le workflow.
