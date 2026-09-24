import { useEffect, useMemo, useRef, useState } from 'react'
import CltShell from '../../addCollaborator/clt/CltShell.jsx'
import Checkbox from '../../addCollaborator/Checkbox.jsx'
import closeIcon from '../../../assets/icons/Close.svg'
import magnifyingGlassIcon from '../../../assets/icons/MagnifyingGlass.svg'
import { useDropdownPosition } from '../../../utils/useDropdownPosition.js'
import { getTeamColorTones, getTeamIconComponent } from '../../../utils/teamOptions.js'
import '../../addCollaborator/buttons.css'
import '../../addCollaborator/clt/CltShell.css'
import '../../addTeam/novoTime/NovoTimeSteps.css'
import '../Step3Beneficiarios.css'
import './NovoBeneficioSteps.css'

const MAX_TEAM_SUGGESTIONS = 3

function BeneficioBeneficiariosStep({
  colaboradorIds,
  teamNames,
  todaEmpresa,
  onChange,
  collaborators,
  times,
  onBack,
  onClose,
  onContinue,
}) {
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const searchRef = useRef(null)
  const rect = useDropdownPosition(searchOpen, searchRef)

  useEffect(() => {
    if (!searchOpen) return
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [searchOpen])

  const suggestedTeams = useMemo(() => {
    return [...times]
      .map((team) => ({
        ...team,
        memberCount: collaborators.filter((collaborator) => collaborator.times.includes(team.name))
          .length,
      }))
      .sort((a, b) => b.memberCount - a.memberCount)
      .slice(0, MAX_TEAM_SUGGESTIONS)
  }, [times, collaborators])

  const toggleTodaEmpresa = () => onChange({ colaboradorIds, teamNames, todaEmpresa: !todaEmpresa })

  const toggleTeam = (name) => {
    const next = new Set(teamNames)
    if (next.has(name)) {
      next.delete(name)
    } else {
      next.add(name)
    }
    onChange({ colaboradorIds, teamNames: next, todaEmpresa })
  }

  const toggleColaborador = (id) => {
    const next = new Set(colaboradorIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    onChange({ colaboradorIds: next, teamNames, todaEmpresa })
  }

  const trimmedQuery = query.trim().toLowerCase()
  const searchEntities = useMemo(() => {
    const list = []
    times.forEach((team) => list.push({ type: 'time', key: team.name, label: `${team.name} (time)` }))
    collaborators.forEach((collaborator) =>
      list.push({ type: 'colaborador', key: collaborator.id, label: collaborator.name }),
    )
    return list
  }, [collaborators, times])

  const filteredEntities = trimmedQuery
    ? searchEntities.filter((entity) => entity.label.toLowerCase().includes(trimmedQuery))
    : searchEntities

  const isEntitySelected = (entity) =>
    entity.type === 'time' ? teamNames.has(entity.key) : colaboradorIds.has(entity.key)

  const toggleEntity = (entity) => {
    if (entity.type === 'time') {
      toggleTeam(entity.key)
    } else {
      toggleColaborador(entity.key)
    }
  }

  // Chips summarize every current selection (search-added individuals and
  // teams beyond the top-3 suggestion row included), each removable - the
  // same at-a-glance pattern BeneficiariosModal already uses.
  const chips = []
  if (todaEmpresa) chips.push({ type: 'company', key: '__company__', label: 'Toda a empresa' })
  times.forEach((team) => {
    if (teamNames.has(team.name)) chips.push({ type: 'time', key: team.name, label: team.name })
  })
  collaborators.forEach((collaborator) => {
    if (colaboradorIds.has(collaborator.id)) {
      chips.push({ type: 'colaborador', key: collaborator.id, label: collaborator.name })
    }
  })

  const removeChip = (chip) => {
    if (chip.type === 'company') toggleTodaEmpresa()
    else if (chip.type === 'time') toggleTeam(chip.key)
    else toggleColaborador(chip.key)
  }

  return (
    <CltShell
      title="Novo Benefício"
      onClose={onClose}
      progress={60}
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
      <div className="clt-shell__content">
        <h1 className="clt-shell__title">
          Quem vai receber
          <br />
          esse benefício?
        </h1>

        <div>
          <div className="time-step__search" ref={searchRef}>
            <input
              type="text"
              className="time-step__search-input"
              placeholder="Buscar nome ou time..."
              value={query}
              onFocus={() => setSearchOpen(true)}
              onChange={(event) => {
                setQuery(event.target.value)
                setSearchOpen(true)
              }}
            />
            <img src={magnifyingGlassIcon} alt="" width={24} height={24} />

            {searchOpen && rect && (
              <div
                className="time-step__search-dropdown"
                style={{ top: rect.top, left: rect.left, width: rect.width }}
              >
                {filteredEntities.length === 0 && (
                  <p className="time-step__search-dropdown-empty">Nenhum resultado.</p>
                )}
                {filteredEntities.map((entity) => (
                  <button
                    type="button"
                    key={`${entity.type}-${entity.key}`}
                    className="time-step__search-dropdown-item"
                    onClick={() => toggleEntity(entity)}
                  >
                    {isEntitySelected(entity) ? '✓ ' : ''}
                    {entity.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {chips.length > 0 && (
            <div className="step3-beneficiarios__chips" style={{ marginTop: 12 }}>
              {chips.map((chip) => (
                <span className="step3-beneficiarios__chip" key={`${chip.type}-${chip.key}`}>
                  {chip.label}
                  <button
                    type="button"
                    className="step3-beneficiarios__chip-remove"
                    onClick={() => removeChip(chip)}
                    aria-label={`Remover ${chip.label}`}
                  >
                    <img src={closeIcon} alt="" width={14} height={14} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="beneficio-step__beneficiarios-grid" style={{ marginTop: 12 }}>
            <button
              type="button"
              className={
                todaEmpresa
                  ? 'beneficio-step__beneficiario-card beneficio-step__beneficiario-card--selected'
                  : 'beneficio-step__beneficiario-card'
              }
              onClick={toggleTodaEmpresa}
            >
              <Checkbox checked={todaEmpresa} />
              <div className="beneficio-step__beneficiario-info">
                <span className="beneficio-step__beneficiario-name">Toda a empresa</span>
                <span className="beneficio-step__beneficiario-count">
                  {collaborators.length} pessoas
                </span>
              </div>
            </button>

            {suggestedTeams.map((team) => {
              const { light, dark } = getTeamColorTones(team.color)
              const TeamIcon = getTeamIconComponent(team.icon)
              const checked = teamNames.has(team.name)
              return (
                <button
                  type="button"
                  key={team.id}
                  className={
                    checked
                      ? 'beneficio-step__beneficiario-card beneficio-step__beneficiario-card--selected'
                      : 'beneficio-step__beneficiario-card'
                  }
                  onClick={() => toggleTeam(team.name)}
                >
                  <Checkbox checked={checked} />
                  <span className="beneficio-step__beneficiario-badge" style={{ background: light }}>
                    <TeamIcon size={16} color={dark} />
                  </span>
                  <div className="beneficio-step__beneficiario-info">
                    <span className="beneficio-step__beneficiario-name">{team.name}</span>
                    <span className="beneficio-step__beneficiario-count">
                      {team.memberCount} pessoas
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </CltShell>
  )
}

export default BeneficioBeneficiariosStep
