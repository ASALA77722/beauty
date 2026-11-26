import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'
const browser = await puppeteer.launch({ args: [...chromium.args], executablePath: await chromium.executablePath(), headless: 'shell' })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 })
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 60000 })
await page.evaluate(() => document.fonts.ready)
await new Promise(r => setTimeout(r, 900))
await page.evaluate(() => document.querySelector('#boutique')?.scrollIntoView()); await new Promise(r => setTimeout(r, 700))
await page.screenshot({ path: 'apercu/v3-catalogue.png' })

// mobile + ouverture du panier
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 })
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 800))
await page.screenshot({ path: 'apercu/v3-mobile-hero.png' })
await page.evaluate(() => { const b = [...document.querySelectorAll('button[aria-label^="Ajouter "]')]; b[1]?.click(); b[0]?.click() })
await new Promise(r => setTimeout(r, 400))
await page.evaluate(() => document.querySelector('button[aria-label^="Ouvrir le panier"]')?.click())
await new Promise(r => setTimeout(r, 900))
await page.screenshot({ path: 'apercu/v3-mobile-panier.png' })
const m = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > window.innerWidth }))
console.log('mobile overflow:', m.overflow)
await browser.close()
