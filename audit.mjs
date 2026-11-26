import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'
const browser = await puppeteer.launch({ args: [...chromium.args], executablePath: await chromium.executablePath(), headless: 'shell' })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 })
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 60000 })
await page.evaluate(() => document.fonts.ready)
await new Promise(r => setTimeout(r, 800))

// rapport de défauts mesurés
const audit = await page.evaluate(() => {
  const out = { overflowX: document.documentElement.scrollWidth > window.innerWidth, problems: [] }
  if (out.overflowX) out.problems.push(`débordement horizontal: ${document.documentElement.scrollWidth}px > ${window.innerWidth}px`)

  // textes trop petits
  const small = []
  document.querySelectorAll('p,span,li,a,button,dt,dd').forEach(el => {
    const t = el.textContent.trim()
    if (!t || el.children.length) return
    const fs = parseFloat(getComputedStyle(el).fontSize)
    const r = el.getBoundingClientRect()
    if (fs < 10.5 && r.width > 0) small.push(`${fs}px « ${t.slice(0, 30)} »`)
  })
  if (small.length) out.problems.push(`${small.length} textes < 10.5px — ex: ${small.slice(0, 4).join(' | ')}`)

  // zones cliquables trop petites
  const tiny = []
  document.querySelectorAll('button, a').forEach(el => {
    const r = el.getBoundingClientRect()
    if (r.width > 0 && r.height > 0 && (r.height < 32 || r.width < 32)) {
      tiny.push(`${Math.round(r.width)}x${Math.round(r.height)} « ${el.textContent.trim().slice(0, 20) || el.getAttribute('aria-label') || ''} »`)
    }
  })
  if (tiny.length) out.problems.push(`${tiny.length} cibles < 32px — ex: ${tiny.slice(0, 4).join(' | ')}`)

  // images sans alt
  const noAlt = [...document.querySelectorAll('img')].filter(i => !i.alt).length
  if (noAlt) out.problems.push(`${noAlt} images sans alt`)

  // hauteur du hero vs écran
  const hero = document.querySelector('#top')
  if (hero) out.heroRatio = +(hero.getBoundingClientRect().height / window.innerHeight).toFixed(2)
  return out
})
console.log(JSON.stringify(audit, null, 2))

// captures de diagnostic
await page.screenshot({ path: 'apercu/diag-hero.png' })
await page.evaluate(() => window.scrollTo(0, 620)); await new Promise(r => setTimeout(r, 500))
await page.screenshot({ path: 'apercu/diag-catalogue.png' })
await page.evaluate(() => document.querySelector('#offres')?.scrollIntoView()); await new Promise(r => setTimeout(r, 600))
await page.screenshot({ path: 'apercu/diag-offres.png' })
await page.evaluate(() => document.querySelector('#boutique')?.scrollIntoView()); await new Promise(r => setTimeout(r, 600))
await page.screenshot({ path: 'apercu/diag-produits.png' })
await browser.close()
