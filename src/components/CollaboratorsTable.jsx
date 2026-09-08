import { useState } from 'react'
import arrowsDownUpIcon from '../assets/icons/ArrowsDownUp.svg'
import caretDownIcon from '../assets/icons/CaretDown.svg'
import closeIcon from '../assets/icons/Close.svg'
import iconButtonIcon from '../assets/icons/Icon-Button.svg'
import IconButton from './IconButton.jsx'
import { getCollection, COLLECTIONS } from '../utils/storage.js'
import { formatShortDatePt } from '../utils/formatters.js'
import './CollaboratorsTable.css'

const FILTER_COLUMNS = [
  { id: 'time', label: 'Time' },
  { id: 'cargo', label: 'Cargo' },
  { id: 'atividade', label: 'Atividade' },
]

function getActiveSince(collaborator) {
  return collaborator.dataAdmissao ?? collaborator.dataInicioContrato ?? null
}

function ActivityTag({ contractType }) {
  if (contractType === 'Freelancer') {
    return (
      <span className="collaborators-table__tag collaborators-table__tag--freelancer">
        Freelancer
      </span>
    )
  }
  if (contractType === 'Consultor') {
    return (
      <span className="collaborators-table__tag collaborators-table__tag--consultor">
        Consultor
      </span>
    )
  }
  return null
}

function SortableHeaderCell({ label, active, onClick }) {
  return (
    <button
      type="button"
      className="collaborators-table__header-cell collaborators-table__header-cell--button"
      onClick={onClick}
    >
      <span>{label}</span>
      <img
        src={active ? closeIcon : arrowsDownUpIcon}
        width={16}
        height={16}
        alt=""
      />
    </button>
  )
}

function CollaboratorsTable() {
  const [collaborators] = useState(() => getCollection(COLLECTIONS.COLABORADORES))
  const [sortColumn, setSortColumn] = useState(null)

  const toggleSort = (column) => {
    setSortColumn((prev) => (prev === column ? null : column))
  }

  let sortedCollaborators = collaborators
  if (sortColumn === 'nome') {
    sortedCollaborators = [...collaborators].sort((a, b) =>
      a.name.localeCompare(b.name, 'pt-BR'),
    )
  } else if (sortColumn === 'ativo-desde') {
    sortedCollaborators = [...collaborators].sort((a, b) => {
      const dateA = getActiveSince(a)
      const dateB = getActiveSince(b)
      if (dateA === null && dateB === null) return 0
      if (dateA === null) return 1
      if (dateB === null) return -1
      return dateA.localeCompare(dateB)
    })
  }

  return (
    <div className="collaborators-table">
      <div className="collaborators-table__header">
        <SortableHeaderCell
          label="Nome"
          active={sortColumn === 'nome'}
          onClick={() => toggleSort('nome')}
        />
        {FILTER_COLUMNS.slice(0, 2).map((column) => (
          <div className="collaborators-table__header-cell" key={column.id}>
            <span>{column.label}</span>
            <img src={caretDownIcon} width={16} height={16} alt="" />
          </div>
        ))}
        <SortableHeaderCell
          label="Ativo desde"
          active={sortColumn === 'ativo-desde'}
          onClick={() => toggleSort('ativo-desde')}
        />
        <div className="collaborators-table__header-cell">
          <span>{FILTER_COLUMNS[2].label}</span>
          <img src={caretDownIcon} width={16} height={16} alt="" />
        </div>
        <div className="collaborators-table__header-spacer" />
      </div>

      <div className="collaborators-table__body">
        {sortedCollaborators.map((collaborator) => {
          const activeSince = getActiveSince(collaborator)
          return (
            <div className="collaborators-table__row" key={collaborator.id}>
              <div className="collaborators-table__cell collaborators-table__cell--nome">
                {collaborator.name}
              </div>
              <div className="collaborators-table__cell collaborators-table__cell--secondary">
                {collaborator.times.join(', ')}
              </div>
              <div className="collaborators-table__cell collaborators-table__cell--secondary">
                {collaborator.cargos.join(', ')}
              </div>
              <div className="collaborators-table__cell collaborators-table__cell--secondary">
                {activeSince ? formatShortDatePt(activeSince) : ''}
              </div>
              <div className="collaborators-table__cell">
                <ActivityTag contractType={collaborator.contractType} />
              </div>
              <IconButton
                icon={iconButtonIcon}
                alt="Mais opções"
                size={40}
                iconSize={40}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CollaboratorsTable
