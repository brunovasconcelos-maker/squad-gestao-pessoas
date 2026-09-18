import { useMemo, useState } from 'react'
import closeIcon from '../../assets/icons/Close.svg'
import magnifyingGlassIcon from '../../assets/icons/MagnifyingGlass.svg'
import WizardShell from '../addCollaborator/WizardShell.jsx'
import '../addCollaborator/buttons.css'
import '../addCollaborator/Step1BasicInfo.css'
import '../addCollaborator/SelectListModal.css'
import './Step3Beneficiarios.css'

function Step3Beneficiarios({
  colaboradorIds,
  teamNames,
  cargoNames,
  todaEmpresa,
  onToggleColaborador,
  onToggleTeam,
  onToggleCargo,
  onToggleTodaEmpresa,
  collaborators,
  times,
  cargos,
  onBack,
  onExit,
  onContinue,
}) {
  const [query, setQuery] = useState('')

  const entities = useMemo(() => {
    const list = [{ type: 'company', key: '__company__', label: 'Toda a empresa' }]
    collaborators.forEach((collaborator) =>
      list.push({ type: 'colaborador', key: collaborator.id, label: collaborator.name }),
    )
    times.forEach((team) => list.push({ type: 'time', key: team.name, label: `${team.name} (time)` }))
    cargos.forEach((cargo) => list.push({ type: 'cargo', key: cargo.name, label: `${cargo.name} (cargo)` }))
    return list
  }, [collaborators, times, cargos])

  const isSelected = (entity) => {
    if (entity.type === 'company') return todaEmpresa
    if (entity.type === 'colaborador') return colaboradorIds.has(entity.key)
    if (entity.type === 'time') return teamNames.has(entity.key)
    return cargoNames.has(entity.key)
  }

  const toggle = (entity) => {
    if (entity.type === 'company') onToggleTodaEmpresa()
    else if (entity.type === 'colaborador') onToggleColaborador(entity.key)
    else if (entity.type === 'time') onToggleTeam(entity.key)
    else onToggleCargo(entity.key)
  }

  const trimmedQuery = query.trim().toLowerCase()
  const available = entities.filter((entity) => !isSelected(entity))
  const filtered = trimmedQuery
    ? available.filter((entity) => entity.label.toLowerCase().includes(trimmedQuery))
    : available

  const chips = entities.filter(isSelected)

  return (
    <WizardShell
      title="Novo Benefício"
      onClose={onExit}
      progress={75}
      footerLeft={
        <button type="button" className="text-button" onClick={onBack}>
          Voltar
        </button>
      }
      footerRight={
        <button type="button" className="pill-button" onClick={onContinue}>
          Continuar
        </button>
      }
    >
      <div className="step1">
        <p className="step3-beneficiarios__section-label">
          Adicionar colaboradores, times, cargos ou empresa toda
        </p>

        {chips.length > 0 && (
          <div className="step3-beneficiarios__chips">
            {chips.map((chip) => (
              <span className="step3-beneficiarios__chip" key={`${chip.type}-${chip.key}`}>
                {chip.label}
                <button
                  type="button"
                  className="step3-beneficiarios__chip-remove"
                  onClick={() => toggle(chip)}
                  aria-label={`Remover ${chip.label}`}
                >
                  <img src={closeIcon} alt="" width={14} height={14} />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="select-list__search">
          <input
            type="text"
            className="select-list__search-input"
            placeholder="Buscar por colaborador, time, cargo ou empresa toda..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <img src={magnifyingGlassIcon} alt="" width={24} height={24} />
        </div>

        <div className="select-list__list">
          {filtered.map((entity) => (
            <button
              type="button"
              key={`${entity.type}-${entity.key}`}
              className="select-list__item"
              onClick={() => {
                toggle(entity)
                setQuery('')
              }}
            >
              <span
                className={
                  entity.type === 'company'
                    ? 'select-list__item-label step3-beneficiarios__company-label'
                    : 'select-list__item-label'
                }
              >
                {entity.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </WizardShell>
  )
}

export default Step3Beneficiarios
