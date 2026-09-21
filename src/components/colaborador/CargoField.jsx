import { useEffect, useRef, useState } from 'react'
import plusIcon from '../../assets/icons/Plus.svg'
import { useDropdownPosition } from '../../utils/useDropdownPosition.js'
import { addItem, COLLECTIONS } from '../../utils/storage.js'
import '../addCollaborator/SelectListModal.css'
import './ColaboradorDetail.css'

function CargoField({ value, cargos, disabled, onSave }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const anchorRef = useRef(null)
  const rect = useDropdownPosition(open, anchorRef)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(event) {
      if (anchorRef.current && !anchorRef.current.contains(event.target)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const displayValue = value.length ? value.join(', ') : 'Adicionar'
  const trimmedQuery = query.trim()
  const filtered = trimmedQuery
    ? cargos.filter((cargo) => cargo.name.toLowerCase().includes(trimmedQuery.toLowerCase()))
    : cargos
  const exactMatch = cargos.some(
    (cargo) => cargo.name.toLowerCase() === trimmedQuery.toLowerCase(),
  )
  const showCreate = trimmedQuery.length > 0 && !exactMatch

  const select = (name) => {
    onSave([name])
    setOpen(false)
    setQuery('')
  }

  const handleCreate = () => {
    const newCargo = addItem(COLLECTIONS.CARGOS, { name: trimmedQuery, pending: true })
    select(newCargo.name)
  }

  return (
    <div className="colaborador-field" ref={anchorRef}>
      <button
        type="button"
        className="colaborador-detail__value-button"
        onClick={() => !disabled && setOpen((prev) => !prev)}
        disabled={disabled}
      >
        {displayValue}
      </button>

      {open && rect && (
        <div
          className="colaborador-field__dropdown"
          style={{ top: rect.top, right: rect.right }}
        >
          <div className="select-list__search">
            <input
              type="text"
              autoFocus
              className="select-list__search-input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="select-list__list">
            {filtered.map((cargo) => (
              <button
                type="button"
                key={cargo.id}
                className="select-list__item"
                onClick={() => select(cargo.name)}
              >
                <span className="select-list__item-label">{cargo.name}</span>
              </button>
            ))}

            {showCreate && (
              <button type="button" className="select-list__create" onClick={handleCreate}>
                <span className="select-list__create-label">
                  Criar cargo: &quot;{trimmedQuery}&quot;
                </span>
                <img src={plusIcon} alt="" width={24} height={24} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CargoField
