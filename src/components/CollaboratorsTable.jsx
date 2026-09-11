import { useEffect, useMemo, useRef, useState } from 'react'
import arrowsDownUpIcon from '../assets/icons/ArrowsDownUp.svg'
import caretDownIcon from '../assets/icons/CaretDown.svg'
import closeIcon from '../assets/icons/Close.svg'
import squareIcon from '../assets/icons/Square.svg'
import checkSquareIcon from '../assets/icons/CheckSquare.svg'
import dotsThreeIcon from '../assets/icons/DotsThree.svg'
import IconButton from './IconButton.jsx'
import ActivityTag from './ActivityTag.jsx'
import { formatShortDatePt } from '../utils/formatters.js'
import { getCollection, COLLECTIONS } from '../utils/storage.js'
import './CollaboratorsTable.css'

const ATIVIDADE_OPTIONS = ['Freelancer', 'Consultor', 'Desligado']

function getActiveSince(collaborator) {
  return collaborator.dataAdmissao ?? collaborator.dataInicioContrato ?? null
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

function FilterHeaderCell({
  label,
  options,
  selected,
  isOpen,
  onHeaderClick,
  onToggleOption,
  containerRef,
}) {
  const icon = isOpen || selected.size > 0 ? closeIcon : caretDownIcon
  return (
    <div className="collaborators-table__header-filter" ref={containerRef}>
      <button
        type="button"
        className="collaborators-table__header-cell collaborators-table__header-cell--button"
        onClick={onHeaderClick}
      >
        <span>{label}</span>
        <img src={icon} width={16} height={16} alt="" />
      </button>
      {isOpen && (
        <div className="collaborators-table__filter-dropdown">
          {options.map((option) => {
            const checked = selected.has(option)
            return (
              <button
                type="button"
                className="collaborators-table__filter-option"
                onClick={() => onToggleOption(option)}
                key={option}
              >
                <img
                  src={checked ? checkSquareIcon : squareIcon}
                  width={20}
                  height={20}
                  alt=""
                />
                <span>{option}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function CollaboratorsTable({
  collaborators,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
  columnFilters,
  onToggleFilterOption,
  onClearFilter,
}) {
  const [sortColumn, setSortColumn] = useState(null)
  const [openColumn, setOpenColumn] = useState(null)
  const containerRefs = useRef({})

  const timeOptions = useMemo(
    () => getCollection(COLLECTIONS.TIMES).map((item) => item.name),
    [],
  )
  const cargoOptions = useMemo(
    () => getCollection(COLLECTIONS.CARGOS).map((item) => item.name),
    [],
  )

  useEffect(() => {
    if (openColumn === null) return
    function handleClickOutside(event) {
      const ref = containerRefs.current[openColumn]
      if (ref && !ref.contains(event.target)) {
        setOpenColumn(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openColumn])

  const handleHeaderClick = (columnId) => {
    if (openColumn === columnId) {
      setOpenColumn(null)
    } else if (columnFilters[columnId].size > 0) {
      onClearFilter(columnId)
    } else {
      setOpenColumn(columnId)
    }
  }

  const toggleSort = (column) => {
    setSortColumn((prev) => (prev === column ? null : column))
  }

  const allIds = collaborators.map((collaborator) => collaborator.id)
  const selectedCount = allIds.filter((id) => selectedIds.has(id)).length
  const allSelected = allIds.length > 0 && selectedCount === allIds.length

  const handleHeaderCheckboxClick = () => {
    if (allSelected) {
      onDeselectAll()
    } else {
      onSelectAll(allIds)
    }
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
        <button
          type="button"
          className="collaborators-table__checkbox-cell"
          onClick={handleHeaderCheckboxClick}
        >
          <img
            src={allSelected ? checkSquareIcon : squareIcon}
            width={24}
            height={24}
            alt=""
          />
        </button>
        <SortableHeaderCell
          label="Nome"
          active={sortColumn === 'nome'}
          onClick={() => toggleSort('nome')}
        />
        <FilterHeaderCell
          label="Time"
          options={timeOptions}
          selected={columnFilters.time}
          isOpen={openColumn === 'time'}
          onHeaderClick={() => handleHeaderClick('time')}
          onToggleOption={(option) => onToggleFilterOption('time', option)}
          containerRef={(el) => {
            containerRefs.current.time = el
          }}
        />
        <FilterHeaderCell
          label="Cargo"
          options={cargoOptions}
          selected={columnFilters.cargo}
          isOpen={openColumn === 'cargo'}
          onHeaderClick={() => handleHeaderClick('cargo')}
          onToggleOption={(option) => onToggleFilterOption('cargo', option)}
          containerRef={(el) => {
            containerRefs.current.cargo = el
          }}
        />
        <SortableHeaderCell
          label="Ativo desde"
          active={sortColumn === 'ativo-desde'}
          onClick={() => toggleSort('ativo-desde')}
        />
        <FilterHeaderCell
          label="Atividade"
          options={ATIVIDADE_OPTIONS}
          selected={columnFilters.atividade}
          isOpen={openColumn === 'atividade'}
          onHeaderClick={() => handleHeaderClick('atividade')}
          onToggleOption={(option) => onToggleFilterOption('atividade', option)}
          containerRef={(el) => {
            containerRefs.current.atividade = el
          }}
        />
        <div className="collaborators-table__header-spacer" />
      </div>

      <div className="collaborators-table__body">
        {sortedCollaborators.map((collaborator) => {
          const activeSince = getActiveSince(collaborator)
          const isSelected = selectedIds.has(collaborator.id)
          return (
            <div
              className={
                isSelected
                  ? 'collaborators-table__row collaborators-table__row--selected'
                  : 'collaborators-table__row'
              }
              key={collaborator.id}
            >
              <button
                type="button"
                className="collaborators-table__checkbox-cell"
                onClick={() => onToggleSelect(collaborator.id)}
              >
                <img
                  src={isSelected ? checkSquareIcon : squareIcon}
                  width={24}
                  height={24}
                  alt=""
                />
              </button>
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
              <IconButton icon={dotsThreeIcon} alt="Mais opções" iconSize={24} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CollaboratorsTable
