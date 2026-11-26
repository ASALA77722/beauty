# Publier le site (2 minutes, une seule fois)

Le site est **prêt à être publié** : le workflow GitHub Actions construit et met en ligne
automatiquement le site à chaque `push`. Il ne manque que deux réglages, que mon accès
automatisé ne peut pas modifier (GitHub réserve ces actions au propriétaire du dépôt).

## Étape 1 — Rendre le dépôt public

> Obligatoire : **GitHub Pages n'est pas disponible sur un dépôt privé** avec un compte gratuit.

1. Ouvrir <https://github.com/ASALA77722/Beaut-/settings>
2. Descendre tout en bas de la page, section **Danger Zone**
3. Cliquer sur **Change repository visibility** → **Change to public**
4. Taper `ASALA77722/Beaut-` pour confirmer, puis valider

## Étape 2 — Activer GitHub Pages

1. Toujours dans **Settings**, choisir **Pages** dans le menu de gauche
2. Section **Build and deployment**, champ **Source** : sélectionner **GitHub Actions**
3. C'est tout — aucun fichier à ajouter

## Résultat

Le déploiement se déclenche seul. Compter environ 1 minute, puis le site est en ligne à :

**https://asala77722.github.io/Beaut-/**
(si le dépôt est renommé, l'URL suit le nouveau nom)

L'avancement est visible dans l'onglet **Actions** du dépôt.

## Ensuite : les modifications sont automatiques

Chaque `push` sur la branche de travail reconstruit le site et le republie. Pour voir une
modification en ligne : demander le changement, puis attendre ~1 minute et rafraîchir la page.

## Alternative sans GitHub Pages

Le site existe aussi en **fichier unique autonome** : `Beauté-Paris.html` à la racine du dépôt.
Il s'ouvre par double-clic, fonctionne hors connexion et ne dépend d'aucun serveur.
