import { useState } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Tabs from '../components/Tabs.jsx'
import SearchBar from '../components/SearchBar.jsx'
import CollaboratorsTable from '../components/CollaboratorsTable.jsx'
import NovoModal from '../components/addCollaborator/NovoModal.jsx'
import AddCollaboratorFlow from '../components/addCollaborator/AddCollaboratorFlow.jsx'
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

  if (addCollaboratorFlowOpen) {
    return (
      <AddCollaboratorFlow onExit={() => setAddCollaboratorFlowOpen(false)} />
    )
  }

  return (
    <div className="home">
      <Sidebar />
      <main className="home__content">
        <PageHeader
          title="Gestão de Pessoas"
          onNovoClick={() => setNovoModalOpen(true)}
        />
        <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
        {activeTab === 'colaboradores' ? (
          <div className="home__panel">
            <SearchBar />
            <CollaboratorsTable />
          </div>
        ) : (
          <div className="home__panel" />
        )}
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
    </div>
  )
}

export default Home
