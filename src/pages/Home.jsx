import { useMemo, useState } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Tabs from '../components/Tabs.jsx'
import CollaboradoresToolbar from '../components/CollaboradoresToolbar.jsx'
import CollaboratorsTable from '../components/CollaboratorsTable.jsx'
import CollaboratorsGrid from '../components/CollaboratorsGrid.jsx'
import TimesToolbar from '../components/TimesToolbar.jsx'
import TimesGrid from '../components/TimesGrid.jsx'
import BulkActionBar from '../components/BulkActionBar.jsx'
import BottomSearchBar from '../components/BottomSearchBar.jsx'
import FiltrosPanel from '../components/FiltrosPanel.jsx'
import NovoModal from '../components/addCollaborator/NovoModal.jsx'
import AddCollaboratorFlow from '../components/addCollaborator/AddCollaboratorFlow.jsx'
import {
  getCollection,
  getCollaboratorActiveSince,
  removeItems,
  duplicateItems,
  COLLECTIONS,
} from '../utils/storage.js'
import { formatDateDMonthYear } from '../utils/formatters.js'
import './Home.css'

const TABS = [
  { id: 'colaboradores', label: 'Colaboradores' },
  { id: 'times', label: 'Times' },
  { id: 'cargos', label: 'Cargos' },
  { id: 'beneficios', label: 'Benefícios' },
]

const ATIVIDADE_OPTIONS = ['Fixo', 'Consultor', 'Freelancer']

function createEmptyColumnFilters() {
  return {
    time: new Set(),
    cargo: new Set(),
    atividade: new Set(),
    periodo: { start: null, end: null },
  }
}

