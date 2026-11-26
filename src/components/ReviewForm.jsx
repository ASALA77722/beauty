import { useMemo, useState } from 'react'
import { PRODUCTS } from '../data/shop'
import { useAuth } from '../hooks/useAuth'
import { useSubmitReview } from '../hooks/useReviews'
import { loadOrdersForReview } from '../lib/reviewHelpers'
import Icon from './Icon'
import Stars from './Stars'

/** Dépôt d'un avis : note obligatoire, preuve d'achat facultative. */
export default function ReviewForm({ onClose, productId: initialProduct }) {
  const { user } = useAuth()
  const submit = useSubmitReview()
  const orders = useMemo(() => loadOrdersForReview(), [])
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    productId: initialProduct ?? PRODUCTS[0].id,
    rating: 0,
    title: '',
    body: '',
    name: user?.firstName ? `${user.firstName} ${user.lastName ?? ''}`.trim() : '',
    orderRef: orders[0]?.reference ?? '',
    city: orders[0]?.delivery?.city ?? '',
    wouldRecommend: null,
    photos: [],
  })

  const update = (key) => (event) => setForm({ ...form, [key]: event.target.value })

  const matchingOrders = orders.filter((order) =>
    order.items.some((item) => item.id === form.productId),
  )

  const onFile = (event) => {
    const files = [...(event.target.files ?? [])].slice(0, 3)
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        const image = new Image()
        image.onload = () => {
          // redimensionne pour ne pas alourdir le stockage local
          const max = 720
          const scale = Math.min(1, max / Math.max(image.width, image.height))
          const canvas = document.createElement('canvas')
          canvas.width = Math.round(image.width * scale)
          canvas.height = Math.round(image.height * scale)
          canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.72)
          setForm((current) => ({
            ...current,
            photos: [...current.photos, dataUrl].slice(0, 3),
          }))
        }
        image.src = reader.result
      }
      reader.readAsDataURL(file)
    })
  }

  const save = () => {
    if (form.rating < 1) {
      setError('Choisissez une note de 1 à 5 étoiles.')
      return
    }
    if (form.body.trim().length < 20) {
      setError('Décrivez votre expérience en quelques mots (20 caractères minimum).')
      return
    }
    if (!form.name.trim()) {
      setError('Indiquez le prénom qui sera affiché avec votre avis.')
      return
    }
    submit(form)
    setError(null)
    setSent(true)
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 animate-fade-in bg-ink/60" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Écrire un avis"
        className="relative z-10 max-h-[92vh] w-full max-w-lg animate-fade-up overflow-y-auto bg-ivory p-5 shadow-soft sm:rounded-2xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-goldDeep">Votre avis</p>
            <h2 className="mt-1 font-serif text-2xl">Parlez de votre soin</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 hover:bg-cream"
            aria-label="Fermer"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>

        {sent ? (
          <div className="py-8 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage/15 text-sage">
              <Icon name="check" className="h-6 w-6" />
            </span>
            <h3 className="mt-3 font-serif text-2xl">Merci, votre avis est publié</h3>
            <p className="mx-auto mt-2 max-w-sm text-[12.5px] leading-relaxed text-inkSoft">
              Il apparaît immédiatement dans la section Avis, sous votre prénom. Vous pouvez encore le
              modifier pendant 24 h.
            </p>
            <button type="button" onClick={onClose} className="btn-dark mt-4">
              Voir les avis
            </button>
          </div>
        ) : (
          <>
            <div className="mt-4">
              <label htmlFor="rv-product" className="text-[10.5px] uppercase tracking-[0.12em] text-inkSoft">
                Produit concerné
              </label>
              <select
                id="rv-product"
                value={form.productId}
                onChange={(event) =>
                  setForm({
                    ...form,
                    productId: event.target.value,
                    orderRef: '',
                  })
                }
                className="field mt-1.5"
              >
                {PRODUCTS.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <p className="text-[10.5px] uppercase tracking-[0.12em] text-inkSoft">Votre note</p>
              <div className="mt-1.5 flex items-center gap-3">
                <Stars
                  value={form.rating}
                  interactive
                  onChange={(rating) => setForm({ ...form, rating })}
                  label="Note du produit"
                />
                <span className="text-[11.5px] text-inkSoft">
                  {form.rating ? `${form.rating}/5` : 'Touchez les étoiles'}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="rv-title" className="text-[10.5px] uppercase tracking-[0.12em] text-inkSoft">
                Titre (facultatif)
              </label>
              <input
                id="rv-title"
                value={form.title}
                onChange={update('title')}
                maxLength={70}
                placeholder="En un mot : efficace, décevant, surprenant…"
                className="field mt-1.5"
              />
            </div>

            <div className="mt-3">
              <label htmlFor="rv-body" className="text-[10.5px] uppercase tracking-[0.12em] text-inkSoft">
                Votre expérience
              </label>
              <textarea
                id="rv-body"
                value={form.body}
                onChange={update('body')}
                rows={5}
                maxLength={1200}
                placeholder="Texture, résultat, délai, ce qui vous a plu ou déplu…"
                className="field mt-1.5 resize-none"
              />
              <p className="mt-1 text-right text-[10px] text-inkSoft">{form.body.length}/1200</p>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="rv-name" className="text-[10.5px] uppercase tracking-[0.12em] text-inkSoft">
                  Prénom affiché
                </label>
                <input id="rv-name" value={form.name} onChange={update('name')} className="field mt-1.5" />
              </div>
              <div>
                <label htmlFor="rv-city" className="text-[10.5px] uppercase tracking-[0.12em] text-inkSoft">
                  Ville (facultatif)
                </label>
                <input id="rv-city" value={form.city} onChange={update('city')} className="field mt-1.5" />
              </div>
            </div>

            <div className="mt-3">
              <label htmlFor="rv-order" className="text-[10.5px] uppercase tracking-[0.12em] text-inkSoft">
                Numéro de commande (facultatif)
              </label>
              {matchingOrders.length > 0 ? (
                <>
                  <select
                    id="rv-order"
                    value={form.orderRef}
                    onChange={update('orderRef')}
                    className="field mt-1.5"
                  >
                    <option value="">Ne pas afficher « achat vérifié »</option>
                    {matchingOrders.map((order) => (
                      <option key={order.reference} value={order.reference}>
                        {order.reference} — {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-[10px] text-inkSoft">
                    En choisissant une commande, votre avis porte la mention « achat vérifié ».
                  </p>
                </>
              ) : (
                <input
                  id="rv-order"
                  value={form.orderRef}
                  onChange={update('orderRef')}
                  placeholder="BP-260101-1234"
                  className="field mt-1.5"
                />
              )}
            </div>

            <div className="mt-3">
              <p className="text-[10.5px] uppercase tracking-[0.12em] text-inkSoft">
                Photos (facultatif, 3 maximum)
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={onFile}
                className="mt-1.5 block w-full text-[11px] text-inkSoft file:mr-2 file:rounded-full file:border-0 file:bg-cream file:px-3 file:py-1.5 file:text-[10.5px] file:font-medium file:text-ink"
              />
              {form.photos.length > 0 && (
                <div className="mt-2 flex gap-2">
                  {form.photos.map((src, index) => (
                    <span key={index} className="relative">
                      <img src={src} alt="" className="h-16 w-16 rounded-lg object-cover" />
                      <button
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            photos: form.photos.filter((_, i) => i !== index),
                          })
                        }
                        className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-ivory"
                        aria-label="Retirer la photo"
                      >
                        <Icon name="close" className="h-2.5 w-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4">
              <p className="text-[10.5px] uppercase tracking-[0.12em] text-inkSoft">
                Recommandez-vous ce produit ?
              </p>
              <div className="mt-1.5 flex gap-2">
                {[
                  { value: true, label: 'Oui' },
                  { value: false, label: 'Non' },
                ].map((choice) => (
                  <button
                    key={String(choice.value)}
                    type="button"
                    onClick={() => setForm({ ...form, wouldRecommend: choice.value })}
                    aria-pressed={form.wouldRecommend === choice.value}
                    className={`rounded-full border px-3 py-1.5 text-[11px] ${
                      form.wouldRecommend === choice.value
                        ? 'border-forest bg-forest text-cream'
                        : 'border-ink/15 text-inkSoft hover:text-ink'
                    }`}
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="mt-3 rounded-lg bg-rose/10 px-3 py-2 text-[11.5px] text-rose" role="alert">
                {error}
              </p>
            )}

            <button type="button" onClick={save} className="btn-gold mt-4 w-full">
              <Icon name="send" className="h-4 w-4" />
              Publier mon avis
            </button>
            <p className="mt-2 text-center text-[10px] leading-relaxed text-inkSoft">
              Votre avis est publié immédiatement sous votre prénom, sans modification de notre part.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
