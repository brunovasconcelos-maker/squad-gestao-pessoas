import { useEffect, useState } from 'react'
import closeIcon from '../assets/icons/Close.svg'
import closeIconWhite from '../assets/icons/CloseWhite.svg'
import IconButton from './IconButton.jsx'
import './FiltrosPanel.css'

const STATUS_OPTIONS = ['Pendente', 'Completo']

function FilterPill({ selected, onClick, children }) {
  return (
    <button
      type="button"
      className={
        selected
          ? 'filtros-panel__pill filtros-panel__pill--selected'
          : 'filtros-panel__pill'
      }
      onClick={onClick}
    >
      {children}
      {selected && <img src={closeIconWhite} width={20} height={20} alt="" />}
    </button>
  )
}

function NumberPillInput({ value, onChange, placeholder }) {
  return (
    <input
      type="number"
      inputMode="numeric"
      className="filtros-panel__number-pill"
      placeholder={placeholder}
      value={value ?? ''}
      onChange={(event) => {
        const raw = event.target.value
        onChange(raw === '' ? null : Number(raw))
      }}
    />
  )
}

function createEmptyDraft() {
  return { status: new Set(), pessoas: { min: null, max: null } }
}

function cloneFilters(filters) {
  return { status: new Set(filters.status), pessoas: { ...filters.pessoas } }
}

function TimesFiltrosPanel({ isOpen, onClose, filters, onSave }) {
  const [draft, setDraft] = useState(createEmptyDraft)

  useEffect(() => {
    if (isOpen) {
      setDraft(cloneFilters(filters))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const toggleStatus = (value) => {
    setDraft((prev) => {
      const next = new Set(prev.status)
      if (next.has(value)) {
        next.delete(value)
      } else {
        next.add(value)
      }
      return { ...prev, status: next }
    })
  }

  const setPessoas = (which, value) => {
    setDraft((prev) => ({ ...prev, pessoas: { ...prev.pessoas, [which]: value } }))
  }

  const handleCancel = () => {
    onClose()
  }

  const handleSave = () => {
    onSave(draft)
    onClose()
  }

  return (
    <>
      <div
        className={
          isOpen
            ? 'filtros-panel__overlay filtros-panel__overlay--open'
            : 'filtros-panel__overlay'
        }
        onClick={handleCancel}
      />
      <div
        className={
          isOpen ? 'filtros-panel filtros-panel--open' : 'filtros-panel'
        }
      >
        <div className="filtros-panel__header">
          <span className="filtros-panel__title">Filtros</span>
          <IconButton
            icon={closeIcon}
            alt="Fechar filtros"
            size={40}
            iconSize={24}
            onClick={handleCancel}
          />
        </div>

        <div className="filtros-panel__scroll">
          <section className="filtros-panel__section">
            <span className="filtros-panel__label">Status:</span>
            <div className="filtros-panel__pills">
              {STATUS_OPTIONS.map((option) => (
                <FilterPill
                  key={option}
                  selected={draft.status.has(option)}
                  onClick={() => toggleStatus(option)}
                >
                  {option}
                </FilterPill>
              ))}
            </div>
          </section>

          <section className="filtros-panel__section filtros-panel__section--last">
            <span className="filtros-panel__label">Número de pessoas:</span>
            <div className="filtros-panel__range-row">
              <NumberPillInput
                value={draft.pessoas.min}
                onChange={(value) => setPessoas('min', value)}
                placeholder="Mínimo"
              />
              <span className="filtros-panel__range-connector">a</span>
              <NumberPillInput
                value={draft.pessoas.max}
                onChange={(value) => setPessoas('max', value)}
                placeholder="Máximo"
              />
            </div>
          </section>
        </div>

        <div className="filtros-panel__footer">
          <button
            type="button"
            className="filtros-panel__cancel-button"
            onClick={handleCancel}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="filtros-panel__save-button"
            onClick={handleSave}
          >
            Salvar Filtros
          </button>
        </div>
      </div>
    </>
  )
}

export default TimesFiltrosPanel
