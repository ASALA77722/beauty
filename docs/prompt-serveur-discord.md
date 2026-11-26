# PROMPT À COLLER DANS L'IA QUI CRÉE DES SERVEURS DISCORD

Tu vas créer un serveur Discord complet, de A à Z, pour une boutique de parfumerie et de soins de beauté
française. Je te donne toutes les informations réelles. **N'invente aucun chiffre, aucun partenariat,
aucun témoignage, aucun chiffre d'affaires.** Tout ce qui n'est pas dans ce document doit être laissé
vide ou marqué « à compléter », jamais rempli avec une valeur fictive.

---

## 1. LE PROJET

- **Nom du serveur** : Beauté Paris
- **Activité** : vente en ligne de soins et sérums de parfumerie de marques françaises, à prix juste.
- **Site** : https://asala77722.github.io/beauty/
- **E-mail de contact** : beaute.paris@proton.me
- **Public** : femmes (et hommes) 25-55 ans, France, sensibles au luxe mais attentives au prix.
- **Positionnement** : « le luxe au juste prix ». Ton élégant, sobre, vouvoiement, jamais familier.
- **Univers visuel** : ivoire `#FBF8F3`, or `#B08A4A`, vert forêt `#14402F`, crème `#F3EEE4`, encre `#1E241F`.
  Typographie éditoriale (serif pour les titres). Emojis discrets, jamais de spam d'emojis.
- **Deux associés** se partagent l'activité : la boutique et un associé. Les deux ont accès au staff.

## 2. STRUCTURE DES SALONS (à créer exactement)

### 📌 CATÉGORIE — ACCUEIL
| Salon | Type | Rôle |
|---|---|---|
| `#bienvenue` | texte, lecture seule | message d'accueil automatique, règles résumées, boutons de vérification |
| `#annonces` | texte, lecture seule | nouveautés, offres, informations boutique (staff uniquement) |
| `#charte` | texte, lecture seule | règles complètes du serveur |
| `#présentations` | texte | chaque membre peut se présenter (facultatif) |

### 🛍 CATÉGORIE — LA BOUTIQUE
| Salon | Type | Rôle |
|---|---|---|
| `#nouveautés` | texte, lecture seule | arrivages et fiches produits |
| `#offres-et-codes` | texte, lecture seule | offres en cours et codes promo valides |
| `#comment-commander` | texte, lecture seule | pas-à-pas du tunnel d'achat |
| `#suivi-de-commande` | texte + fil de discussion | les clientes demandent leur suivi ici, le staff répond en fil |

