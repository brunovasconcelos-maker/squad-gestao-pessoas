export const COLLECTIONS = {
  CARGOS: 'cargos',
  TIMES: 'times',
  COLABORADORES: 'colaboradores',
}

function readCollection(name) {
  try {
    const raw = localStorage.getItem(name)
    if (raw === null) return null
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

function writeCollection(name, items) {
  localStorage.setItem(name, JSON.stringify(items))
}

export function generateId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
}

export function getCollection(name) {
  return readCollection(name) ?? []
}

export function setCollection(name, items) {
  writeCollection(name, items)
}

export function addItem(name, item) {
  const items = getCollection(name)
  const newItem = { id: generateId(), ...item }
  writeCollection(name, [...items, newItem])
  return newItem
}

export function removeItems(name, ids) {
  const idSet = new Set(ids)
  const items = getCollection(name).filter((item) => !idSet.has(item.id))
  writeCollection(name, items)
  return items
}

export function duplicateItems(name, ids) {
  const idSet = new Set(ids)
  const items = getCollection(name)
  const duplicates = items
    .filter((item) => idSet.has(item.id))
    .map((item) => ({
      ...item,
      id: generateId(),
      name: `${item.name} (cópia)`,
    }))
  const updated = [...items, ...duplicates]
  writeCollection(name, updated)
  return updated
}

function ensureSeeded(name, seedFactory) {
  if (readCollection(name) !== null) return
  writeCollection(name, seedFactory())
}

export function seedInitialData() {
  ensureSeeded(COLLECTIONS.CARGOS, () =>
    [
      'Designer de Produto Senior',
      'Designer de Produto Pleno',
      'Designer de Produto Junior',
      'Designer Gráfico',
      'Head de Produto',
      'Head de Marketing',
    ].map((name) => ({ id: generateId(), name, pending: false })),
  )
}

// One-time cleanup for browsers whose "times" collection was seeded by an
// earlier version of seedInitialData with example data ("Design", "Vendas",
// "Marketing", all pending: false). That seed has been removed; this undoes
// its effects wherever it already ran, without touching times created for
// real. Naturally a no-op once a given browser's storage no longer matches
// the old seed signature, so it's safe to run on every load.
const LEGACY_SEEDED_TIME_NAMES = ['Vendas', 'Marketing']

export function cleanupLegacySeedTimes() {
  const times = readCollection(COLLECTIONS.TIMES)
  if (times === null) return

  const colaboradores = readCollection(COLLECTIONS.COLABORADORES) ?? []
  const hasMembers = (teamName) =>
    colaboradores.some(
      (colaborador) =>
        Array.isArray(colaborador.times) && colaborador.times.includes(teamName),
    )

  let changed = false

  const withoutLegacySeeds = times.filter((time) => {
    const isLegacySeedSignature =
      LEGACY_SEEDED_TIME_NAMES.includes(time.name) &&
      !time.pending &&
      !hasMembers(time.name)
    if (isLegacySeedSignature) {
      changed = true
      return false
    }
    return true
  })

  const withDesignPendingFixed = withoutLegacySeeds.map((time) => {
    if (time.name === 'Design' && !time.pending) {
      changed = true
      return { ...time, pending: true }
    }
    return time
  })

  if (changed) {
    writeCollection(COLLECTIONS.TIMES, withDesignPendingFixed)
  }
}
