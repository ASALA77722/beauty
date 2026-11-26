import { LEGAL, SHOP, sellingLegal } from '../config'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from '../lib/format'
import Icon from './Icon'

const TITLES = {
  legal: 'Mentions légales',
  cgv: 'Conditions générales de vente',
  privacy: 'Politique de confidentialité',
  cookies: 'Cookies et stockage local',
}

const STATUS_LABEL = {
  micro: 'Micro-entreprise',
  sasu: 'SASU',
  association: 'Association loi 1901',
  non_immatricule: 'Activité en cours de régularisation',
}

/** Mention manquante : affichée comme telle, jamais inventée. */
const Missing = ({ children }) => (
  <span className="rounded bg-gold/15 px-1.5 py-0.5 text-[12px] font-medium text-goldDeep">
    {children ?? 'non renseigné'}
  </span>
)

function Block({ title, children }) {
  return (
    <section className="mt-7">
      <h2 className="font-serif text-[19px] font-normal text-ink">{title}</h2>
      <div className="mt-2 space-y-2 text-[13.5px] leading-relaxed text-inkSoft">{children}</div>
    </section>
  )
}

function Legal() {
  const vat =
    LEGAL.vat === 'franchise'
      ? 'TVA non applicable, article 293 B du CGI (franchise en base).'
      : 'TVA au taux en vigueur, incluse dans les prix affichés.'
  return (
    <>
      <Block title="Éditeur du site">
        <p>
          {LEGAL.editorName} — {STATUS_LABEL[LEGAL.status]}.
        </p>
        {LEGAL.siret ? (
          <p>SIRET : {LEGAL.siret}</p>
        ) : (
          <p>
            SIRET : <Missing>en cours d’immatriculation</Missing>
          </p>
        )}
        <p>
          Responsable de la publication :{' '}
          {LEGAL.publisher || <Missing>à compléter</Missing>}
        </p>
        {!sellingLegal() && (
          <p className="rounded-lg border border-goldDeep/25 bg-gold/8 p-3 text-[12.5px] text-ink">
            Cette activité n’est pas encore immatriculée : aucun numéro SIRET n’existe à ce jour. Nous
            l’indiquons ici plutôt que d’afficher un numéro fictif. Vous pouvez nous demander à tout
            moment où en est la démarche.
          </p>
        )}
      </Block>

      <Block title="Adresse professionnelle">
        <p>
          {LEGAL.address || (
            <>
              Adresse communiquée sur simple demande à <a className="underline" href={`mailto:${SHOP.email}`}>{SHOP.email}</a>{' '}
              — <Missing>non publiée</Missing>
            </>
          )}
        </p>
      </Block>

      <Block title="Contact">
        <p>
          E-mail :{' '}
          <a className="underline" href={`mailto:${SHOP.email}`}>
            {SHOP.email}
          </a>
        </p>
        <p>Horaires de réponse : {SHOP.hours}</p>
      </Block>

      <Block title="Hébergement">
        <p>
          {LEGAL.host.name} — {LEGAL.host.address}
        </p>
        <p>
          Prestataire de paiement crypto :{' '}
          {LEGAL.paymentProcessor.name || <Missing>aucun service tiers — vérification par la boutique</Missing>}
        </p>
      </Block>

      <Block title="Prix et TVA">
        <p>{vat}</p>
      </Block>

      <Block title="Propriété intellectuelle">
        <p>
          Les textes et éléments graphiques de ce site sont la propriété de {LEGAL.editorName}. Les
          photographies de produits restent la propriété de leurs maisons respectives. Toute
          reproduction sans autorisation est interdite.
        </p>
      </Block>

      <Block title="Médiation de la consommation">
        <p>
          {LEGAL.mediator.name ? (
            <>
              En cas de litige non résolu, vous pouvez saisir gratuitement le médiateur :{' '}
              <a className="underline" href={LEGAL.mediator.url} target="_blank" rel="noreferrer noopener">
                {LEGAL.mediator.name}
              </a>
              .
            </>
          ) : (
            <>
              <Missing>médiateur non encore désigné</Missing> — cette désignation est obligatoire pour
              tout professionnel vendant à des particuliers. D’ici là, écrivez-nous : nous cherchons une
              solution amiable en priorité.
            </>
          )}
        </p>
      </Block>
    </>
  )
}

