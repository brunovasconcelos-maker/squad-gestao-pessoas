import { useState } from 'react'
import closeIcon from '../../assets/icons/Close.svg'
import magnifyingGlassIcon from '../../assets/icons/MagnifyingGlass.svg'
import plusIcon from '../../assets/icons/Plus.svg'
import IconButton from '../IconButton.jsx'
import ModalOverlay from '../addCollaborator/ModalOverlay.jsx'
import { BENEFICIO_PROVIDER_SUGGESTIONS, getBeneficioTypeIcon } from '../../utils/beneficioOptions.js'
import '../addCollaborator/FieldModalShell.css'
import '../addCollaborator/SelectListModal.css'
import './Step2Beneficio.css'

function ProviderModal({ tipo, onSelect, onClose }) {
  const [query, setQuery] = useState('')

  const IconComponent = getBeneficioTypeIcon(tipo)
  const suggestions = BENEFICIO_PROVIDER_SUGGESTIONS[tipo] ?? []
  const trimmedQuery = query.trim()
  const filtered = trimmedQuery
    ? suggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(trimmedQuery.toLowerCase()),
      )
    : suggestions
  const exactMatch = suggestions.some(
    (suggestion) => suggestion.toLowerCase() === trimmedQuery.toLowerCase(),
  )
  const showCreate = trimmedQuery.length > 0 && !exactMatch

  return (
    <ModalOverlay width={532} className="field-modal">
      <div className="field-modal__header">
        <h2 className="field-modal__title">Fornecedor</h2>
        <IconButton icon={closeIcon} alt="Fechar" onClick={onClose} />
      </div>

      <div className="field-modal__body">
        <div className="select-list__search">
          <input
            type="text"
            autoFocus
            className="select-list__search-input"
            placeholder="Buscar fornecedor..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <img src={magnifyingGlassIcon} alt="" width={24} height={24} />
        </div>

        <div className="select-list__list">
          {filtered.map((suggestion) => (
            <button
              type="button"
              key={suggestion}
              className="select-list__item"
              onClick={() => onSelect(suggestion)}
            >
              <span className="step2-beneficio__provider-item">
                <span className="step2-beneficio__provider-icon">
                  <IconComponent size={20} />
                </span>
                <span className="select-list__item-label">{suggestion}</span>
              </span>
            </button>
          ))}

          {showCreate && (
            <button
              type="button"
              className="select-list__create"
              onClick={() => onSelect(trimmedQuery)}
            >
              <span className="select-list__create-label">
                Adicionar: &quot;{trimmedQuery}&quot;
              </span>
              <img src={plusIcon} alt="" width={24} height={24} />
            </button>
          )}
        </div>
      </div>
    </ModalOverlay>
  )
}

export default ProviderModal
