# Publier le site — clic par clic

> ⏱️ 2 minutes · à faire **une seule fois** · depuis ton navigateur, sur ton compte GitHub.
> GitHub refuse ces 2 réglages aux accès automatisés : ils sont réservés au propriétaire.

---

## ÉTAPE 1 — Rendre le dépôt public

**1.** Ouvre cette adresse dans ton navigateur :

> **https://github.com/ASALA77722/Beaut-/settings**

*Si GitHub te demande de te connecter, connecte-toi avec ton compte `ASALA77722`.*

**2.** Tu es sur la page **Settings** (onglet « Settings » en haut, à droite de « Code », « Issues »…).
**Descends tout en bas de la page**, jusqu'à la dernière section encadrée en rouge :

> ⚠️ **Danger Zone**

**3.** Dans cette zone, trouve la ligne :

> **Change repository visibility**
> *This repository is currently only visible to you.*

**4.** Clique sur le bouton gris à droite :

> **`Change visibility`**

**5.** Une fenêtre s'ouvre. Choisis :

> **`Change to public`**

**6.** GitHub te demande de confirmer en tapant le nom du dépôt. Dans le champ, tapes exactement :

> `ASALA77722/Beaut-`

**7.** Clique sur le bouton rouge :

> **`I understand, change repository visibility`**

✅ Le dépôt est public. La page se recharge, l'étiquette « Private » disparaît à côté du nom.

---

## ÉTAPE 2 — Activer GitHub Pages

**8.** Toujours sur la page **Settings**, regarde la **colonne de gauche** (liste des sections :
*General, Access, Branches, Actions, Pages, …*).

**9.** Clique sur :

> **`Pages`**
> *(elle se trouve environ au milieu de la liste, juste après « Environments »)*

**10.** La page « GitHub Pages » s'ouvre. Tu vois une section :

> **Build and deployment**

**11.** Dans cette section, ligne **Source**, clique sur le menu déroulant qui affiche
**`Deploy from a branch`** et choisis :

> **`GitHub Actions`**

**12.** C'est tout. Il n'y a **pas de bouton « Save »** : le choix est enregistré immédiatement.
Un bandeau apparaît : *« GitHub Pages is using GitHub Actions to build and deploy your site »*.

---

## ÉTAPE 3 — Lancer la publication

**13.** Dans le même dépôt, clique sur l'onglet en haut :

> **`Actions`**

**14.** Dans la colonne de gauche, clique sur :

> **`Déployer le site sur GitHub Pages`**

**15.** À droite, clique sur le bouton :

> **`Run workflow`** ▾

**16.** Une petite fenêtre s'ouvre. Laisse la branche sur **`main`** et clique sur le bouton vert :

> **`Run workflow`**

**17.** Attends environ **1 minute**. La liste se rafraîchit toute seule.
Un point 🟡 orange devient ✅ vert quand c'est terminé.

---

## ÉTAPE 4 — Voir le site

Ouvre :

> # 🔗 https://asala77722.github.io/beauty/

⏳ Au tout premier chargement, GitHub peut mettre **1 à 2 minutes** de plus.
Si la page affiche « 404 », attends une minute et rafraîchis.

---

## Et ensuite ? Plus rien à faire.

À chaque fois qu'on modifie le site ici, le workflow se relance **tout seul** :

1. on fait une modification
2. je pousse le code
3. GitHub reconstruit le site (~1 min)
4. tu rafraîchis la page → le changement est visible

Aucune commande, aucun réglage : la publication est automatique.

> 💡 Si une modification n'apparaît pas tout de suite : `Ctrl + Maj + R`
> (ou `Cmd + Maj + R` sur Mac) pour forcer le rechargement du cache.

---

## En cas de souci

| Message | Que faire |
| --- | --- |
| `404` sur l'URL du site | Attendre 2 min, rafraîchir. Vérifier que l'étape 2 a bien « GitHub Actions » comme Source. |
| Le workflow est ❌ rouge, étape *Vérifier si Pages est activé* | L'étape 2 n'est pas faite (ou pas encore enregistrée). Recommencer l'étape 2 puis relancer l'étape 3. |
| `Change to public` grisé | Ton compte est peut-être sur une organisation avec des restrictions. Dis-le-moi, je te propose une autre solution. |
| Workflow introuvable dans Actions | Cliquer sur le bouton **`I understand my workflows, go ahead and enable them`** en haut de la page. |

---

## Besoin d'une solution sans GitHub Pages ?

Le site existe aussi en **fichier unique autonome** : `Beauté-Paris.html` à la racine du dépôt.
Double-clic → il s'ouvre dans le navigateur, fonctionne hors connexion, aucun réglage.
