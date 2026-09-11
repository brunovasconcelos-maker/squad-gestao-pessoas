import { useState } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Tabs from '../components/Tabs.jsx'
import CollaboradoresToolbar from '../components/CollaboradoresToolbar.jsx'
import CollaboratorsTable from '../components/CollaboratorsTable.jsx'
import CollaboratorsGrid from '../components/CollaboratorsGrid.jsx'
import BulkActionBar from '../components/BulkActionBar.jsx'
import NovoModal from '../components/addCollaborator/NovoModal.jsx'
import AddCollaboratorFlow from '../components/addCollaborator/AddCollaboratorFlow.jsx'
import {
  getCollection,
  removeItems,
  duplicateItems,
  COLLECTIONS,
} from '../utils/storage.js'
import './Home.css'

const TABS = [
  { id: 'colaboradores', label: 'Colaboradores' },
  { id: 'times', label: 'Times' },
  { id: 'cargos', label: 'Cargos' },
  { id: 'beneficios', label: 'Benefícios' },
]

function Home() {
  const [activeTab, setActiveTab] = useState('colaboradores')
  const [novoModalOpen, setNovoModalOpen] = useState(false)
  const [addCollaboratorFlowOpen, setAddCollaboratorFlowOpen] = useState(false)
  const [view, setView] = useState('table')
  const [collaborators, setCollaborators] = useState(() =>
    getCollection(COLLECTIONS.COLABORADORES),
  )
  const [selectedIds, setSelectedIds] = useState(() => new Set())

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
      <AddCollaboratorFlow onExit={() => setAddCollaboratorFlowOpen(false)} />
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
              />
              {view === 'table' ? (
                <CollaboratorsTable
                  collaborators={collaborators}
                  selectedIds={selectedIds}
                  onToggleSelect={toggleSelect}
                />
              ) : (
                <CollaboratorsGrid
                  collaborators={collaborators}
                  selectedIds={selectedIds}
                  onToggleSelect={toggleSelect}
                />
              )}
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

      <BulkActionBar
        count={selectedIds.size}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
        onClose={clearSelection}
      />
    </div>
  )
}

export default Home
