import { useState } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Tabs from '../components/Tabs.jsx'
import SearchBar from '../components/SearchBar.jsx'
import CollaboratorsTable from '../components/CollaboratorsTable.jsx'
import './Home.css'

const TABS = [
  { id: 'colaboradores', label: 'Colaboradores' },
  { id: 'times', label: 'Times' },
  { id: 'cargos', label: 'Cargos' },
  { id: 'beneficios', label: 'Benefícios' },
]

function Home() {
  const [activeTab, setActiveTab] = useState('colaboradores')

  return (
    <div className="home">
      <Sidebar />
      <main className="home__content">
        <PageHeader title="Gestão de Pessoas" />
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
    </div>
  )
}

export default Home
