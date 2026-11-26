import { SHOP } from '../config'

/**
 * Envoi du code de connexion par e-mail, sans serveur.
 *
 * FormSubmit est un relais gratuit : le premier envoi déclenche un e-mail
 * d'activation dans la boîte du destinataire — il suffit de cliquer une fois
 * sur le lien, ensuite tous les codes arrivent normalement.
 */
export async function sendLoginCode({ to, code, minutes }) {
  const endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(SHOP.authEmail)}`
  const text = [
    `${SHOP.name} — votre code de connexion`,
    '',
    `Code : ${code}`,
    `Valable ${minutes} minutes.`,
    '',
    "Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.",
  ].join('\n')

  const body = {
    _subject: `${SHOP.name} — code de connexion ${code}`,
    _template: 'table',
    _captcha: 'false',
    code,
    message: text,
    destinataire: to,
    demande: new Date().toLocaleString('fr-FR'),
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) throw new Error('mail_failed')
  return true
}