function Cgv() {
  return (
    <>
      <Block title="1 · Objet">
        <p>
          {LEGAL.editorName} vend en ligne des produits de soin et de parfumerie destinés aux
          particuliers. Toute commande implique l’acceptation des présentes conditions.
        </p>
      </Block>

      <Block title="2 · Prix et taxes">
        <p>
          Les prix sont indiqués en euros, toutes taxes comprises.{' '}
          {LEGAL.vat === 'franchise'
            ? 'TVA non applicable, article 293 B du CGI.'
            : 'TVA au taux en vigueur, incluse.'}{' '}
          Livraison offerte dès {FREE_SHIPPING_THRESHOLD} € d’achat, sinon {SHIPPING_COST.toFixed(2).replace('.', ',')} €.
          Aucun frais n’est ajouté au moment du paiement.
        </p>
        <p>
          Le règlement en cryptoactifs bénéficie d’une remise de 5 %. Le montant à envoyer est calculé
          sur la base d’un taux de conversion indicatif : il peut varier légèrement entre l’affichage et
          la réception.
        </p>
      </Block>

      <Block title="3 · Commande et paiement">
        <p>
          Le paiement s’effectue exclusivement en cryptoactifs, sur l’adresse indiquée au moment de la
          commande et sur le réseau précisé. Un virement effectué sur un autre réseau ne peut pas être
          récupéré.
        </p>
        <p>
          {LEGAL.paymentProcessor.name
            ? `Les paiements sont traités par ${LEGAL.paymentProcessor.name}.`
            : 'Aucun prestataire de paiement tiers n’intervient : la réception est vérifiée directement par la boutique sur la blockchain.'}
        </p>
        <p>
          {LEGAL.orderChannel === 'discord'
            ? 'Chaque commande est également notifiée à la boutique par messagerie Discord.'
            : 'La boutique suit chaque commande par e-mail et via son espace de gestion ; aucune commande n’est notifiée à un tiers.'}
        </p>
        <p>
          La commande est préparée dès confirmation du paiement sur la blockchain. Les montants en
          cryptoactifs étant définitifs, aucune annulation n’est possible après envoi.
        </p>
      </Block>

      <Block title="4 · Livraison">
        <p>
          Expédition depuis la France, sous 24 h ouvrées après confirmation du paiement. La cliente
          indique la ville de retrait souhaitée en point relais ; le relais exact lui est communiqué par
          e-mail et dans le suivi de commande dès l’expédition. Une livraison à domicile est également
          possible.
        </p>
        <p>
          Les délais d’acheminement sont ceux du transporteur et restent indicatifs.
        </p>
      </Block>

      <Block title="5 · Droit de rétractation">
        <p>
          Vous disposez de 14 jours à compter de la réception pour nous informer de votre rétractation,
          par e-mail à{' '}
          <a className="underline" href={`mailto:${SHOP.email}`}>
            {SHOP.email}
          </a>
          . Le produit doit nous être retourné dans les 14 jours suivants, non ouvert et dans son
          emballage d’origine.
        </p>
        <p>
          Le remboursement intervient dans les 14 jours suivant la réception du retour, en euros, par le
          moyen convenu ensemble. Les frais de retour restent à votre charge. Les produits descellés
          dont l’hygiène ne peut plus être garantie (soins ouverts) sont exclus de ce droit, comme le
          prévoit l’article L221-28 du code de la consommation.
        </p>
      </Block>

      <Block title="6 · Garanties">
        <p>
          Vous bénéficiez de la garantie légale de conformité (2 ans) et de la garantie des vices cachés.
          En cas de produit non conforme ou endommagé, écrivez-nous avec une photo : nous procédons au
          remplacement ou au remboursement.
        </p>
      </Block>

      <Block title="7 · Réclamations et médiation">
        <p>
          Toute réclamation doit être adressée à{' '}
          <a className="underline" href={`mailto:${SHOP.email}`}>
            {SHOP.email}
          </a>
          . Nous répondons sous 24 h ouvrées.{' '}
          {LEGAL.mediator.name ? (
            <>À défaut d’accord, le médiateur de la consommation compétent est {LEGAL.mediator.name}.</>
          ) : (
            <>
              <Missing>médiateur non encore désigné</Missing>.
            </>
          )}
        </p>
      </Block>
    </>
  )
}

