import { useEffect, useRef, useState } from 'react'
import userIcon from '../../assets/icons/User.svg'
import { useDropdownPosition } from '../../utils/useDropdownPosition.js'
import '../addCollaborator/SelectListModal.css'
import './ColaboradorDetail.css'

function ReportaParaField({ value, ownId, collaborators, disabled, onSave }) {
  const [editing, setEditing] = useState(false)
  const [query, setQuery] = useState('')
  const anchorRef = useRef(null)
  const rect = useDropdownPosition(editing, anchorRef)

  useEffect(() => {
    if (!editing) return
    function handleClickOutside(event) {
      if (anchorRef.current && !anchorRef.current.contains(event.target)) {
        setEditing(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [editing])

  const trimmedQuery = query.trim().toLowerCase()
  const candidates = collaborators.filter((collaborator) => collaborator.id !== ownId)
  const filtered = trimmedQuery
    ? candidates.filter((collaborator) => collaborator.name.toLowerCase().includes(trimmedQuery))
    : candidates

  const select = (name) => {
    onSave(name)
    setEditing(false)
    setQuery('')
  }

  const startEdit = () => {
    if (disabled) return
    setQuery('')
    setEditing(true)
  }

  if (!editing) {
    return (
      <button
        type="button"
        className="colaborador-detail__value-button colaborador-field__reporta-display"
        onClick={startEdit}
        disabled={disabled}
      >
        {value ? (
          <>
            <span className="colaborador-field__avatar">
              <img src={userIcon} alt="" width={12} height={12} />
            </span>
            {value}
          </>
        ) : (
          'Adicionar'
        )}
      </button>
    )
  }

  return (
    <div className="colaborador-field" ref={anchorRef}>
      <input
        type="text"
        autoFocus
        className="colaborador-field__inline-search-input"
        placeholder="Buscar colaborador..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      {rect && (
        <div
          className="colaborador-field__dropdown"
          style={{ top: rect.top, right: rect.right }}
        >
          <div className="select-list__list">
            {filtered.map((collaborator) => (
              <button
                type="button"
                key={collaborator.id}
                className="select-list__item"
                onClick={() => select(collaborator.name)}
              >
                <span className="colaborador-field__avatar">
                  <img src={userIcon} alt="" width={12} height={12} />
                </span>
                <span className="select-list__item-label">{collaborator.name}</span>
              </button>
            ))}
            {filtered.length === 0 && <p className="select-list__empty">Ninguém encontrado.</p>}
          </div>
        </div>
      )}
    </div>
  )
}

export default ReportaParaField
