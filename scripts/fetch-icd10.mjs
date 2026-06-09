import { mkdir, writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const ROOT_URL     = 'https://icd.who.int/browse10/2019/en/JsonGetRootConcepts'
const CHILDREN_URL = 'https://icd.who.int/browse10/2019/en/JsonGetChildrenConcepts'

let fetched = 0

// Concurrency queue
function makeQueue(limit) {
  let active = 0
  const pending = []
  function next() {
    while (active < limit && pending.length) {
      const { fn, resolve, reject } = pending.shift()
      active++
      fn().then(resolve, reject).finally(() => { active--; next() })
    }
  }
  return fn => new Promise((resolve, reject) => { pending.push({ fn, resolve, reject }); next() })
}
const queue = makeQueue(5)

async function fetchJson(url, retries = 4) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`)
      fetched++
      process.stdout.write(`\rRequests sent: ${fetched}`)
      return await res.json()
    } catch (err) {
      if (attempt === retries) throw err
      await new Promise(r => setTimeout(r, 600 * (attempt + 1)))
    }
  }
}

// Root entries: {ID, html}  — strip HTML to get description; code === ID (Roman numeral)
function parseRootHtml(html) {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
  const i = text.indexOf(' ')
  return i === -1 ? { code: text, description: '' } : { code: text.slice(0, i), description: text.slice(i + 1) }
}

// Child entries: {ID, label}  — "A00-A09 Intestinal infectious diseases"
function parseLabel(label) {
  const i = label.indexOf(' ')
  return i === -1 ? { code: label, description: '' } : { code: label.slice(0, i), description: label.slice(i + 1) }
}

async function buildNode(id, code, description) {
  const raw = await queue(() =>
    fetchJson(`${CHILDREN_URL}?ConceptId=${encodeURIComponent(id)}&useHtml=false`)
  )

  const node = { code, description }
  if (!raw || raw.length === 0) return node

  node.children = await Promise.all(
    raw.map(child => {
      const childId = child.ID
      const { code: c, description: d } = child.label
        ? parseLabel(child.label)
        : child.html ? parseRootHtml(child.html) : { code: childId, description: '' }

      if (child.isLeaf || !childId) return Promise.resolve({ code: c, description: d })
      return buildNode(childId, c, d)
    })
  )

  return node
}

async function main() {
  console.log('Fetching ICD-10 2019 root chapters…')
  const roots = await fetchJson(ROOT_URL)
  console.log(`Found ${roots.length} chapters. Traversing full tree — this takes a few minutes…`)

  const chapters = await Promise.all(
    roots.map(r => {
      const id = r.ID
      const { code, description } = r.label ? parseLabel(r.label) : parseRootHtml(r.html ?? '')
      return buildNode(id, code, description)
    })
  )

  console.log(`\nFetched ${fetched} responses total. Writing file…`)

  const output = {
    version:     'ICD-10 2019',
    source:      'https://icd.who.int/browse10/2019/en',
    generatedAt: new Date().toISOString(),
    chapters,
  }

  const __dir = dirname(fileURLToPath(import.meta.url))
  const outDir = join(__dir, '..', 'docs', 'json')
  await mkdir(outDir, { recursive: true })

  const outFile = join(outDir, 'icd10.json')
  await writeFile(outFile, JSON.stringify(output, null, 2), 'utf8')

  const { size } = await import('fs').then(m => m.statSync(outFile))
  console.log(`Saved → docs/json/icd10.json  (${(size / 1024 / 1024).toFixed(1)} MB)`)
}

main().catch(err => { console.error('\nFailed:', err.message); process.exit(1) })