function Privacy() {
  return (
    <>
      <Block title="Qui traite vos données">
        <p>
          {LEGAL.editorName}, joignable à{' '}
          <a className="underline" href={`mailto:${SHOP.email}`}>
            {SHOP.email}
          </a>
          . Responsable du traitement : {LEGAL.publisher || <Missing>à compléter</Missing>}.
        </p>
      </Block>

      <Block title="Données réellement collectées">
        <p>
          À la commande : prénom, nom, adresse e-mail, numéro de téléphone (facultatif), adresse ou
          ville de retrait, montant et référence de commande, hash de la transaction crypto.
        </p>
        <p>
          À la connexion : votre adresse e-mail et un code à 6 chiffres, le temps de la connexion.
          L’adresse de livraison et vos commandes sont enregistrées <strong>dans votre navigateur</strong>{' '}
          (stockage local), pas sur un serveur de la boutique.
        </p>
        <p>
          Pour un avis : votre prénom, votre ville si vous la renseignez, vos photos, et la référence de
          commande si vous la sélectionnez. Votre nom de famille n’est jamais publié.
        </p>
      </Block>

      <Block title="Pourquoi et combien de temps">
        <p>
          Les données de commande servent à préparer, expédier et suivre votre colis, et à répondre à vos
          demandes. Elles sont conservées le temps nécessaire à la garantie (2 ans) et aux obligations
          comptables (10 ans pour les pièces de vente).
        </p>
        <p>
          Nous ne revendons aucune donnée. Aucune donnée n’est utilisée pour de la publicité ciblée, et
          il n’existe ni traceur publicitaire ni profil publicitaire sur ce site.
        </p>
      </Block>

      <Block title="Qui peut y accéder">
        <p>
          La boutique, ainsi que : <strong>FormSubmit</strong> (acheminement de l’e-mail de connexion),{' '}
          <strong>GitHub, Inc.</strong> (hébergement du site), et le transporteur chargé de la livraison.
          {LEGAL.paymentProcessor.name
            ? ` Le prestataire de paiement ${LEGAL.paymentProcessor.name} traite les informations de transaction.`
            : ' Aucun prestataire de paiement ne traite vos données : la vérification du virement se fait sur la blockchain, à partir d’une adresse publique.'}
        </p>
      </Block>

      <Block title="Vos droits">
        <p>
          Vous pouvez demander l’accès à vos données, leur rectification, leur effacement, la limitation
          du traitement ou vous y opposer, en écrivant à{' '}
          <a className="underline" href={`mailto:${SHOP.email}`}>
            {SHOP.email}
          </a>
          . Nous répondons dans un délai d’un mois. En cas de désaccord, vous pouvez saisir la CNIL
          (cnil.fr).
        </p>
      </Block>

      <Block title="Transferts hors Union européenne">
        <p>
          L’hébergement (GitHub) et l’acheminement des e-mails (FormSubmit) impliquent des serveurs situés
          aux États-Unis. Ces prestataires s’appuient sur les clauses contractuelles types de la
          Commission européenne.
        </p>
      </Block>
    </>
  )
}

function Cookies() {
  return (
    <>
      <Block title="Ce que ce site stocke réellement">
        <p>
          Ce site n’utilise <strong>aucun cookie publicitaire, aucun traceur et aucun outil de mesure
          d’audience</strong>. Il n’y a donc pas de bandeau de consentement à afficher : rien n’est
          déposé sans votre action.
        </p>
      </Block>

      <Block title="Stockage local (localStorage)">
        <p>
          Pour que votre panier et vos commandes ne disparaissent pas quand vous changez de page, le
          navigateur conserve quelques informations <strong>sur votre appareil uniquement</strong> :
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>votre panier ;</li>
          <li>votre adresse e-mail de connexion ;</li>
          <li>vos commandes et vos avis déposés depuis cet appareil.</li>
        </ul>
        <p>
          Ces données ne sont pas transmises à des tiers et ne quittent pas votre navigateur. Vous pouvez
          les effacer à tout moment en vidant les données du site dans les réglages de votre navigateur
          (cela supprime aussi le suivi de vos commandes depuis cet appareil).
        </p>
      </Block>

      <Block title="Aucun suivi tiers">
        <p>
          Pas de Google Analytics, pas de pixel publicitaire, pas de bouton de réseau social intégré qui
          vous pistrait à votre insu.
        </p>
      </Block>
    </>
  )
}

const PAGES = { legal: Legal, cgv: Cgv, privacy: Privacy, cookies: Cookies }

export default function LegalPage({ page, onBack }) {
  const Body = PAGES[page] ?? Legal
  return (
    <main className="bg-ivory pb-16 pt-24">
      <div className="container-x max-w-3xl">
        <button
          type="button"
          onClick={onBack}
          className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-inkSoft hover:text-ink"
        >
          ← Retour à la boutique
        </button>
        <h1 className="mt-5 font-serif text-[clamp(1.9rem,4vw,2.8rem)] font-light leading-tight text-ink">
          {TITLES[page] ?? TITLES.legal}
        </h1>
        <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-inkSoft">
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
        </p>
        <div className="mt-6 rounded-2xl border border-ink/12 bg-cream/50 p-5 sm:p-7">
          <Body />
        </div>
        <p className="mt-6 flex items-start gap-2 text-[11.5px] leading-relaxed text-inkSoft">
          <Icon name="shield" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-goldDeep" />
          Ces pages décrivent exactement ce que fait le site. Ce qui n’est pas encore renseigné est
          signalé « non renseigné » plutôt que complété par une valeur inventée.
        </p>
      </div>
    </main>
  )
}
