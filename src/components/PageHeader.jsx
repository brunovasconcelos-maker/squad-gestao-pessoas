import { Plus } from '@phosphor-icons/react'
import './PageHeader.css'

function PageHeader({ title }) {
  return (
    <div className="page-header">
      <h1 className="page-header__title">{title}</h1>
      <button type="button" className="page-header__new-button">
        <Plus size={24} weight="bold" />
        Novo
      </button>
    </div>
  )
}

export default PageHeader
