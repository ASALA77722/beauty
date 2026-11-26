# Lancer la création du serveur — 6 minutes

Le workflow existe déjà et a été testé : il s'exécute, et il s'arrête volontairement sur
« DISCORD_BOT_TOKEN et DISCORD_GUILD_ID sont obligatoires » parce que les deux secrets ne sont pas
encore enregistrés. C'est normal. Il ne manque que tes deux valeurs.

## 1 · Créer l'application Discord (2 min)
1. https://discord.com/developers/applications → **New Application**
2. Nom : `Beauté Paris` → **Create**
3. Onglet **Bot** → **Reset Token** → **Copy**
   → c'est le `DISCORD_BOT_TOKEN`. Il ne s'affiche qu'une fois.

## 2 · Inviter le bot sur ton serveur (1 min)
Remplace `TON_APP_ID` par l'**Application ID** (onglet *General Information*) :

```
https://discord.com/oauth2/authorize?client_id=TON_APP_ID&scope=bot%20applications.commands&permissions=8
```

Choisis le serveur → **Autoriser**.

## 3 · Identifiant du serveur (30 s)
Discord → **Paramètres → Avancés → Mode développeur** (activer), puis clic droit sur l'icône du serveur
→ **Copier l'identifiant du serveur** → c'est le `DISCORD_GUILD_ID`.

## 4 · Enregistrer les deux secrets (1 min)
Dans le dépôt `ASALA77722/beauty` :
**Settings → Secrets and variables → Actions → New repository secret**

| Nom | Valeur |
|---|---|
| `DISCORD_BOT_TOKEN` | le jeton de l'étape 1 |
| `DISCORD_GUILD_ID` | l'identifiant de l'étape 3 |

## 5 · Lancer (30 s)
**Actions** → **Créer la structure du serveur Discord** → **Run workflow** → **Run**

Puis ouvre le journal : chaque ligne affiche
- `+` créé
- `=` déjà présent

## Résultat attendu
7 catégories, 24 salons, 1 vocal, 7 rôles, permissions, textes dans `#bienvenue` et `#charte`.

## Si ça échoue
| Message | Cause | Solution |
|---|---|---|
| `obligatoire` | secrets absents ou mal nommés | refaire l'étape 4 (noms exacts, en majuscules) |
| `401 Unauthorized` | jeton invalide ou réinitialisé | refaire l'étape 1 et mettre à jour le secret |
| `403 Missing Permissions` | bot invité sans administrateur | refaire l'étape 2 avec `permissions=8` |
| `404 Unknown Guild` | mauvais identifiant de serveur | refaire l'étape 3 |

## Après
Retirer `permissions=8` au bot (Paramètres du serveur → Rôles) et lui laisser :
Gérer les salons, Gérer les rôles, Envoyer des messages, Gérer les messages.
Les fonctions interactives (bouton de vérification, tickets, journaux) se font avec **Carl-bot** et
**Ticket Tool**, gratuits.