function Home() {
  const [activeTab, setActiveTab] = useState('colaboradores')
  const [novoModalOpen, setNovoModalOpen] = useState(false)
  const [addCollaboratorFlowOpen, setAddCollaboratorFlowOpen] = useState(false)
  const [view, setView] = useState('table')
  const [collaborators, setCollaborators] = useState(() =>
    getCollection(COLLECTIONS.COLABORADORES),
  )
  const [selectedIds, setSelectedIds] = useState(() => new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [columnFilters, setColumnFilters] = useState(createEmptyColumnFilters)
  const [filtrosPanelOpen, setFiltrosPanelOpen] = useState(false)
  // Read fresh on every render (not cached in state) so the Times tab always
  // reflects the current localStorage contents, including teams created via
  // the quick-create flow in a collaborator's Time modal after this page
  // already mounted.
  const times = getCollection(COLLECTIONS.TIMES)

  // Only teams/cargos actually assigned to at least one collaborator are
  // valid filter options - a team or cargo that exists in storage but has
  // nobody in it yet shouldn't appear as something to filter by.
  const timeOptions = useMemo(() => {
    const set = new Set()
    collaborators.forEach((collaborator) =>
      collaborator.times.forEach((name) => set.add(name)),
    )
    return Array.from(set)
  }, [collaborators])

  const cargoOptions = useMemo(() => {
    const set = new Set()
    collaborators.forEach((collaborator) =>
      collaborator.cargos.forEach((name) => set.add(name)),
    )
    return Array.from(set)
  }, [collaborators])

  const toggleFilterOption = (column, value) => {
    setColumnFilters((prev) => {
      const next = new Set(prev[column])
      if (next.has(value)) {
        next.delete(value)
      } else {
        next.add(value)
      }
      return { ...prev, [column]: next }
    })
  }

  const clearFilter = (column) => {
    setColumnFilters((prev) => ({ ...prev, [column]: new Set() }))
  }

  const filteredCollaborators = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return collaborators.filter((collaborator) => {
      if (query && !collaborator.name.toLowerCase().includes(query)) {
        return false
      }
      if (
        columnFilters.time.size > 0 &&
        !collaborator.times.some((time) => columnFilters.time.has(time))
      ) {
        return false
      }
      if (
        columnFilters.cargo.size > 0 &&
        !collaborator.cargos.some((cargo) => columnFilters.cargo.has(cargo))
      ) {
        return false
      }
      if (
        columnFilters.atividade.size > 0 &&
        !columnFilters.atividade.has(collaborator.contractType)
      ) {
        return false
      }
      const { start, end } = columnFilters.periodo
      if (start || end) {
        const activeSince = getCollaboratorActiveSince(collaborator)
        if (!activeSince) return false
        if (start && activeSince < start) return false
        if (end && activeSince > end) return false
      }
      return true
    })
  }, [collaborators, searchQuery, columnFilters])

  const filtersSummary = useMemo(() => {
    const parts = [
      ...columnFilters.time,
      ...columnFilters.cargo,
      ...columnFilters.atividade,
    ]
    if (columnFilters.periodo.start) {
      parts.push(formatDateDMonthYear(columnFilters.periodo.start))
    }
    if (columnFilters.periodo.end) {
      parts.push(formatDateDMonthYear(columnFilters.periodo.end))
    }
    return parts.join(', ')
  }, [columnFilters])

  const clearAllFilters = () => setColumnFilters(createEmptyColumnFilters())

  const teamsWithCounts = useMemo(() => {
    return times.map((team) => ({
      ...team,
      memberCount: collaborators.filter((collaborator) =>
        collaborator.times.includes(team.name),
      ).length,
    }))
  }, [times, collaborators])

  const filteredTeams = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return teamsWithCounts
    return teamsWithCounts.filter((team) =>
      team.name.toLowerCase().includes(query),
    )
  }, [teamsWithCounts, searchQuery])

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const clearSelection = () => setSelectedIds(new Set())

  const selectAll = (ids) => setSelectedIds(new Set(ids))

  const handleDelete = () => {
    const updated = removeItems(COLLECTIONS.COLABORADORES, [...selectedIds])
    setCollaborators(updated)
    clearSelection()
  }

  const handleDuplicate = () => {
    const updated = duplicateItems(COLLECTIONS.COLABORADORES, [...selectedIds])
    setCollaborators(updated)
    clearSelection()
  }

  if (addCollaboratorFlowOpen) {
    return (
      <AddCollaboratorFlow
        onExit={() => {
          setCollaborators(getCollection(COLLECTIONS.COLABORADORES))
          setAddCollaboratorFlowOpen(false)
        }}
      />
    )
  }

  return (
    <div className="home">
      <Sidebar />
      <main className="home__content">
        <div className="home__inner">
          <PageHeader
            title="Gestão de Pessoas"
            onNovoClick={() => setNovoModalOpen(true)}
          />
          <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
          {activeTab === 'colaboradores' ? (
            <div className="home__panel">
              <CollaboradoresToolbar
                total={collaborators.length}
                view={view}
                onViewChange={setView}
                onFiltrosClick={() => setFiltrosPanelOpen(true)}
                filtersSummary={filtersSummary}
                onClearAllFilters={clearAllFilters}
              />
              {view === 'table' ? (
                <CollaboratorsTable
                  collaborators={filteredCollaborators}
                  selectedIds={selectedIds}
                  onToggleSelect={toggleSelect}
                  onSelectAll={selectAll}
                  onDeselectAll={clearSelection}
                  columnFilters={columnFilters}
                  onToggleFilterOption={toggleFilterOption}
                  onClearFilter={clearFilter}
                  timeOptions={timeOptions}
                  cargoOptions={cargoOptions}
                  atividadeOptions={ATIVIDADE_OPTIONS}
                />
              ) : (
                <CollaboratorsGrid
                  collaborators={filteredCollaborators}
                  selectedIds={selectedIds}
                  onToggleSelect={toggleSelect}
                />
              )}
            </div>
          ) : activeTab === 'times' ? (
            <div className="home__panel">
              <TimesToolbar total={times.length} />
              <TimesGrid teams={filteredTeams} />
            </div>
          ) : (
            <div className="home__panel" />
          )}
        </div>
      </main>

      {novoModalOpen && (
        <NovoModal
          onClose={() => setNovoModalOpen(false)}
          onSelectColaborador={() => {
            setNovoModalOpen(false)
            setAddCollaboratorFlowOpen(true)
          }}
        />
      )}

      <FiltrosPanel
        isOpen={filtrosPanelOpen}
        onClose={() => setFiltrosPanelOpen(false)}
        filters={columnFilters}
        onSave={setColumnFilters}
        timeOptions={timeOptions}
        cargoOptions={cargoOptions}
        atividadeOptions={ATIVIDADE_OPTIONS}
      />

      {selectedIds.size > 0 ? (
        <BulkActionBar
          count={selectedIds.size}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
          onClose={clearSelection}
        />
      ) : (
        <BottomSearchBar
          key={activeTab}
          activeTab={activeTab}
          onSearchChange={setSearchQuery}
        />
      )}
    </div>
  )
}

export default Home
