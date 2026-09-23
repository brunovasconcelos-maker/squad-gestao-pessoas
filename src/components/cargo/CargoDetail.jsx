import { useEffect, useMemo, useRef, useState } from 'react'
import { FileText, PiggyBank, UsersFour, NotePencil, FrameCorners, Plus, X } from '@phosphor-icons/react'
import closeIcon from '../../assets/icons/Close.svg'
import trashIcon from '../../assets/icons/Trash.svg'
import briefcaseIcon from '../../assets/icons/Briefcase.svg'
import userIcon from '../../assets/icons/User.svg'
import backToModalIcon from '../../assets/icons/Back-to-Modal.svg'
import IconButton from '../IconButton.jsx'
import DescricaoModal from '../addTeam/DescricaoModal.jsx'
import MembrosModal from '../addTeam/MembrosModal.jsx'
import ReportaAModal from '../addCargo/ReportaAModal.jsx'
import DeleteCargoModal from './DeleteCargoModal.jsx'
import RemoveCargoMemberModal from './RemoveCargoMemberModal.jsx'
import { COLLECTIONS, getCollection, setCollection, getCollaboratorActiveSince } from '../../utils/storage.js'
import { formatDateDMonthYear, formatFaixaSalarial } from '../../utils/formatters.js'
import { getTeamColorTones } from '../../utils/teamOptions.js'
import './CargoDetail.css'

