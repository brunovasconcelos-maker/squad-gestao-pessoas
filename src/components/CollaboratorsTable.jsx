import { useState } from 'react'
import arrowsDownUpIcon from '../assets/icons/ArrowsDownUp.svg'
import caretDownIcon from '../assets/icons/CaretDown.svg'
import { getCollection, COLLECTIONS } from '../utils/storage.js'
import { formatShortDatePt } from '../utils/formatters.js'
import './CollaboratorsTable.css'

const COLUMNS = [
  { id: 'nome', label: 'Nome', icon: 'sort' },
  { id: 'time', label: 'Time', icon: 'caret' },
  { id: 'cargo', label: 'Cargo', icon: 'caret' },
  { id: 'ativo-desde', label: 'Ativo desde', icon: 'sort' },
  { id: 'atividade', label: 'Atividade', icon: 'caret' },
]

function ColumnIcon({ type }) {
  if (type === 'sort') {
    return <img src={arrowsDownUpIcon} width={16} height={16} alt="" />
  }
  return <img src={caretDownIcon} width={16} height={16} alt="" />
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

function CollaboratorsTable() {
  const [collaborators] = useState(() => getCollection(COLLECTIONS.COLABORADORES))

  return (
    <div className="collaborators-table">
      <div className="collaborators-table__header">
        {COLUMNS.map((column) => (
          <div className="collaborators-table__header-cell" key={column.id}>
            <span>{column.label}</span>
            <ColumnIcon type={column.icon} />
          </div>
        ))}
      </div>
      <div className="collaborators-table__body">
        {collaborators.map((collaborator) => (
          <div className="collaborators-table__row" key={collaborator.id}>
            <div className="collaborators-table__cell">{collaborator.name}</div>
            <div className="collaborators-table__cell">
              {collaborator.times.join(', ')}
            </div>
            <div className="collaborators-table__cell">
              {collaborator.cargos.join(', ')}
            </div>
            <div className="collaborators-table__cell">
              {collaborator.dataAdmissao
                ? formatShortDatePt(collaborator.dataAdmissao)
                : ''}
            </div>
            <div className="collaborators-table__cell">
              <ActivityTag contractType={collaborator.contractType} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CollaboratorsTable
