import { useEffect, useState } from 'react'
import closeIcon from '../../../assets/icons/Close.svg'
import IconButton from '../../IconButton.jsx'
import Checkbox from '../../addCollaborator/Checkbox.jsx'
import '../../addCollaborator/buttons.css'
import '../../addCollaborator/SelectListModal.css'
import '../../addCollaborator/clt/SidePanel.css'
import './NovoBeneficioSteps.css'

// The same 428px side-panel shell already used for Novo Cargo/Novo Time
// quick-create. A plain checklist, no search - anyone already assigned to
// a different value variant shows checked-and-disabled, since they must be
// unassigned via that other variant's own Atribuir panel first.
function BeneficioAtribuirPanel({ people, value, assignedElsewhere, onClose, onSave }) {
  const [selected, setSelected] = useState(() => new Set(value))
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  const toggle = (id) => {
    if (assignedElsewhere.has(id)) return
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <>
      <div className="clt-side-panel-overlay" onClick={onClose} />
      <div className={entered ? 'clt-side-panel clt-side-panel--entered' : 'clt-side-panel'}>
        <div className="clt-side-panel__header">
          <span className="clt-side-panel__title">Atribuir</span>
          <IconButton icon={closeIcon} alt="Fechar" onClick={onClose} />
        </div>

        <div className="clt-side-panel__body">
          <div className="beneficio-step__atribuir-list">
            {people.map((person) => {
              const disabledElsewhere = assignedElsewhere.has(person.id)
              const checked = disabledElsewhere || selected.has(person.id)
              return (
                <button
                  type="button"
                  key={person.id}
                  className="beneficio-step__atribuir-row"
                  disabled={disabledElsewhere}
                  onClick={() => toggle(person.id)}
                >
                  <Checkbox checked={checked} />
                  <span className="beneficio-step__atribuir-name">{person.name}</span>
                </button>
              )
            })}

            {people.length === 0 && (
              <p className="select-list__empty">Ninguém para atribuir ainda.</p>
            )}
          </div>
        </div>

        <div className="clt-side-panel__footer">
          <button type="button" className="text-button" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className="pill-button"
            onClick={() => onSave(Array.from(selected))}
          >
            Salvar
          </button>
        </div>
      </div>
    </>
  )
}

export default BeneficioAtribuirPanel