function getInitials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function computeAverageTenureMonths(members) {
  const now = new Date()
  const monthsList = members
    .map((member) => getCollaboratorActiveSince(member))
    .filter(Boolean)
    .map((iso) => {
      const [year, month, day] = iso.split('-').map(Number)
      const start = new Date(year, month - 1, day)
      const totalMonths =
        (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
      return Math.max(totalMonths, 0)
    })
  if (monthsList.length === 0) return null
  return monthsList.reduce((sum, value) => sum + value, 0) / monthsList.length
}

function formatTenure(months) {
  if (months == null) return '—'
  const rounded = Math.round(months)
  const years = Math.floor(rounded / 12)
  const remMonths = rounded % 12
  return `${years}a ${remMonths}m`
}

function CargoDetail({ id, mode, onClose, onExpand, onCollapse, onDataChanged }) {
  const [cargos, setCargos] = useState(() => getCollection(COLLECTIONS.CARGOS))
  const [collaborators, setCollaborators] = useState(() => getCollection(COLLECTIONS.COLABORADORES))
  const times = getCollection(COLLECTIONS.TIMES)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [removeMemberTarget, setRemoveMemberTarget] = useState(null)
  const [openFieldModal, setOpenFieldModal] = useState(null)
  const [descExpanded, setDescExpanded] = useState(false)
  const [addingNota, setAddingNota] = useState(false)
  const [notaText, setNotaText] = useState('')
  const notaInputRef = useRef(null)
  const notaSavingRef = useRef(false)

  const [entered, setEntered] = useState(() => mode === 'full')

  useEffect(() => {
    if (entered) return
    const frame = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(frame)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const cargo = cargos.find((item) => item.id === id) ?? null

  const persistCargos = (updatedCargos) => {
    setCollection(COLLECTIONS.CARGOS, updatedCargos)
    setCargos(updatedCargos)
  }

  const persistCollaborators = (updatedCollaborators) => {
    setCollection(COLLECTIONS.COLABORADORES, updatedCollaborators)
    setCollaborators(updatedCollaborators)
    onDataChanged?.(updatedCollaborators)
  }

  const updateCargoField = (field, value) => {
    if (!cargo) return
    persistCargos(cargos.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const members = useMemo(() => {
    if (!cargo) return []
    return collaborators.filter(
      (collaborator) => Array.isArray(collaborator.cargos) && collaborator.cargos.includes(cargo.name),
    )
  }, [collaborators, cargo])

  if (!cargo) return null

  const handleDelete = () => {
    const updatedCargos = cargos.filter((item) => item.id !== id)
    setCollection(COLLECTIONS.CARGOS, updatedCargos)

    const updatedCollaborators = collaborators.map((collaborator) =>
      Array.isArray(collaborator.cargos) && collaborator.cargos.includes(cargo.name)
        ? { ...collaborator, cargos: collaborator.cargos.filter((name) => name !== cargo.name) }
        : collaborator,
    )
    setCollection(COLLECTIONS.COLABORADORES, updatedCollaborators)
    onDataChanged?.(updatedCollaborators)
    onClose()
  }

  const handleRemoveMember = (memberId) => {
    const updated = collaborators.map((collaborator) =>
      collaborator.id === memberId
        ? { ...collaborator, cargos: collaborator.cargos.filter((name) => name !== cargo.name) }
        : collaborator,
    )
    persistCollaborators(updated)
  }

  const startAddNota = () => {
    setNotaText('')
    setAddingNota(true)
  }

  const cancelAddNota = () => {
    setAddingNota(false)
    setNotaText('')
  }

  const saveNota = () => {
    const trimmed = notaText.trim()
    if (!trimmed) {
      cancelAddNota()
      return
    }
    notaSavingRef.current = true
    const notas = [...(cargo.notas ?? []), { text: trimmed, timestamp: new Date().toISOString() }]
    updateCargoField('notas', notas)
    setAddingNota(false)
    setNotaText('')
  }

  const handleNotaBlur = () => {
    if (notaSavingRef.current) {
      notaSavingRef.current = false
      return
    }
    cancelAddNota()
  }

  const avgTenureMonths = computeAverageTenureMonths(members)

  const faixaSalarialText = useMemo(() => {
    const fixoSalaries = members
      .filter((member) => (member.contractType || 'Fixo') === 'Fixo' && member.salario != null)
      .map((member) => member.salario)
    const min = fixoSalaries.length ? Math.min(...fixoSalaries) : null
    const max = fixoSalaries.length ? Math.max(...fixoSalaries) : null
    return formatFaixaSalarial(min, max)
  }, [members])

  const timesAssociadosText = useMemo(() => {
    const teamNameSet = new Set()
    members.forEach((member) => (member.times ?? []).forEach((name) => teamNameSet.add(name)))
    return teamNameSet.size ? Array.from(teamNameSet).join(', ') : '—'
  }, [members])

  const reportaDerived = useMemo(
    () => Array.from(new Set(members.map((member) => member.reportaPara).filter(Boolean))),
    [members],
  )
  const reportaExtra = cargo.reportaAExtra ?? []
  const reportaAll = useMemo(
    () => Array.from(new Set([...reportaDerived, ...reportaExtra])),
    [reportaDerived, reportaExtra],
  )
  const reportaText = reportaAll.length ? reportaAll.join(', ') : '—'

  const timeCounts = useMemo(() => {
    const map = new Map()
    members.forEach((member) => {
      ;(member.times ?? []).forEach((teamName) => {
        map.set(teamName, (map.get(teamName) ?? 0) + 1)
      })
    })
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1])
  }, [members])

  const contractPercentages = useMemo(() => {
    const counts = { Fixo: 0, Freelancer: 0, Consultor: 0 }
    members.forEach((member) => {
      const type = member.contractType || 'Fixo'
      if (counts[type] != null) counts[type] += 1
    })
    const total = members.length
    return {
      Fixo: total ? Math.round((counts.Fixo / total) * 100) : 0,
      Freelancer: total ? Math.round((counts.Freelancer / total) * 100) : 0,
      Consultor: total ? Math.round((counts.Consultor / total) * 100) : 0,
    }
  }, [members])

  const nonMemberCollaborators = useMemo(() => {
    const memberIds = new Set(members.map((member) => member.id))
    return collaborators.filter((collaborator) => !memberIds.has(collaborator.id))
  }, [collaborators, members])

  const profileSection = (
    <div className="cargo-detail__profile">
      <span className="cargo-detail__badge">
        <img src={briefcaseIcon} alt="" width={24} height={24} />
      </span>
      <span className="cargo-detail__name">{cargo.name}</span>
    </div>
  )

  const infoList = (
    <div className="cargo-detail__info-list">
      <div className="cargo-detail__row cargo-detail__row--descricao">
        <FileText size={20} className="cargo-detail__row-icon" />
        <span className="cargo-detail__row-label">Descrição</span>
        <div className="cargo-detail__descricao-content">
          <p
            className={
              descExpanded
                ? 'cargo-detail__descricao-text'
                : 'cargo-detail__descricao-text cargo-detail__descricao-text--clamped'
            }
            onClick={() => setOpenFieldModal('descricao')}
          >
            {cargo.descricao || 'Adicionar'}
          </p>
          {cargo.descricao && (
            <button
              type="button"
              className="cargo-detail__ver-mais"
              onClick={(event) => {
                event.stopPropagation()
                setDescExpanded((value) => !value)
              }}
            >
              {descExpanded ? 'ver menos...' : 'ver mais...'}
            </button>
          )}
        </div>
      </div>

      <div className="cargo-detail__row">
        <PiggyBank size={20} className="cargo-detail__row-icon" />
        <span className="cargo-detail__row-label">Faixa salarial</span>
        <span className="cargo-detail__value-text">{faixaSalarialText}</span>
      </div>

      <div className="cargo-detail__row">
        <UsersFour size={20} className="cargo-detail__row-icon" />
        <span className="cargo-detail__row-label">Times</span>
        <span className="cargo-detail__value-text">{timesAssociadosText}</span>
      </div>

      <div className="cargo-detail__row">
        <img className="cargo-detail__row-icon" src={userIcon} alt="" width={20} height={20} />
        <span className="cargo-detail__row-label">Reporta para</span>
        <span className="cargo-detail__value-text cargo-detail__value-text--flex">{reportaText}</span>
        <button
          type="button"
          className="cargo-detail__reporta-add"
          onClick={() => setOpenFieldModal('reporta-a')}
          aria-label="Adicionar quem o cargo reporta"
        >
          <Plus size={20} color="#798282" />
        </button>
      </div>
    </div>
  )

  const notesSection = (
    <div className="cargo-detail__notes">
      {(cargo.notas ?? []).map((nota, index) => (
        <div className="cargo-detail__nota" key={index}>
          <span className="cargo-detail__nota-date">
            {formatDateDMonthYear(nota.timestamp.slice(0, 10))}
          </span>
          <p className="cargo-detail__nota-text">{nota.text}</p>
        </div>
      ))}

      {addingNota ? (
        <input
          ref={notaInputRef}
          type="text"
          autoFocus
          className="cargo-detail__add-nota-input"
          placeholder="Escreva uma nota..."
          value={notaText}
          onChange={(event) => setNotaText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              notaSavingRef.current = true
              saveNota()
            }
            if (event.key === 'Escape') cancelAddNota()
          }}
          onBlur={handleNotaBlur}
        />
      ) : (
        <button type="button" className="cargo-detail__add-nota" onClick={startAddNota}>
          <NotePencil size={20} color="var(--color-text-secondary)" />
          Adicionar nota
        </button>
      )}
    </div>
  )

  const metricsSection = (
    <div className="cargo-detail__metrics">
      <p className="cargo-detail__section-label">Métricas</p>

      <div className="cargo-detail__stats-row">
        <div className="cargo-detail__stat-card">
          <span className="cargo-detail__stat-label">Total de colaboradores</span>
          <span className="cargo-detail__stat-value">{members.length}</span>
        </div>
        <div className="cargo-detail__stat-card">
          <span className="cargo-detail__stat-label">Tempo média de casa</span>
          <span className="cargo-detail__stat-value">{formatTenure(avgTenureMonths)}</span>
        </div>
      </div>

      <div className="cargo-detail__stat-card">
        <span className="cargo-detail__stat-label">Times representados</span>
        {timeCounts.length === 0 ? (
          <span className="cargo-detail__time-name">—</span>
        ) : (
          timeCounts.map(([teamName, count]) => (
            <div className="cargo-detail__time-row" key={teamName}>
              <span className="cargo-detail__time-name">{teamName}</span>
              <span className="cargo-detail__time-count">{count}</span>
            </div>
          ))
        )}
      </div>

      <div className="cargo-detail__stat-card">
        <span className="cargo-detail__contract-label">Tipo de contratação</span>
        <div className="cargo-detail__contract-bar">
          <span style={{ flex: contractPercentages.Fixo || 0.0001, background: '#039300' }} />
          <span style={{ flex: contractPercentages.Freelancer || 0.0001, background: '#2a79d7' }} />
          <span style={{ flex: contractPercentages.Consultor || 0.0001, background: '#fbb21a' }} />
        </div>
        <p className="cargo-detail__contract-legend">
          Fixo: {contractPercentages.Fixo}% | Freelancer: {contractPercentages.Freelancer}% |
          Consultor: {contractPercentages.Consultor}%
        </p>
      </div>
    </div>
  )

  const membrosSection = (
    <div className="cargo-detail__membros">
      <div className="cargo-detail__section-header">
        <p className="cargo-detail__section-label cargo-detail__section-label--flex">Membros</p>
        <button
          type="button"
          className="cargo-detail__add-membro-button"
          onClick={() => setOpenFieldModal('membros')}
        >
          Add membro
          <Plus size={20} color="#798282" />
        </button>
      </div>

      <div className="cargo-detail__member-list">
        {members.map((member) => {
          const memberTeamName = member.times?.[0]
          const memberTeamRecord = times.find((team) => team.name === memberTeamName)
          const { dark } = getTeamColorTones(memberTeamRecord?.color)
          return (
            <div className="cargo-detail__member-row" key={member.id}>
              <span className="cargo-detail__member-avatar" style={{ background: dark }}>
                {getInitials(member.name)}
              </span>
              <div className="cargo-detail__member-info">
                <span className="cargo-detail__member-name">{member.name}</span>
                <span className="cargo-detail__member-time">{memberTeamName ?? ''}</span>
              </div>
              <button
                type="button"
                className="cargo-detail__member-remove"
                onClick={() => setRemoveMemberTarget(member)}
                aria-label="Remover deste cargo"
              >
                <X size={24} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div
      className={[
        'cargo-detail',
        mode === 'full' ? 'cargo-detail--full' : 'cargo-detail--panel',
        entered ? 'cargo-detail--entered' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <header className="cargo-detail__header">
        <IconButton icon={closeIcon} alt="Fechar" onClick={onClose} />
        <span className="cargo-detail__header-title">Cargo</span>
        <IconButton icon={trashIcon} alt="Excluir" onClick={() => setDeleteModalOpen(true)} />
        {mode === 'full' ? (
          <button
            type="button"
            className="icon-button cargo-detail__expand-button"
            onClick={onCollapse}
            aria-label="Recolher"
          >
            <img src={backToModalIcon} alt="" width={24} height={24} />
          </button>
        ) : (
          <button
            type="button"
            className="icon-button cargo-detail__expand-button"
            onClick={onExpand}
            aria-label="Expandir"
          >
            <FrameCorners size={24} />
          </button>
        )}
      </header>

      <div className="cargo-detail__scroll">
        {mode === 'full' ? (
          <div className="cargo-detail__columns">
            <div className="cargo-detail__column cargo-detail__column--main">
              {profileSection}
              {infoList}
              {metricsSection}
              {membrosSection}
            </div>
            <div className="cargo-detail__column cargo-detail__column--notes">{notesSection}</div>
          </div>
        ) : (
          <>
            {profileSection}
            {infoList}
            {notesSection}
            {metricsSection}
            {membrosSection}
          </>
        )}
      </div>

      {deleteModalOpen && (
        <DeleteCargoModal
          name={cargo.name}
          onCancel={() => setDeleteModalOpen(false)}
          onConfirm={handleDelete}
        />
      )}

      {removeMemberTarget && (
        <RemoveCargoMemberModal
          name={removeMemberTarget.name}
          onCancel={() => setRemoveMemberTarget(null)}
          onConfirm={() => {
            handleRemoveMember(removeMemberTarget.id)
            setRemoveMemberTarget(null)
          }}
        />
      )}

      {openFieldModal === 'descricao' && (
        <DescricaoModal
          value={cargo.descricao}
          onClose={() => setOpenFieldModal(null)}
          onSave={(descricao) => {
            updateCargoField('descricao', descricao)
            setOpenFieldModal(null)
          }}
        />
      )}

      {openFieldModal === 'reporta-a' && (
        <ReportaAModal
          collaborators={collaborators}
          excludedNames={reportaAll}
          value={[]}
          onClose={() => setOpenFieldModal(null)}
          onSave={(newNames) => {
            const merged = Array.from(new Set([...(cargo.reportaAExtra ?? []), ...newNames]))
            updateCargoField('reportaAExtra', merged)
            setOpenFieldModal(null)
          }}
        />
      )}

      {openFieldModal === 'membros' && (
        <MembrosModal
          title="Adicionar membros"
          collaborators={nonMemberCollaborators}
          value={[]}
          onClose={() => setOpenFieldModal(null)}
          onSave={(newIds) => {
            const newIdSet = new Set(newIds)
            const updated = collaborators.map((collaborator) =>
              newIdSet.has(collaborator.id) && !collaborator.cargos.includes(cargo.name)
                ? { ...collaborator, cargos: [...collaborator.cargos, cargo.name] }
                : collaborator,
            )
            persistCollaborators(updated)
            setOpenFieldModal(null)
          }}
        />
      )}
    </div>
  )
}

export default CargoDetail
