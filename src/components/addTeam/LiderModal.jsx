import { useState } from 'react'
import magnifyingGlassIcon from '../../assets/icons/MagnifyingGlass.svg'
import radioButtonIcon from '../../assets/icons/RadioButton.svg'
import circleIcon from '../../assets/icons/Circle.svg'
import FieldModalShell from '../addCollaborator/FieldModalShell.jsx'
import '../addCollaborator/SelectListModal.css'

function LiderModal({ value, members, onSave, onClose }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(value ?? null)

  const trimmedQuery = query.trim().toLowerCase()
  const filteredMembers = trimmedQuery
    ? members.filter((member) => member.name.toLowerCase().includes(trimmedQuery))
    : members

  return (
    <FieldModalShell
      title="Líder do time"
      onClose={onClose}
      onSave={() => onSave(selected)}
    >
      {members.length === 0 ? (
        <p className="select-list__empty">
          Adicione membros ao time antes de escolher um líder.
        </p>
      ) : (
        <>
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
            {filteredMembers.map((member) => {
              const isSelected = selected === member.id
              return (
                <button
                  type="button"
                  key={member.id}
                  className="select-list__item"
                  onClick={() => setSelected(isSelected ? null : member.id)}
                >
                  <img
                    src={isSelected ? radioButtonIcon : circleIcon}
                    alt=""
                    width={24}
                    height={24}
                  />
                  <span className="select-list__item-label">{member.name}</span>
                </button>
              )
            })}
          </div>
        </>
      )}
    </FieldModalShell>
  )
}

export default LiderModal
