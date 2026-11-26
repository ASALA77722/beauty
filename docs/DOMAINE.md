# Changer l'adresse du site

Aujourd'hui : **https://asala77722.github.io/beauty/**

Le `asala77722` vient du **nom de ton compte GitHub**. Impossible de le supprimer
en restant sur `github.io` : c'est GitHub qui impose ce format
(`<compte>.github.io/<dépôt>/`).

Trois solutions, de la plus simple à la plus définitive.

---

## 1. Changer le nom du dépôt (2 minutes, gratuit)

Ça ne supprime pas `asala77722`, mais ça rend l'adresse plus présentable :

`https://asala77722.github.io/boutique-beaute/`

1. <https://github.com/ASALA77722/beauty/settings>
2. Champ **Repository name** en haut (encadré « Rename »)
3. Taper le nouveau nom, par ex. `boutique-beaute`
4. Cliquer **Rename**

> ✅ Rien d'autre à faire : le workflow détecte le nouveau nom et adapte
> automatiquement les chemins du site. L'URL devient active en ~1 minute.

---

## 2. Un domaine personnalisé (adresse 100 % propre)

`https://beaute-paris.fr` — plus aucune trace de GitHub.

**a) Acheter le domaine** (~10 €/an) chez un registrar : OVH, Gandi, Namecheap,
Cloudflare Registrar, Ionos… Choisir un `.fr` (AFNIC) ou un `.com`.

**b) Configurer le DNS** chez le registrar, deux types d'enregistrements :

| Type | Nom | Valeur |
| --- | --- | --- |
| `A` | `@` | `185.199.108.153` |
| `A` | `@` | `185.199.109.153` |
| `A` | `@` | `185.199.110.153` |
| `A` | `@` | `185.199.111.153` |
| `CNAME` | `www` | `asala77722.github.io` |

**c) Déclarer le domaine sur GitHub**

1. <https://github.com/ASALA77722/beauty/settings/pages>
2. Champ **Custom domain** → saisir `beaute-paris.fr` → **Save**
3. Attendre la vérification (de quelques minutes à 24 h pour la propagation DNS)
4. Cocher **Enforce HTTPS** dès que l'option est disponible

**d) Créer le fichier `public/CNAME`** dans le dépôt, contenant une seule ligne :

```
beaute-paris.fr
```

> Le workflow détecte ce fichier, construit le site à la racine du domaine
> (`PAGES_BASE=/`) et copie le CNAME dans le build. C'est automatique.

Pour demander : « active le domaine beaute-paris.fr » et le fichier sera créé.

---

## 3. Garder l'adresse actuelle

`https://asala77722.github.io/beauty/` fonctionne parfaitement. On peut aussi
**masquer** le lien : partager un QR code, un lien court (bit.ly, tinyurl), ou
intégrer le site dans une iframe sur une page perso.
