import { useState } from 'react'
import magnifyingGlassIcon from '../../assets/icons/MagnifyingGlass.svg'
import radioButtonIcon from '../../assets/icons/RadioButton.svg'
import circleIcon from '../../assets/icons/Circle.svg'
import FieldModalShell from './FieldModalShell.jsx'
import { getCollection, COLLECTIONS } from '../../utils/storage.js'
import './SelectListModal.css'

function ReportaParaModal({ value, onSave, onClose }) {
  const [items] = useState(() => getCollection(COLLECTIONS.COLABORADORES))
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(value ?? null)

  const trimmedQuery = query.trim().toLowerCase()
  const filtered = trimmedQuery
    ? items.filter((item) => item.name.toLowerCase().includes(trimmedQuery))
    : items

  return (
    <FieldModalShell
      title="Reporta para"
      onClose={onClose}
      onSave={() => onSave(selected)}
    >
      <div className="select-list__search">
        <input
          type="text"
          autoFocus
          className="select-list__search-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <img src={magnifyingGlassIcon} alt="" width={24} height={24} />
      </div>

      <div className="select-list__list">
        {filtered.map((item) => {
          const isSelected = selected === item.name
          return (
            <button
              type="button"
              key={item.id}
              className="select-list__item"
              onClick={() => setSelected(isSelected ? null : item.name)}
            >
              <img
                src={isSelected ? radioButtonIcon : circleIcon}
                alt=""
                width={24}
                height={24}
              />
              <span className="select-list__item-label">
                {item.name} ({item.cargo})
              </span>
            </button>
          )
        })}
      </div>
    </FieldModalShell>
  )
}

export default ReportaParaModal
