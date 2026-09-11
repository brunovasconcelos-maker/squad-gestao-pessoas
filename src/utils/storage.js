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

  ensureSeeded(COLLECTIONS.TIMES, () =>
    ['Design', 'Vendas', 'Marketing'].map((name) => ({
      id: generateId(),
      name,
      pending: false,
    })),
  )
}
