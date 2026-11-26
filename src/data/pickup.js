// ─────────────────────────────────────────────────────────────
// Points relais — jeu de données de démonstration (France).
// Un vrai réseau renverrait la liste par code postal via une API
// (Mondial Relay / Relais Colis). Ici, la recherche filtre ces
// points par département, et la cliente peut toujours saisir
// manuellement le point relais qu'elle préfère.
// ─────────────────────────────────────────────────────────────

export const PICKUP_POINTS = [
  { id: 'pr-75002', name: 'Tabac de la Paix', address: '12 rue de la Paix', zip: '75002', city: 'Paris', hours: 'Lun–sam 7 h–21 h', distance: '250 m' },
  { id: 'pr-75011', name: 'Point Relais Bastille', address: '38 rue de la Roquette', zip: '75011', city: 'Paris', hours: 'Lun–sam 8 h–20 h', distance: '1,2 km' },
  { id: 'pr-69002', name: 'Presse Bellecour', address: '4 place Bellecour', zip: '69002', city: 'Lyon', hours: 'Lun–sam 6 h 30–20 h', distance: '400 m' },
  { id: 'pr-69003', name: 'Relais Part-Dieu', address: '17 rue de Bonnel', zip: '69003', city: 'Lyon', hours: 'Lun–ven 8 h–19 h 30', distance: '900 m' },
  { id: 'pr-13001', name: 'Tabac Vieux-Port', address: '9 quai des Belges', zip: '13001', city: 'Marseille', hours: 'Lun–sam 7 h–20 h', distance: '600 m' },
  { id: 'pr-13006', name: 'Relais Castellane', address: '22 rue de Rome', zip: '13006', city: 'Marseille', hours: 'Lun–sam 8 h–20 h', distance: '1,4 km' },
  { id: 'pr-33000', name: 'Librairie Gambetta', address: '56 cours Gambetta', zip: '33000', city: 'Bordeaux', hours: 'Mar–sam 9 h–19 h', distance: '700 m' },
  { id: 'pr-31000', name: 'Point Relais Capitole', address: '3 rue du Taur', zip: '31000', city: 'Toulouse', hours: 'Lun–sam 8 h–20 h', distance: '300 m' },
  { id: 'pr-59000', name: 'Relais Grand Place', address: '14 rue Nationale', zip: '59000', city: 'Lille', hours: 'Lun–sam 7 h 30–20 h', distance: '500 m' },
  { id: 'pr-44000', name: 'Tabac Graslin', address: '8 rue Crébillon', zip: '44000', city: 'Nantes', hours: 'Lun–sam 8 h–19 h 30', distance: '650 m' },
  { id: 'pr-67000', name: 'Presse Kléber', address: '25 rue des Grandes Arcades', zip: '67000', city: 'Strasbourg', hours: 'Lun–sam 8 h–20 h', distance: '450 m' },
  { id: 'pr-34000', name: 'Relais Comédie', address: '11 rue de la Loge', zip: '34000', city: 'Montpellier', hours: 'Lun–sam 9 h–19 h', distance: '800 m' },
  { id: 'pr-06000', name: 'Tabac Masséna', address: '6 avenue Jean Médecin', zip: '06000', city: 'Nice', hours: 'Lun–sam 7 h–21 h', distance: '350 m' },
  { id: 'pr-35000', name: 'Relais Sainte-Anne', address: '19 rue de Bertrand', zip: '35000', city: 'Rennes', hours: 'Lun–ven 8 h 30–19 h', distance: '1,1 km' },
  { id: 'pr-51100', name: 'Presse Erlon', address: '2 place Drouet-d’Erlon', zip: '51100', city: 'Reims', hours: 'Lun–sam 8 h–20 h', distance: '550 m' },
  { id: 'pr-38000', name: 'Tabac Grenette', address: '5 place Grenette', zip: '38000', city: 'Grenoble', hours: 'Lun–sam 7 h 30–20 h', distance: '700 m' },
  { id: 'pr-21000', name: 'Relais Darcy', address: '31 rue Darcy', zip: '21000', city: 'Dijon', hours: 'Mar–sam 9 h–19 h', distance: '900 m' },
  { id: 'pr-37000', name: 'Presse Jean-Jaurès', address: '48 rue Nationale', zip: '37000', city: 'Tours', hours: 'Lun–sam 8 h–19 h 30', distance: '1,0 km' },
  { id: 'pr-76000', name: 'Tabac Vieux-Marché', address: '15 place du Vieux-Marché', zip: '76000', city: 'Rouen', hours: 'Lun–sam 7 h–20 h', distance: '400 m' },
  { id: 'pr-13008', name: 'Relais Prado', address: '212 avenue du Prado', zip: '13008', city: 'Marseille', hours: 'Lun–sam 8 h–20 h', distance: '2,3 km' },
  { id: 'pr-92100', name: 'Point Relais Boulogne', address: '77 avenue Jean-Baptiste Clément', zip: '92100', city: 'Boulogne-Billancourt', hours: 'Lun–sam 8 h–20 h', distance: '1,5 km' },
  { id: 'pr-93100', name: 'Relais Montreuil', address: '23 rue de Paris', zip: '93100', city: 'Montreuil', hours: 'Lun–sam 9 h–19 h 30', distance: '1,8 km' },
]

/** Recherche par code postal (préfixe) ou par ville. */
export const searchPickupPoints = (query, limit = 6) => {
  const q = (query ?? '').trim().toLowerCase()
  if (q.length < 2) return []
  const byZip = PICKUP_POINTS.filter((point) => point.zip.startsWith(q))
  const byCity = PICKUP_POINTS.filter(
    (point) => !point.zip.startsWith(q) && point.city.toLowerCase().includes(q),
  )
  return [...byZip, ...byCity].slice(0, limit)
}

export const pickupPointById = (id) => PICKUP_POINTS.find((point) => point.id === id) ?? null
