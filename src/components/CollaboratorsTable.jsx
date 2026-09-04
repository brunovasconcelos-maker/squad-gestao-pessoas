import { ArrowsDownUp, CaretDown } from '@phosphor-icons/react'
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
    return <ArrowsDownUp size={16} color="var(--color-text-secondary)" />
  }
  return <CaretDown size={16} color="var(--color-text-secondary)" />
}

function CollaboratorsTable() {
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
      <div className="collaborators-table__body" />
    </div>
  )
}

export default CollaboratorsTable
