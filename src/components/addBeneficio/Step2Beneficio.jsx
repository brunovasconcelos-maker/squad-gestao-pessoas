import { useState } from 'react'
import radioButtonIcon from '../../assets/icons/RadioButton.svg'
import circleIcon from '../../assets/icons/Circle.svg'
import plusIcon from '../../assets/icons/Plus.svg'
import magnifyingGlassIcon from '../../assets/icons/MagnifyingGlass.svg'
import WizardShell from '../addCollaborator/WizardShell.jsx'
import { BENEFICIO_PROVIDER_SUGGESTIONS, getBeneficioTypeIcon } from '../../utils/beneficioOptions.js'
import '../addCollaborator/buttons.css'
import '../addCollaborator/Step1BasicInfo.css'
import '../addCollaborator/RadioListModal.css'
import '../addCollaborator/SelectListModal.css'
import '../addCollaborator/LargeFieldInput.css'
import './Step2Beneficio.css'

const OUTRO_NAME_COPY = {
  Fixo: { label: 'Nome do benefício', placeholder: 'Ex: Netflix corporativo' },
  Verba: { label: 'Título da verba', placeholder: 'Ex: Verba de home office' },
}

function ProviderStep({
  tipo,
  providerName,
  onProviderNameChange,
  onBack,
  onExit,
  onContinue,
}) {
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(!providerName)

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

  const selectProvider = (name) => {
    onProviderNameChange(name)
    setEditing(false)
    setQuery('')
  }

  return (
    <WizardShell
      title="Novo Benefício"
      onClose={onExit}
      progress={50}
      footerLeft={
        <button type="button" className="text-button" onClick={onBack}>
          Voltar
        </button>
      }
      footerRight={
        <button
          type="button"
          className="pill-button"
          disabled={!providerName}
          onClick={onContinue}
        >
          Continuar
        </button>
      }
    >
      <div className="step1">
        <p className="step2-beneficio__label">Qual o fornecedor?</p>

        {!editing && providerName ? (
          <button
            type="button"
            className="step2-beneficio__selected-row"
            onClick={() => {
              setEditing(true)
              setQuery('')
            }}
          >
            <span className="step2-beneficio__selected-icon">
              <IconComponent size={20} />
            </span>
            <span className="step2-beneficio__selected-name">{providerName}</span>
            <span className="step2-beneficio__selected-change">Trocar</span>
          </button>
        ) : (
          <>
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
                  onClick={() => selectProvider(suggestion)}
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
                  onClick={() => selectProvider(trimmedQuery)}
                >
                  <span className="select-list__create-label">
                    Adicionar: &quot;{trimmedQuery}&quot;
                  </span>
                  <img src={plusIcon} alt="" width={24} height={24} />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </WizardShell>
  )
}

function OutroStep({
  outroSubtipo,
  onOutroSubtipoChange,
  outroName,
  onOutroNameChange,
  onBack,
  onExit,
  onContinue,
}) {
  const canContinue = Boolean(outroSubtipo) && outroName.trim().length > 0
  const nameCopy = outroSubtipo ? OUTRO_NAME_COPY[outroSubtipo] : null

  const handleSubtipoChange = (value) => {
    if (value !== outroSubtipo) {
      onOutroNameChange('')
    }
    onOutroSubtipoChange(value)
  }

  return (
    <WizardShell
      title="Novo Benefício"
      onClose={onExit}
      progress={50}
      footerLeft={
        <button type="button" className="text-button" onClick={onBack}>
          Voltar
        </button>
      }
      footerRight={
        <button
          type="button"
          className="pill-button"
          disabled={!canContinue}
          onClick={onContinue}
        >
          Continuar
        </button>
      }
    >
      <div className="step1">
        <p className="step2-beneficio__label">Fixo ou verba?</p>
        <div className="radio-list-modal__options">
          {['Fixo', 'Verba'].map((option) => {
            const isSelected = option === outroSubtipo
            return (
              <button
                type="button"
                key={option}
                className="radio-list-modal__option"
                onClick={() => handleSubtipoChange(option)}
              >
                <img
                  src={isSelected ? radioButtonIcon : circleIcon}
                  alt=""
                  width={24}
                  height={24}
                />
                <span className="radio-list-modal__option-label">{option}</span>
              </button>
            )
          })}
        </div>

        {nameCopy && (
          <div className="step2-beneficio__outro-name">
            <p className="step2-beneficio__label">{nameCopy.label}</p>
            <input
              type="text"
              autoFocus
              className="large-field-input"
              placeholder={nameCopy.placeholder}
              value={outroName}
              onChange={(event) => onOutroNameChange(event.target.value)}
            />
          </div>
        )}
      </div>
    </WizardShell>
  )
}

function Step2Beneficio(props) {
  return props.tipo === 'Outro' ? <OutroStep {...props} /> : <ProviderStep {...props} />
}

export default Step2Beneficio