### 💬 CATÉGORIE — LA COMMUNAUTÉ
| Salon | Type | Rôle |
|---|---|---|
| `#général` | texte | discussions libres (slowmode 10 s) |
| `#conseils-beauté` | texte | routines, questions de peau, conseils |
| `#avis-clientes` | texte | **uniquement de vrais avis**, avec preuve d'achat, publiés avec accord |
| `#photos-et-rituels` | texte + images | photos de routines (pas de visage d'autrui sans accord) |

### ❤️ CATÉGORIE — SOLIDARITÉ
| Salon | Type | Rôle |
|---|---|---|
| `#projet-solidaire` | texte, lecture seule | présentation du projet soutenu (**à remplir plus tard**, ne rien inventer) |
| `#dons-et-transparence` | texte, lecture seule | montants collectés et reversés, uniquement quand ils existent |

### 🎫 CATÉGORIE — SUPPORT
| Salon | Type | Rôle |
|---|---|---|
| `#ouvrir-un-ticket` | texte, lecture seule | panneau de tickets (boutons) |
| `#tickets-journal` | texte, lecture seule, staff | transcriptions automatiques des tickets fermés |

### 🔒 CATÉGORIE — STAFF (privée)
| Salon | Type | Rôle |
|---|---|---|
| `#commandes-à-traiter` | texte, staff | **webhook du site** : chaque commande arrive ici automatiquement |
| `#paiements-reçus` | texte, staff | vérification des règlements et répartition 50/50 |
| `#logistique` | texte, staff | expéditions, points relais, numéros de suivi |
| `#staff-général` | texte, staff | organisation interne |
| `🔊 Réunion staff` | vocal, staff | réunions |

### 🛡 CATÉGORIE — JOURNAUX (privée, staff)
`#logs-messages` (éditions/suppressions), `#logs-arrivées` (arrivées/départs), `#logs-modération`
(sanctions), `#logs-tickets`.

## 3. RÔLES ET PERMISSIONS (ordre hiérarchique exact)

| Position | Rôle | Couleur | Droits |
|---|---|---|---|
| 1 | `✦ Direction` | or `#B08A4A` | administrateur |
| 2 | `Associé` | or clair `#C9A66B` | gestion des salons staff, tickets, commandes (pas d'admin total) |
| 3 | `Modérateur` | vert forêt `#14402F` | timeouts, suppressions, gestion des messages |
| 4 | `Support` | crème `#F3EEE4` | voir et répondre aux tickets, pas de sanction |
| 5 | `Cliente vérifiée` | ivoire doré | accès à `#avis-clientes` en écriture, offre fidélité |
| 6 | `Programme solidaire` | rose poudré | rôle cosmétique, réaction-role facultatif |
| 7 | `Membre` | gris | accès à tous les salons publics en écriture |
| 8 | `Invité` | gris foncé | lecture seule, doit passer la vérification |

**Vérification** : à l'arrivée, le membre reçoit `Invité`. Dans `#bienvenue`, un bouton
« ✅ J'accepte la charte » lui donne `Membre` et retire `Invité`. Aucun accès en écriture avant.

## 4. SYSTÈME DE TICKETS (obligatoire, via Ticket Tool ou équivalent)

**Panneau dans `#ouvrir-un-ticket`** : un embed avec un bouton par motif, libellés exacts :

1. `🛍 Ma commande` → formulaire demandant la **référence `BP-…`** ou le **numéro client à 6 chiffres**
2. `💳 Mon paiement` → formulaire demandant la référence de paiement et le montant réglé
3. `📦 Livraison & point relais` → ville de retrait, date de commande
4. `↩️ Retour ou remboursement` → référence de commande, motif
5. `💬 Question produit` → nom du produit, question
6. `🚨 Signaler un problème` → description, capture d'écran

**Règles techniques des tickets :**
- Nom du salon : `ticket-0001`, `ticket-0002`… (numérotation incrémentale)
- Catégorie : `🎫 TICKETS OUVERTS` ; à la fermeture : `🗄 TICKETS ARCHIVÉS`
- Permissions : la personne qui ouvre + `Support` + `Modérateur` + `Associé` + `Direction`
- Message d'ouverture automatique (à rédiger) : rappel de ne **jamais** envoyer de données bancaires,
  de **jamais** envoyer une phrase de récupération ou une clé privée crypto, et de garder la référence
  de commande.
- Tag automatique de l'équipe support, priorité visible pour les tickets « paiement » et « problème ».
- Fermeture : bouton `🔒 Fermer le ticket` + bouton `📄 Transcription`, archivage automatique après
  **48 h sans message**, transcription envoyée dans `#tickets-journal`.
- Commande staff : `!add @membre` pour ajouter quelqu'un au ticket, `!close` pour fermer.

## 5. BIENVENUE ET ONBOARDING

**Message automatique dans `#bienvenue`** (à rédiger en entier, ton élégant, 6-8 lignes max) :
- titre « Bienvenue chez Beauté Paris »
- une phrase sur la maison, une sur ce qu'on trouve ici
- les 3 premières actions : lire `#charte`, passer la vérification, ouvrir un ticket si besoin
- le rappel : « nous ne publions aucun témoignage à la place de nos clientes »
- l'adresse de contact e-mail

**Message privé automatique à l'arrivée** : version courte du même texte + lien du site.

**Rôles automatiques** : `Invité` à l'arrivée. **Pas** de rôle `Membre` automatique.

**Réaction-rôles facultatifs** dans `#annonces` : `🔔 Nouveautés`, `🎁 Offres`, `❤️ Projet solidaire`.

## 6. LA BOUTIQUE — DONNÉES RÉELLES À UTILISER (ne rien inventer)

### Produits et prix (TTC, euros)
| Produit | Marque | Ligne | Volume | Prix magasin | Prix Beauté Paris | Prix de lancement (−5 %) | Remise |
|---|---|---|---|---|---|---|---|
| **Baume Intégral Anti-Âge Nuit** | Jeanne Piaubert | Suprém'Advance Premium | 50 ml | 219,50 € | 95,00 € | **90,25 €** | −59 % |
| **Sérum Anti-Rides Performance** | Stendhal | Recette Merveilleuse | 30 ml | 115,50 € | 45,00 € | **42,75 €** | −63 % |
| **Sérum Anti-Taches** | Laboratoires de Biarritz | Dark Spot Serum | 30 ml | 38,90 € | 15,90 € | **15,11 €** | −61 % |

Bénéfices à citer (résumés, sans promesse médicale) :
- Baume : rides et ridules lissées dès 4 semaines, fermeté, éclat au réveil, texture baume fondante.
- Sérum anti-rides : extrait d'Algue Millennium, rides installées atténuées, grain de peau affiné.
- Sérum anti-taches : 100 % d'origine naturelle, action anti-récidive, convient aux peaux sensibles,
  teint plus uniforme en 8 semaines ; associer une protection solaire le jour.

### Remises — cumulables, la plus avantageuse appliquée automatiquement
- **2 produits** → −10 % sur le 2ᵉ
- **3 produits et plus** → −15 % sur le total
- **Code `BIENVENUE10`** → −10 % sans minimum
- **Code `LUXE15`** → −10 % dès 100 €
- **Code `LIVRAISON`** → livraison offerte
- **Paiement en ligne** → −5 % immédiat (crypto ou carte bancaire)
- **Livraison** : offerte dès 35 €, sinon 3,90 €

### Commande et suivi
- Référence de commande : `BP-YYMMDD-XXXX` (ex. `BP-261126-1234`)
- Numéro client : **6 chiffres** (ex. `482913`)
- Code de suivi partageable : `BP-<numéro>-<code>` — c'est ce que la cliente colle en ticket
- Statuts : *Paiement en attente · Paiement confirmé · En préparation · Expédiée ·
  Arrivée au point relais · Livrée · Annulée*
- Suivi en ligne : `https://asala77722.github.io/beauty/#suivi/<référence>`
- Expédition sous **24 h ouvrées** depuis la France ; point relais choisi par ville, relais exact
  communiqué à l'expédition ; livraison à domicile possible (Colissimo 48 h)
- Retours : **14 jours** après réception, produit non ouvert, remboursement sous 14 jours

### Paiement — règles absolues du serveur
- Le paiement se fait **sur une page de paiement sécurisée** (NOWPayments), **jamais** par virement direct
  entre membres, **jamais** en carte via message privé.
- **Aucune adresse crypto n'est publiée sur le serveur.** Si quelqu'un en poste une, c'est une arnaque :
  supprimer, avertir, bannir.
- **On ne demande jamais** : mot de passe, code de carte, phrase de récupération (12/24 mots), clé privée.
  À écrire noir sur blanc dans la charte et dans chaque ticket.
- La boutique fonctionne à deux (boutique + associé) : la répartition des recettes est interne, elle
  n'est jamais discutée en public.

## 7. WEBHOOK DES COMMANDES (salon `#commandes-à-traiter`)

Le site enverra un message JSON dans ce salon à chaque commande. Format attendu :
```json
{
  "reference": "BP-261126-1234",
  "clientNumber": "482913",
  "total": 85.74,
  "currency": "EUR",
  "items": [{ "name": "Baume Intégral Anti-Âge Nuit", "qty": 1, "line": 90.25 }],
  "delivery": { "mode": "pickup", "city": "Lyon", "email": "cliente@exemple.fr" },
  "status": "awaiting_payment",
  "createdAt": "2026-11-26T14:12:00.000Z"
}
```
Prévois un embed lisible : référence en titre, montant en évidence, articles, ville, statut, et un rappel
« vérifier le règlement avant préparation ». **Aucune donnée bancaire, aucune adresse de livraison
complète en clair** (ville seulement).

**Ce qui existe déjà côté site** (ne le recrée pas, utilise-le) : le vendeur saisit le code de commande dans
un espace de gestion, voit les coordonnées complètes, change le statut et écrit un message privé à la
cliente qui apparaît dans son suivi. Le webhook Discord servira à recevoir la commande **sans avoir à la
coller à la main**. Tant qu'il n'est pas en place, le canal de transmission est le code `BP-…` envoyé en
message privé.

## 7 bis. MESSAGES TYPES À PRÉPARER POUR LE STAFF

Prévois dans `#staff-général` un message épinglé avec des modèles copiables (ton courtois, vouvoiement) :
1. **Commande reçue** : accuser réception, annoncer la préparation sous 24 h ouvrées.
2. **Paiement non retrouvé** : demander la référence de paiement et le montant, rappeler qu'on ne demande
   jamais de données bancaires.
3. **Expédition** : annoncer le départ, le point relais exact, le délai.
4. **Retard** : s'excuser, donner une date, proposer un geste commercial **uniquement si le staff décide**
   (ne pas promettre de remise automatique).
5. **Retour** : rappeler les 14 jours, l'état du produit, l'adresse de retour `[À COMPLÉTER]`.
6. **Avis client** : demander l'accord écrit avant publication, expliquer que le nom sera abrégé
   (« Claire Mercier » → « Claire M. ») et que les avis négatifs sont publiés aussi.

## 8. MODÉRATION ET SÉCURITÉ

- **AutoMod** : anti-spam (5 messages / 10 s), anti-invitations Discord, anti-liens sortants pour les
  `Invité`, filtre de mots (insultes, arnaques « crypto gratuit », « gagne 500 € par jour »).
- **Anti-raid** : vérification obligatoire, mode lent sur `#général` (10 s), âge minimum de compte
  recommandé pour écrire, alerte staff en cas de vague d'arrivées.
- **Anti-arnaque** : tout message privé demandant un paiement, une carte cadeau, un mot de passe ou une
  crypto est une arnaque → capture, signalement, ban. Message d'alerte à épingler dans `#charte`.
- **Journaux** : arrivées/départs, messages édités/supprimés, sanctions, tickets.

## 9. CHARTE À RÉDIGER (ton ferme et courtois, 10-14 points)

Points obligatoires :
1. Respect entre membres, aucune discrimination.
2. Pas de publicité, pas d'invitation d'autres serveurs, pas de démarchage.
3. Pas de vente entre membres : la boutique est le seul canal d'achat.
4. **Aucune donnée personnelle publiée** (adresse, téléphone, e-mail, capture de commande avec nom).
5. **Aucun avis inventé** : seuls les vrais avis, avec preuve d'achat, sont publiés, et uniquement
   avec accord de la personne.
6. **Arnaques** : ne jamais envoyer d'argent à un membre, ne jamais partager de phrase de récupération.
7. Pas de conseils médicaux : nous ne sommes pas dermatologues, en cas de problème de peau voir un médecin.
8. Pas de contenu sexuel, violent, politique ou religieux.
9. Le staff tranche en cas de doute ; les sanctions vont de l'avertissement au bannissement.
10. Les délais de réponse sont de **24 h ouvrées** ; les tickets sont le seul canal de réclamation.

## 10. CE QUE TU DOIS LIVRER

1. La liste complète des salons et catégories, avec leurs permissions.
2. Les rôles, couleurs (codes hexadécimaux ci-dessus) et hiérarchie.
3. Les **textes finaux** prêts à coller : message de bienvenue, message privé d'arrivée, charte complète,
   panneau de tickets (embed + boutons + formulaires), message d'ouverture de ticket, message de
   fermeture, message d'aide dans `#comment-commander`, message d'offres dans `#offres-et-codes`.
4. La configuration des bots : Ticket Tool (ou équivalent), Carl-bot (rôles, auto-rôles, automod, embeds),
   webhook de commandes, journaux.
5. Les paramètres de sécurité (AutoMod, vérification, anti-raid).
6. Une checklist finale de tests : arrivée d'un nouveau membre, ouverture et fermeture d'un ticket,
   réception d'une commande par webhook, sanction d'un compte d'arnaque.

## 11. INTERDICTIONS ABSOLUES

- ❌ N'invente **aucun** chiffre : pas de nombre de membres, de ventes, d'avis, de clients satisfaits.
- ❌ N'invente **aucun** partenariat, aucune association, aucun label, aucune certification.
- ❌ Ne promets **aucun** reçu fiscal : une boutique ne peut pas en délivrer.
- ❌ Ne crée pas de salon « avis » où le staff écrit de faux témoignages.
- ❌ N'invente pas de SIRET, d'adresse postale ni de numéro de téléphone (la boutique n'en publie aucun).
- ❌ Pas de contenu qui prétend que les produits guérissent une maladie.

Si une information manque, laisse un champ `[À COMPLÉTER]` visible plutôt que d'inventer.

## 12. TON ET STYLE

Vouvoiement, phrases courtes, aucune familiarité. Le serveur doit donner l'impression d'une maison de
parfumerie calme et soignée, pas d'un serveur de coupons. Pas de majuscules hurlantes, pas de « ‼️‼️ ».
Un seul emoji par idée quand il apporte du sens.
